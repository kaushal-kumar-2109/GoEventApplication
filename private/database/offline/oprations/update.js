// Local offline SQLite database helpers.
import { initDB } from "../connect";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { UPDATE_INVITE_OF_CUSTOMER_ONLINE, UPDATE_BOOKING_STATUS_ONLINE } from "../../online/oprations/update";
import { Write_App_Log } from "./app_logs";

/**
 * UPDATE INVITE OF CUSTOMER.
 */
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

    try {
      if (await CheckInternet()) {
        let res = await UPDATE_INVITE_OF_CUSTOMER_ONLINE(memberemail, eventid, status);
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
    } catch (onlineErr) {
      console.log("Online invitation update failed, logging for sync:", onlineErr.message);
      await DB.runAsync(
        "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
        [Create_Id(), 'EVENT_INVITATION', invitation_id, 'UPDATE']
      );
    }
    return ({ STATUS: 200, MES: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    await Write_App_Log(DB, USER_ID, "ERROR", "Invitation Update Failed", error.message);
    return ({ STATUS: 500, MES: "Error in updating" });
  }
}

/**
 * UPDATE BOOKING STATUS OF CUSTOMER.
 */
const UPDATE_BOOKING_STATUS_OFFLINE = async (DB, USER_ID, bookingId, status) => {
  if (!DB) {
    DB = await initDB();
    if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
  }

  try {
    await DB.runAsync(
      "UPDATE BOOKINGS SET STATUS=? WHERE BOOKING_ID = ?",
      [status, bookingId]
    );
    await Write_App_Log(DB, USER_ID, "INFO", "Booking Updated", `Booking: ${bookingId}, Status: ${status}`);

    try {
      if (await CheckInternet()) {
        let res = await UPDATE_BOOKING_STATUS_ONLINE(bookingId, status);
        if (res.STATUS != 200) {
          await DB.runAsync(
            "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
            [Create_Id(), 'BOOKINGS', bookingId, 'UPDATE']
          );
        }
      } else {
        await DB.runAsync(
          "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
          [Create_Id(), 'BOOKINGS', bookingId, 'UPDATE']
        );
      }
    } catch (onlineErr) {
      console.log("Online booking update failed, logging for sync:", onlineErr.message);
      await DB.runAsync(
        "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
        [Create_Id(), 'BOOKINGS', bookingId, 'UPDATE']
      );
    }
    return ({ STATUS: 200, MES: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    await Write_App_Log(DB, USER_ID, "ERROR", "Booking Update Failed", error.message);
    return ({ STATUS: 500, MES: "Error in updating" });
  }
}

/**
 * UPDATE USER DATA FIELD.
 */
const UPDATE_USER_DATA_FIELD = async (DB, USER_ID, FIELD_NAME, VALUE) => {
  if (!DB) {
    DB = await initDB();
    if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
  }

  try {
    const query = `UPDATE USER_DATA SET ${FIELD_NAME} = ?, UPDATED_AT = ? WHERE USER_ID = ?`;
    await DB.runAsync(query, [VALUE, new Date().toISOString(), USER_ID]);
    await Write_App_Log(DB, USER_ID, "INFO", `User ${FIELD_NAME} Updated`, `New Value length: ${VALUE.length}`);
    return ({ STATUS: 200, MES: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    await Write_App_Log(DB, USER_ID, "ERROR", `User ${FIELD_NAME} Update Failed`, error.message);
    return ({ STATUS: 500, MES: "Error in updating" });
  }
}

export { UPDATE_INVITE_OF_CUSTOMER, UPDATE_USER_DATA_FIELD, UPDATE_BOOKING_STATUS_OFFLINE };


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