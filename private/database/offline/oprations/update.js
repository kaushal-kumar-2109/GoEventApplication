import { initDB } from "../connect";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { UPDATE_INVITE_OF_CUSTOMER_ONLINE } from "../../online/oprations/update";
import { Write_App_Log } from "./app_logs";

const UPDATE_INVITE_OF_CUSTOMER = async (DB, USER_ID, memberemail, eventid, status, invitation_id) => {
  if (!DB) {
    DB = await initDB();
    if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
  }

  try {
    const allRows = await DB.runAsync(
      "UPDATE EVENT_INVITATION SET STATUS=? WHERE MEMBER_EMAIL = ? AND EVENT_ID = ?",
      [status, memberemail, eventid]
    );
    await Write_App_Log(DB, USER_ID, "INFO", "Invitation Updated", `Member: ${memberemail}, Status: ${status}`);

    if (CheckInternet()) {
      let res = UPDATE_INVITE_OF_CUSTOMER_ONLINE(memberemail, eventid, status);
      if (res.STATUS != 200) {
        await DB.runAsync(
          "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
          [Create_Id(), 'EVENT_INVITATION', invitation_id, 'UPDATE']
        );
        await Write_App_Log(DB, USER_ID, "WARN", "Online Invitation Sync Failed", `ID: ${invitation_id}`);
      }
    } else {
      await DB.runAsync(
        "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
        [Create_Id(), 'EVENT_INVITATION', invitation_id, 'UPDATE']
      );
      await Write_App_Log(DB, USER_ID, "INFO", "Offline Invitation Update Logged", `ID: ${invitation_id}`);
    }
    return ({ STATUS: 200, MES: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    await Write_App_Log(DB, USER_ID, "ERROR", "Invitation Update Failed", error.message);
    return ({ STATUS: 500, MES: "Error in updating" });
  }
}

export { UPDATE_INVITE_OF_CUSTOMER };


const Create_Id = () => {
  const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
  let id = "";

  for (let i = 0; i < 25; i++) {
    let index = Math.floor(Math.random() * serial.length);
    id += serial[index];
  }

  return id;
};