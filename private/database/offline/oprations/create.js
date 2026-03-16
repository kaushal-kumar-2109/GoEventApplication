import { initDB } from "../connect";
import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";
import { encryptData, decryptData } from "../../../../utils/Hash";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { Create_Event_Online } from "../../online/oprations/create";
import { enc } from "crypto-js";

// bcryptjs randomness fallback using expo-crypto
bcrypt.setRandomFallback((len) => {
  const array = new Uint8Array(len);
  try {
    Crypto.getRandomValues(array);
  } catch (e) {
    // Fallback if native crypto is not available (e.g. in some environments)
    for (let i = 0; i < len; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return array;
});

// helper for double SHA-256 hashing (same as online)
const hashField = async (value) => {
  if (typeof value !== "string") return value;
  const first = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    value
  );
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    first
  );
};

const hashPassword = async (password) => {
  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha, salt);
};

const Create_User = async (DB, UID, data, task, hashPass) => {
  try {
    let q;
    if (!DB) {
      DB = await initDB();
      console.log("Error int database connection");
      return false;
    }
    console.log("Creating User");

    if (task == "signup") {
      // hash sensitive fields before insertion
      const rawName = data[1][1];
      const rawEmail = data[1][0];
      const rawPass = data[1][3];
      const rawNumber = data[1][2];

      const hashedName = await encryptData(rawName);
      const hashedEmail = await encryptData(rawEmail);
      const hashedNumber = await encryptData(rawNumber);
      const USER_HASH_EMAIL = await hashField(rawEmail);
      const hashedPass = await hashPassword(rawPass);
      q = `INSERT INTO USER_DATA VALUES ('${UID}','${new Date().toISOString()}','${hashedName}','${hashedEmail}','${new Date().toISOString()}','${hashedPass}','${hashedNumber}','${USER_HASH_EMAIL}',true,'null');`;
    }
    if (task == "login") {
      // login path may insert existing values; hash them too
      q = `INSERT INTO USER_DATA VALUES ('${data[0].USER_ID}','${data[0].CREATED_AT}','${data[0].USER_NAME}','${data[0].USER_EMAIL}','${data[0].UPDATED_AT}','${data[0].USER_PASS}','${data[0].USER_NUMBER}','${data[0].USER_HASH_EMAIL}','${data[0].USER_STATUS}','${data[0].USER_PIC}');`;
    }
    if (task == "reset") {

      q = `INSERT INTO USER_DATA VALUES ('${data[0].USER_ID}','${data[0].CREATED_AT}','${data[0].USER_NAME}','${data[0].USER_EMAIL}','${new Date().toISOString()}','${hashPass}','${data[0].USER_NUMBER}','${data[0].USER_HASH_EMAIL}','${data[0].USER_STATUS}','${data[0].USER_PIC}');`;
    }

    let res = await DB.getAllAsync(q);
    return ({ STATUS: 200, DATA: res });
  } catch (err) {
    console.log("Erroe in the storing data : ", err);
  }
}

const Create_Event_Offline = async (DB, data) => {
  try {
    if (!DB) {
      DB = await initDB();
      console.log("Error int database connection");
      return false;
    }

    const eventId = Create_Id();
    const userid = data.USERID;
    const eventname = data.EVENTNAME;
    const eventdate = data.EVENTDATE;
    const eventamount = data.EVENTAMOUNT;
    const eventlocation = data.EVENTLOCATION;
    const eventtime = data.EVENTTIME;
    const eventabout = data.EVENTABOUT;
    const eventhighlight = data.EVENTHIGHLIGHT;
    const eventtype = data.EVENTTYPE;
    const eventcreatedar = new Date().toISOString();
    const eventbanner = data.EVENTBANNER;
    const eventcode = Create_Code();
    const eventstatus = true;


    console.log("Creating Event");
    if (CheckInternet()) {
      const on_res = await Create_Event_Online([eventId, userid, eventname, eventdate, eventamount, eventlocation, eventtime, eventabout, eventhighlight, eventtype, eventcreatedar, eventbanner, eventcode, eventstatus]);
      if (on_res.STATUS != 200) {
        let q1 = `INSERT INTO LOG_DATA VALUES ('${Create_Id()}','EVENT_DATA','${eventId}','create');`;
        let res1 = await DB.getAllAsync(q1);
      }
    } else {
      let q1 = `INSERT INTO LOG_DATA VALUES ('${Create_Id()}','EVENT_DATA','${eventId}','create');`;
      let res1 = await DB.getAllAsync(q1);
    }

    let q = `INSERT INTO EVENT_DATA VALUES ('${eventId}','${userid}','${encryptData(eventname)}','${encryptData(eventdate)}','${encryptData(eventamount)}','${encryptData(eventlocation)}','${encryptData(eventtime)}','${encryptData(eventabout)}','${encryptData(eventhighlight)}','${encryptData(eventtype)}','${eventcreatedar}','${encryptData(eventbanner)}','${eventcode}',${eventstatus});`;
    let res = await DB.getAllAsync(q);
    return ({ STATUS: 200, DATA: true });
  } catch (err) {
    console.log("Erroe in the storing data : ", err);
    return ({ STATUS: 500, DATA: err });
  }
}

const Create_Event_Invite_Offline = async (DB, data) => {
  if (!DB) {
    DB = await initDB();
  }

  try {

    for (let i = 0; i < data.length; i++) {
      let invitationId = Create_Id();
      let q = `INSERT INTO EVENT_INVITATION VALUES ('${invitationId}','${data[i].event.USER_ID}','${data[i].users.email}','${data[i].event.EVENT_ID}','PENDING','${new Date().toISOString()}');`;
      let res = await DB.getAllAsync(q);

      let q1 = `INSERT INTO LOG_DATA VALUES ('${Create_Id()}','EVENT_INVITATION','${invitationId}','create');`;
      let res2 = await DB.getAllAsync(q1);

    }
    return ({ STATUS: 200 });
  } catch (err) {
    console.log("Erroe in the storing data : ", err);
    return ({ STATUS: 500, DATA: err });
  }

}

export { Create_User, Create_Event_Offline, Create_Event_Invite_Offline };

const Create_Id = () => {
  const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
  let id = "";

  for (let i = 0; i < 25; i++) {
    let index = Math.floor(Math.random() * serial.length);
    id += serial[index];
  }

  return id;
};

function Create_Code() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}
