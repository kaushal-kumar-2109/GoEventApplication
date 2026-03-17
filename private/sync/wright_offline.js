import { initDB } from "../database/offline/connect";
import { Write_App_Log } from "../database/offline/oprations/app_logs";

const Write_Offline_Event = async (DB, data) => {
    if (!DB) {
        DB = await initDB();
    }
    try {
        for (const element of data) {
            try {
                // Use INSERT OR REPLACE to update existing events with newer data from online
                const q = `INSERT OR REPLACE INTO EVENT_DATA (EVENT_ID, USER_ID, EVENT_NAME, EVENT_DATE, EVENT_AMOUNT, EVENT_LOCATION, EVENT_TIME, EVENT_ABOUT, EVENT_HIGHLIGHT, EVENT_TYPE, EVENT_CREATED_AT, EVENT_BANNER, EVENT_CODE, EVENT_STATUS, UPDATED_AT) VALUES ('${element.EVENT_ID}', '${element.USER_ID}', '${element.EVENT_NAME}', '${element.EVENT_DATE}', '${element.EVENT_AMOUNT}', '${element.EVENT_LOCATION}', '${element.EVENT_TIME}', '${element.EVENT_ABOUT}', '${element.EVENT_HIGHLIGHT}', '${element.EVENT_TYPE}', '${element.EVENT_CREATED_AT}', '${element.EVENT_BANNER}', '${element.EVENT_CODE}', '${element.EVENT_STATUS}', '${element.UPDATED_AT}')`;
                await DB.execAsync(q);
            } catch (innerErr) {
                console.log("Write Error for EVENT_DATA:", innerErr.message);
                await Write_App_Log(DB, element.USER_ID || "SYSTEM", "ERROR", "Offline Event Write Failed", `ID: ${element.EVENT_ID}, Error: ${innerErr.message}`);
            }
        }
    } catch (err) {
        console.log("Write Process Error:", err);
    }
    return { STATUS: 200, DATA: data };
}

const Write_Offline_Event_Invitation = async (db, data) => {
    if (!db) {
        db = await initDB();
    }
    try {
        for (const element of data) {
            try {
                const q = `INSERT OR IGNORE INTO EVENT_INVITATION (INVITATION_ID, HOST_ID, MEMBER_EMAIL, EVENT_ID, STATUS, CREATED_AT) VALUES ('${element.INVITATION_ID}', '${element.HOST_ID}', '${element.MEMBER_EMAIL}', '${element.EVENT_ID}', '${element.STATUS}', '${element.CREATED_AT}')`;
                await db.execAsync(q);
            } catch (innerErr) {
                console.log("Write Error for EVENT_INVITATION:", innerErr.message);
                await Write_App_Log(db, element.HOST_ID || "SYSTEM", "ERROR", "Offline Invitation Write Failed", `ID: ${element.INVITATION_ID}, Error: ${innerErr.message}`);
            }
        }
    } catch (err) {
        console.log("Write Process Error:", err);
    }
    console.log("INVITATION Data Synced Successfully");
    return { STATUS: 200, DATA: data };
}

const Update_User_Sync_Time = async (DB, USER_ID, SYNC_TIME) => {
    if (!DB) {
        DB = await initDB();
    }
    try {
        const q = `UPDATE USER_DATA SET UPDATED_AT = '${SYNC_TIME}' WHERE USER_ID = '${USER_ID}'`;
        await DB.execAsync(q);
        return { STATUS: 200 };
    } catch (err) {
        console.log("Update Sync Time Error:", err);
        return { STATUS: 500 };
    }
}


const Delete_Unwanted_Event = async (DB,) => {
    if (!DB) {
        DB = await initDB();
    }
    try {
        const q = `SELECT EVENT_ID FROM EVENT_DATA`;
        const data = await DB.execAsync(q);
        console.log("Delete Unwanted Event Data:", data);
        return { STATUS: 200, DATA: data };
    } catch (err) {
        console.log("Delete Unwanted Event Error:", err);
        return { STATUS: 500 };
    }
}

export { Write_Offline_Event, Write_Offline_Event_Invitation, Update_User_Sync_Time, Delete_Unwanted_Event };