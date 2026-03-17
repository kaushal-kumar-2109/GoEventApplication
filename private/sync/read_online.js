import { SUP_BASE } from "../database/online/connect";
import { Create_App_Log_Online, Create_Event_Online, Create_Event_Invite_Online } from "../database/online/oprations/create";
import { Delete_Event_Online } from "../database/online/oprations/delete";
import { UPDATE_INVITE_OF_CUSTOMER_ONLINE } from "../database/online/oprations/update";
import { Write_Offline_Event, Write_Offline_Event_Invitation, Update_User_Sync_Time } from "./wright_offline";
import { initDB } from "../database/offline/connect";
import { Write_App_Log } from "../database/offline/oprations/app_logs";
import { decryptData } from "../../utils/Hash";

const Load_Event_Data = async (DB) => {
    const { data, error } = await SUP_BASE
        .from("EVENT_DATA")
        .select("*")
        .eq("EVENT_STATUS", true);

    if (error) {
        console.log("Read Error:", error);
        return { STATUS: 500, DATA: error };
    }
    else {
        const res = await Write_Offline_Event(DB, data);
        if (res.STATUS == 200) {
            console.log("Data Synced Successfully");
            return { STATUS: 200, DATA: data };
        }
        else {
            console.log("Data Sync Failed");
            return { STATUS: 500, DATA: res.DATA };
        }
    }
}

const Load_Event_Invitation = async (DB, USER_ID) => {
    const { data, error } = await SUP_BASE
        .from("EVENT_INVITATION")
        .select("*")
        .eq("HOST_ID", USER_ID);

    if (error) {
        console.log("Read Error:", error);
        return { STATUS: 500, DATA: error };
    }
    else {
        const res = await Write_Offline_Event_Invitation(DB, data);
        if (res.STATUS == 200) {
            console.log("Data Synced Successfully");
            Start_Sync_Interval(DB, USER_ID); // Trigger periodic sync
            return { STATUS: 200, DATA: data };
        }
        else {
            console.log("Data Sync Failed");
            return { STATUS: 500, DATA: res.DATA };
        }
    }
}

const Handle_Stale_Offline_Data = async (DB, USER_ID) => {
    if (!DB) {
        console.log("DB missing in Handle_Stale_Offline_Data, initializing...");
        DB = await initDB();
    }
    console.log("Checking for stale local data...");
    try {
        // 1. Fetch all valid online IDs for this user
        const { data: onlineData, error } = await SUP_BASE
            .from("EVENT_DATA")
            .select("EVENT_ID")
            .eq("USER_ID", USER_ID)
            .eq("EVENT_STATUS", true);

        if (error) {
            console.log("Stale Check Error (Online Fetch):", error);
            return;
        }

        const onlineIds = onlineData.map(item => item.EVENT_ID);

        // 2. Fetch all local IDs for this user
        const localData = await DB.getAllAsync("SELECT EVENT_ID FROM EVENT_DATA WHERE USER_ID = ?", [USER_ID]);
        const localIds = localData.map(item => item.EVENT_ID);

        // 3. Find IDs that are local but NOT online
        const staleIds = localIds.filter(id => !onlineIds.includes(id));

        if (staleIds.length > 0) {
            console.log(`Found ${staleIds.length} stale local records. Deleting...`);
            for (const id of staleIds) {
                await DB.runAsync("DELETE FROM EVENT_DATA WHERE EVENT_ID = ?", [id]);
            }
            console.log("Stale local data cleaned up.");
            await Write_App_Log(DB, USER_ID, "INFO", "Sync: Maintenance", `Cleaned up ${staleIds.length} stale records.`);
        } else {
            console.log("No stale local data found.");
        }
    } catch (err) {
        console.log("Stale Cleanup Process Error:", err);
        await Write_App_Log(DB, USER_ID, "ERROR", "Maintenance Failed", err.message);
    }
}

