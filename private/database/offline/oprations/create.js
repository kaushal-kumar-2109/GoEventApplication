// Local offline SQLite database helpers.
import { initDB } from "../connect";
import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";
import bcrypt from "bcryptjs";
import { encryptData, decryptData } from "../../../../utils/Hash";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { Create_Event_Online } from "../../online/oprations/create";
import { Create_Event_Invite_Online } from "../../online/oprations/create";
import { enc } from "crypto-js";
import { Write_App_Log } from "./app_logs";

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

/**
 * Hash Password.
 */
const hashPassword = async (password) => {
  const sha = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(sha, salt);
};

// Helper to ensure database parameters are safe for SQLite (no undefined values)
const sanitize = (val) => {
  if (val === undefined) return null;
  if (typeof val === 'boolean') return val ? 1 : 0;
  return val;
};

/**
 * Creates user in the application data store.
 */
const Create_User = async (DB, UID, data, task, hashPass) => {
  if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
    DB = await initDB();
    if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
  }
  try {
    let res;
    if (task == "signup") {
      const rawName = data[1][1];
      const rawEmail = data[1][0];
      const rawPass = data[1][3];
      const rawNumber = data[1][2];

      const hashedName = await encryptData(rawName);
      const hashedEmail = await encryptData(rawEmail);
      const hashedNumber = await encryptData(rawNumber);
      const USER_HASH_EMAIL = await hashField(rawEmail);
      const hashedPass = await hashPassword(rawPass);
      res = await DB.runAsync(
        "INSERT INTO USER_DATA (USER_ID, CREATED_AT, USER_NAME, USER_EMAIL, UPDATED_AT, USER_PASS, USER_NUMBER, USER_HASH_EMAIL, USER_STATUS, USER_PIC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          sanitize(UID),
          sanitize(new Date().toISOString()),
          sanitize(hashedName),
          sanitize(hashedEmail),
          sanitize(new Date().toISOString()),
          sanitize(hashedPass),
          sanitize(hashedNumber),
          sanitize(USER_HASH_EMAIL),
          1, // status: true
          'null'
        ]
      );
    } else if (task == "login") {
      const u = data[0];
      res = await DB.runAsync(
        "INSERT INTO USER_DATA (USER_ID, CREATED_AT, USER_NAME, USER_EMAIL, UPDATED_AT, USER_PASS, USER_NUMBER, USER_HASH_EMAIL, USER_STATUS, USER_PIC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          sanitize(u.USER_ID),
          sanitize(u.CREATED_AT),
          sanitize(u.USER_NAME),
          sanitize(u.USER_EMAIL),
          sanitize(u.UPDATED_AT),
          sanitize(u.USER_PASS),
          sanitize(u.USER_NUMBER),
          sanitize(u.USER_HASH_EMAIL),
          sanitize(u.USER_STATUS),
          sanitize(u.USER_PIC)
        ]
      );
    } else if (task == "reset") {
      const u = data[0];
      res = await DB.runAsync(
        "INSERT INTO USER_DATA (USER_ID, CREATED_AT, USER_NAME, USER_EMAIL, UPDATED_AT, USER_PASS, USER_NUMBER, USER_HASH_EMAIL, USER_STATUS, USER_PIC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          sanitize(u.USER_ID),
          sanitize(u.CREATED_AT),
          sanitize(u.USER_NAME),
          sanitize(u.USER_EMAIL),
          sanitize(new Date().toISOString()),
          sanitize(hashPass),
          sanitize(u.USER_NUMBER),
          sanitize(u.USER_HASH_EMAIL),
          sanitize(u.USER_STATUS),
          sanitize(u.USER_PIC)
        ]
      );
    }
    await Write_App_Log(DB, UID, "INFO", `User ${task} Successful`, `UID: ${UID}`);
    console.log("log saved ");
    return ({ STATUS: 200, DATA: res });
  } catch (err) {
    console.log("Error in the storing data : ", err);
    await Write_App_Log(DB, UID, "ERROR", `User ${task} Failed`, err.message);
    console.log(" error log saved");
    return ({ STATUS: 500, MES: err.message || "Database Error" });
  }
}

/**
 * Creates event offline in the application data store.
 */
const Create_Event_Offline = async (DB, data) => {
  try {
    if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
      DB = await initDB();
      if (!DB) {
        console.log("Error in database connection");
        return false;
      }
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
    const updatedat = new Date().toISOString();


    console.log("Creating Event");
    try {
      if (CheckInternet()) {
        const on_res = await Create_Event_Online([eventId, userid, eventname, eventdate, eventamount, eventlocation, eventtime, eventabout, eventhighlight, eventtype, eventcreatedar, eventbanner, eventcode, eventstatus, updatedat]);
        if (on_res.STATUS != 200) {
          await DB.runAsync("INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)", [Create_Id(), 'EVENT_DATA', eventId, 'create']);
        }
      } else {
        await DB.runAsync("INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)", [Create_Id(), 'EVENT_DATA', eventId, 'create']);
      }
    } catch (onlineErr) {
      console.log("Online creation failed, logging for sync:", onlineErr.message);
      await DB.runAsync("INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)", [Create_Id(), 'EVENT_DATA', eventId, 'create']);
    }

    const res = await DB.runAsync(
      "INSERT INTO EVENT_DATA (EVENT_ID, USER_ID, EVENT_NAME, EVENT_DATE, EVENT_AMOUNT, EVENT_LOCATION, EVENT_TIME, EVENT_ABOUT, EVENT_HIGHLIGHT, EVENT_TYPE, EVENT_CREATED_AT, EVENT_BANNER, EVENT_CODE, EVENT_STATUS, UPDATED_AT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        sanitize(eventId),
        sanitize(userid),
        sanitize(encryptData(eventname)),
        sanitize(encryptData(eventdate)),
        sanitize(encryptData(eventamount)),
        sanitize(encryptData(eventlocation)),
        sanitize(encryptData(eventtime)),
        sanitize(encryptData(eventabout)),
        sanitize(encryptData(eventhighlight)),
        sanitize(encryptData(eventtype)),
        sanitize(eventcreatedar),
        sanitize(encryptData(eventbanner)),
        sanitize(eventcode),
        1, // status true
        sanitize(updatedat)
      ]
    );

    // Create notification for event creation
    await Create_Notification(DB, userid, "Event Created! 🎉", `Your event "${eventname}" has been created successfully.`);

    await Write_App_Log(DB, userid, "INFO", "Event Created Offline", `Event: ${eventname}`);
    return ({ STATUS: 200, DATA: true });
  } catch (err) {
    console.log("Error in the storing data : ", err);
    await Write_App_Log(DB, data.USERID || "SYSTEM", "ERROR", "Event Creation Failed", err.message);
    return ({ STATUS: 500, DATA: err });
  }
}

