// Local offline SQLite database helpers.
import { initDB } from "../connect";
import { CheckInternet } from "../../../../utils/checkNetwork";
import { Create_App_Log_Online } from "../../online/oprations/create";

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
 * Writes a professional log entry to the APP_LOGS table.
 * @param {object} DB - SQLite database instance.
 * @param {string} USER_ID - The ID of the current user.
 * @param {string} type - LOG_TYPE (INFO, ERROR, WARN).
 * @param {string} message - Summarized event message.
 * @param {string} detail - (Optional) Extended details or error stack.
 */
const Write_App_Log = async (DB, USER_ID, type, message, detail = "") => {
    if (!DB || (DB.nativeDatabase && Object.keys(DB.nativeDatabase).length === 0)) {
        DB = await initDB();
        if (!DB) return;
    }
    try {
        const logId = Create_Id();
        const logTime = new Date().toISOString();

        const safeParams = [
            logId || "N/A",
            USER_ID || "SYSTEM",
            logTime,
            type || "INFO",
            message || "No message",
            detail || ""
        ];

        await DB.runAsync(
            "INSERT INTO APP_LOGS (LOG_ID, USER_ID, LOG_TIME, LOG_TYPE, LOG_MESSAGE, LOG_DETAIL) VALUES (?, ?, ?, ?, ?, ?)",
            safeParams
        );
        console.log(`[APP_LOG] ${type}: ${message}`);

        // Handle Online Sync
        try {
            if (CheckInternet()) {
                const onlineRes = await Create_App_Log_Online({
                    LOG_ID: logId,
                    USER_ID: USER_ID,
                    LOG_TIME: logTime,
                    LOG_TYPE: type,
                    LOG_MESSAGE: message,
                    LOG_DETAIL: detail
                });
                if (onlineRes.STATUS !== 200) {
                    // If online insertion fails, queue it
                    await DB.runAsync(
                        "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                        [Create_Id(), 'APP_LOGS', logId, 'create']
                    );
                }
            } else {
                // If offline, queue it for later sync
                await DB.runAsync(
                    "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                    [Create_Id(), 'APP_LOGS', logId, 'create']
                );
            }
        } catch (onlineErr) {
            console.log("Online log creation failed, logging for sync:", onlineErr.message);
            await DB.runAsync(
                "INSERT INTO LOG_DATA (LOG_ID, TABLE_NAME, DATA_ID, TASK) VALUES (?, ?, ?, ?)",
                [Create_Id(), 'APP_LOGS', logId, 'create']
            );
        }
    } catch (err) {
        console.log("Failed to write App Log:", err);
    }
}

/**
 * Reads all logs from the APP_LOGS table.
 */
const Read_App_Logs = async (DB) => {
    if (!DB) {
        DB = await initDB();
    }
    try {
        const res = await DB.getAllAsync("SELECT * FROM APP_LOGS ORDER BY LOG_TIME DESC LIMIT 100");
        return { STATUS: 200, DATA: res };
    } catch (err) {
        console.log("Error reading App Logs:", err);
        return { STATUS: 500, DATA: err };
    }
}

export { Write_App_Log, Read_App_Logs };