const Sync_Offline_App_Logs = async (DB) => {
    try {
        if (!DB) DB = await initDB();
        
        // 1. Fetch pending log sync tasks from LOG_DATA
        const pendingLogs = await DB.getAllAsync(`SELECT * FROM LOG_DATA WHERE TABLE_NAME = 'APP_LOGS' AND TASK = 'create'`);

        if (pendingLogs.length > 0) {
            console.log(`Syncing ${pendingLogs.length} pending app logs online...`);
            for (const task of pendingLogs) {
                // 2. Fetch the actual log entry from APP_LOGS
                const logEntry = await DB.getAllAsync("SELECT * FROM APP_LOGS WHERE LOG_ID = ?", [task.DATA_ID]);
                
                if (logEntry.length > 0) {
                    const onlineRes = await Create_App_Log_Online(logEntry[0]);
                    if (onlineRes.STATUS === 200) {
                        // 3. Delete from LOG_DATA if successful
                        await DB.runAsync(`DELETE FROM LOG_DATA WHERE LOG_ID = '${task.LOG_ID}'`);
                    }
                } else {
                    // Log entry missing, cleanup task
                    await DB.runAsync(`DELETE FROM LOG_DATA WHERE LOG_ID = '${task.LOG_ID}'`);
                }
            }
            console.log("App logs sync completed.");
        }
    } catch (err) {
        console.log("Error syncing app logs:", err);
    }
}

const Sync_Offline_Data_Changes = async (DB) => {
    try {
        if (!DB) DB = await initDB();

        // Fetch all pending data sync tasks (excluding APP_LOGS which is handled separately)
        const pendingTasks = await DB.getAllAsync(`SELECT * FROM LOG_DATA WHERE TABLE_NAME != 'APP_LOGS'`);

        if (pendingTasks.length > 0) {
            console.log(`Syncing ${pendingTasks.length} pending offline data changes...`);
            for (const task of pendingTasks) {
                let success = false;
                const { TABLE_NAME, DATA_ID, TASK } = task;

                try {
                    if (TABLE_NAME === 'EVENT_DATA') {
                        if (TASK === 'delete') {
                            const res = await DB.getAllAsync("SELECT USER_ID FROM EVENT_DATA WHERE EVENT_ID = ?", [DATA_ID]);
                            const uid = res[0]?.USER_ID || "SYSTEM";
                            const onlineRes = await Delete_Event_Online(uid, DATA_ID);
                            if (onlineRes.STATUS === 200) success = true;
                        } else if (TASK === 'create') {
                            const res = await DB.getAllAsync("SELECT * FROM EVENT_DATA WHERE EVENT_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const e = res[0];
                                // Create_Event_Online expects plain text because it encrypts internally
                                const dataArray = [
                                    e.EVENT_ID,
                                    e.USER_ID,
                                    decryptData(e.EVENT_NAME),
                                    decryptData(e.EVENT_DATE),
                                    decryptData(e.EVENT_AMOUNT),
                                    decryptData(e.EVENT_LOCATION),
                                    decryptData(e.EVENT_TIME),
                                    decryptData(e.EVENT_ABOUT),
                                    decryptData(e.EVENT_HIGHLIGHT),
                                    decryptData(e.EVENT_TYPE),
                                    e.EVENT_CREATED_AT,
                                    decryptData(e.EVENT_BANNER),
                                    e.EVENT_CODE,
                                    e.EVENT_STATUS === 1 || e.EVENT_STATUS === "true" || e.EVENT_STATUS === true,
                                    e.UPDATED_AT
                                ];
                                const onlineRes = await Create_Event_Online(dataArray);
                                if (onlineRes.STATUS === 200) success = true;
                            } else {
                                // Record gone locally, nothing to sync
                                success = true;
                            }
                        }
                    } else if (TABLE_NAME === 'EVENT_INVITATION' || TABLE_NAME === 'EVENT_INVITATTION') {
                        if (TASK === 'create') {
                            const res = await DB.getAllAsync("SELECT * FROM EVENT_INVITATION WHERE INVITATION_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const i = res[0];
                                const dataArray = [i.INVITATION_ID, i.HOST_ID, i.MEMBER_EMAIL, i.EVENT_ID, i.STATUS, i.CREATED_AT];
                                const onlineRes = await Create_Event_Invite_Online(dataArray);
                                if (onlineRes.STATUS === 200) success = true;
                            } else {
                                success = true;
                            }
                        } else if (TASK === 'UPDATE') {
                            const res = await DB.getAllAsync("SELECT * FROM EVENT_INVITATION WHERE INVITATION_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const i = res[0];
                                const onlineRes = await UPDATE_INVITE_OF_CUSTOMER_ONLINE(i.MEMBER_EMAIL, i.EVENT_ID, i.STATUS);
                                if (onlineRes.STATUS === 200) success = true;
                            } else {
                                success = true;
                            }
                        }
                    }

                    if (success) {
                        await DB.runAsync("DELETE FROM LOG_DATA WHERE LOG_ID = ?", [task.LOG_ID]);
                    }
                } catch (taskErr) {
                    console.log(`Failed to sync task ${task.LOG_ID}:`, taskErr);
                }
            }
            console.log("Offline data changes sync completed.");
        }
    } catch (err) {
        console.log("Error in Sync_Offline_Data_Changes:", err);
    }
}

