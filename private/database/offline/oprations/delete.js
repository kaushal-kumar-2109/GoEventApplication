// Local offline SQLite database helpers.
import { initDB } from "../connect";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { Delete_Event_Online } from "../../online/oprations/delete";
import * as SQLite from "expo-sqlite";
import { Write_App_Log } from "./app_logs";

/**
 * Deletes userdata from the database or local store.
 */
const Delete_Userdata = async (DB, USER_ID) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Delete data from the USER_DATA");
    try {
        await DB.execAsync("DROP TABLE IF EXISTS USER_DATA;");
        await Write_App_Log(DB, USER_ID || "LOGOUT", "WARN", "USER_DATA Table Dropped");
        return ({ STATUS: 200 });
    } catch (err) {
        console.log("Error dropping table:", err);
        return ({ STATUS: 500, MES: err.message });
    }
}

/**
 * Deletes eventdata from the database or local store.
 */
const Delete_EventData = async (DB, UID, EID) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Delete data from the EventData");
    try {
        let res = await DB.runAsync("DELETE FROM EVENT_DATA WHERE EVENT_ID = ?", [EID]);
        await Write_App_Log(DB, UID, "INFO", "Event Deleted Offline", `ID: ${EID}`);

        try {
            if (CheckInternet()) {
                const on_res = await Delete_Event_Online(UID, EID);
                if (on_res.STATUS != 200) {
                    await DB.runAsync(
                        "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                        [Create_Id(), 'EVENT_DATA', EID, 'delete']
                    );
                    await Write_App_Log(DB, UID, "WARN", "Online Deletion Failed", `Pending sync for ${EID}`);
                }
            } else {
                await DB.runAsync(
                    "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                    [Create_Id(), 'EVENT_DATA', EID, 'delete']
                );
                await Write_App_Log(DB, UID, "INFO", "Offline Deletion Logged", `Pending sync for ${EID}`);
            }
        } catch (onlineErr) {
            console.log("Online deletion failed, logging for sync:", onlineErr.message);
            await DB.runAsync(
                "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                [Create_Id(), 'EVENT_DATA', EID, 'delete']
            );
        }

        if (res) {
            return res;
        }
    } catch (err) {
        console.log("err", err);
        await Write_App_Log(DB, UID || "SYSTEM", "ERROR", "Deletion Failed", err.message);
        return ({ STATUS: 500, DATA: err });
    }
    return false;
}

export { Delete_Userdata, Delete_EventData };

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