/**
 * Creates notification in the application data store.
 */
const Create_Notification = async (DB, userid, title, message) => {
  try {
    if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
      DB = await initDB();
    }
    const notificationId = Create_Id();
    const time = new Date().toISOString();
    await DB.runAsync(
      "INSERT INTO NOTIFICATIONS (NOTIFICATION_ID, USER_ID, TITLE, MESSAGE, TIME, STATUS) VALUES (?, ?, ?, ?, ?, ?)",
      [sanitize(notificationId), sanitize(userid), sanitize(title), sanitize(message), sanitize(time), 'UNREAD']
    );

    // Queue for sync
    await DB.runAsync("INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)", [Create_Id(), 'NOTIFICATIONS', notificationId, 'create']);

    return { STATUS: 200 };
  } catch (err) {
    console.log("Error creating notification:", err);
    return { STATUS: 500, MES: err.message };
  }
}

/**
 * Creates booking in the application data store.
 */
const Create_Booking = async (DB, userid, eventid, eventname, attendeeData = {}) => {
  try {
    if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
      DB = await initDB();
    }
    const bookingId = Create_Id();
    const time = new Date().toISOString();
    await DB.runAsync(
      "INSERT INTO BOOKINGS (BOOKING_ID, USER_ID, EVENT_ID, ATTENDEE_NAME, ATTENDEE_EMAIL, ATTENDEE_NUMBER, ATTENDEE_GENDER, BOOKING_TIME, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [sanitize(bookingId), sanitize(userid), sanitize(eventid), sanitize(attendeeData.name), sanitize(attendeeData.email), sanitize(attendeeData.number), sanitize(attendeeData.gender), sanitize(time), 'PENDING']
    );

    // Queue for sync
    await DB.runAsync("INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)", [Create_Id(), 'BOOKINGS', bookingId, 'create']);

    // Notify user of booking
    await Create_Notification(DB, userid, "Booking Confirmed! 🎟️", `You have successfully booked "${eventname}".`);

    return { STATUS: 200 };
  } catch (err) {
    console.log("Error creating booking:", err);
    return { STATUS: 500, MES: err.message };
  }
}

/**
 * Creates event invite offline in the application data store.
 */
const Create_Event_Invite_Offline = async (DB, data) => {
  if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
    DB = await initDB();
    if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
  }

  try {
    for (let i = 0; i < data.length; i++) {
      let invitationId = Create_Id();
      let hostid = data[i].event.USER_ID;
      let member_Email = data[i].users.email;
      let eventid = data[i].event.EVENT_ID;
      let status = "PENDING";
      let created_at = new Date().toISOString();

      await DB.runAsync(
        "INSERT INTO EVENT_INVITATION (INVITATION_ID, HOST_ID, MEMBER_EMAIL, EVENT_ID, STATUS, CREATED_AT) VALUES (?, ?, ?, ?, ?, ?)",
        [sanitize(invitationId), sanitize(hostid), sanitize(member_Email), sanitize(eventid), sanitize(status), sanitize(created_at)]
      );

      try {
        if (CheckInternet()) {
          let online = await Create_Event_Invite_Online([invitationId, hostid, member_Email, eventid, status, created_at]);
          if (online.STATUS != 200) {
            await DB.runAsync(
              "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
              [Create_Id(), 'EVENT_INVITATION', invitationId, 'create']
            );
          }
        } else {
          await DB.runAsync(
            "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
            [Create_Id(), 'EVENT_INVITATION', invitationId, 'create']
          );
        }
      } catch (onlineErr) {
        console.log("Online invitation failed, logging for sync:", onlineErr.message);
        await DB.runAsync(
          "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
          [Create_Id(), 'EVENT_INVITATION', invitationId, 'create']
        );
      }
    }
    return ({ STATUS: 200 });
  } catch (err) {
    console.log("Erroe in the storing data : ", err);
    return ({ STATUS: 500, DATA: err });
  }
}

export { Create_User, Create_Event_Offline, Create_Event_Invite_Offline, Create_Notification, Create_Booking };

/**
 * Generates a new unique identifier string for database records or logs.
 */
const Create_Id = () => {
  const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
  let id = "";
  for (let i = 0; i < 25; i++) {
    let index = Math.floor(Math.random() * serial.length);
    id += serial[index];
  }
  return id;
};

/**
 * Generates a new event code string for offline event creation.
 */
function Create_Code() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}