const Sync_Professional_Process = async (DB, USER_ID) => {
    if (!DB) {
        console.log("DB missing in Sync_Professional_Process, initializing...");
        DB = await initDB();
    }
    console.log("Starting Periodic Sync for User:", USER_ID);
    await Write_App_Log(DB, USER_ID, "INFO", "Periodic Sync Started", `User: ${USER_ID}`);

    try {
        // 1. Get last sync time from offline USER_DATA
        const userRes = await DB.getAllAsync("SELECT UPDATED_AT FROM USER_DATA WHERE USER_ID = ?", [USER_ID]);
        const lastSyncTime = userRes[0]?.UPDATED_AT || '0';

        // 2. Query Online EVENT_DATA for newer updates (all statuses)
        const { data, error } = await SUP_BASE
            .from("EVENT_DATA")
            .select("*")
            .gt("UPDATED_AT", lastSyncTime);

        if (error) {
            console.log("Periodic Sync Error (Online Fetch):", error);
            await Write_App_Log(DB, USER_ID, "ERROR", "Sync Failed (Online Fetch)", error.message);
            return;
        }

        if (data && data.length > 0) {
            console.log(`Found ${data.length} new/updated/deleted events online.`);
            
            // 3. Separate active and deleted events
            const activeEvents = data.filter(e => e.EVENT_STATUS === true || e.EVENT_STATUS === "true" || e.EVENT_STATUS === 1);
            const deletedEvents = data.filter(e => e.EVENT_STATUS === false || e.EVENT_STATUS === "false" || e.EVENT_STATUS === 0);

            // 4. Handle Deletions (Explicit status = false)
            if (deletedEvents.length > 0) {
                console.log(`Explicitly removing ${deletedEvents.length} deleted events from offline.`);
                for (const event of deletedEvents) {
                    await DB.runAsync("DELETE FROM EVENT_DATA WHERE EVENT_ID = ?", [event.EVENT_ID]);
                }
                await Write_App_Log(DB, USER_ID, "INFO", "Sync: Deletions Handled", `Removed ${deletedEvents.length} records.`);
            }

            // 5. Write active updates to offline DB
            if (activeEvents.length > 0) {
                const writeRes = await Write_Offline_Event(DB, activeEvents);
                if (writeRes.STATUS === 200) {
                    console.log(`Updated ${activeEvents.length} active events offline.`);
                    await Write_App_Log(DB, USER_ID, "INFO", "Sync: Updates Handled", `Upserted ${activeEvents.length} records.`);
                }
            }
            
            // 6. Update local last sync time to the latest timestamp found
            const latestUpdate = data.reduce((max, obj) => 
                obj.UPDATED_AT > max ? obj.UPDATED_AT : max, lastSyncTime);
            
            await Update_User_Sync_Time(DB, USER_ID, latestUpdate);
            console.log("Periodic Sync (Updates/Deletions) Completed.");
        }
        
        // 7. Consistency Check: Remove records that no longer exist online at all
        await Handle_Stale_Offline_Data(DB, USER_ID);

        // 8. Sync pending application logs
        await Sync_Offline_App_Logs(DB);

        // 9. Sync pending data changes (LOG_DATA)
        await Sync_Offline_Data_Changes(DB);

        console.log("Full Professional Sync Completed Successfully.");
        await Write_App_Log(DB, USER_ID, "INFO", "Full Sync Completed");
    } catch (err) {
        console.log("Periodic Sync Process Error:", err);
        await Write_App_Log(DB, USER_ID, "ERROR", "Sync Process Crashed", err.message);
    }
}

let syncInterval = null;

const Start_Sync_Interval = (DB, USER_ID) => {
    if (syncInterval) {
        console.log("Sync Interval already running.");
        return;
    }

    console.log("Initializing Professional Sync Interval...");
    // Run sync every 30 seconds
    syncInterval = setInterval(() => {
        Sync_Professional_Process(DB, USER_ID);
    }, 30000);
}

export { Load_Event_Data, Load_Event_Invitation, Start_Sync_Interval };