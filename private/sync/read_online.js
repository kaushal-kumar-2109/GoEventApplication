// Background sync helpers for offline/online state.
import { SUP_BASE } from "../database/online/connect";
import { Create_App_Log_Online, Create_Event_Online, Create_Event_Invite_Online, Create_Booking_Online, Create_Notification_Online } from "../database/online/oprations/create";
import { Delete_Event_Online } from "../database/online/oprations/delete";
import { UPDATE_INVITE_OF_CUSTOMER_ONLINE, UPDATE_BOOKING_STATUS_ONLINE } from "../database/online/oprations/update";
import { Write_Offline_Event, Write_Offline_Event_Invitation, Update_User_Sync_Time, Write_Offline_Bookings, Write_Offline_Notifications } from "./wright_offline";
import { initDB } from "../database/offline/connect";
import { Write_App_Log } from "../database/offline/oprations/app_logs";
import { decryptData } from "../../utils/Hash";
/**
 * Loads  event data and prepares it for use by the application.
 */
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

/**
 * Loads  event invitation and prepares it for use by the application.
 */
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
            return { STATUS: 200, DATA: data };
        }
        else {
            console.log("Data Sync Failed");
            return { STATUS: 500, DATA: res.DATA };
        }
    }
}

/**
 * Loads bookings and prepares it for use by the application.
 */
const Load_Bookings = async (DB, USER_ID) => {
    // 1. Fetch events hosted by this user to get bookings for those events (for scanning)
    const { data: hostEvents, error: eventError } = await SUP_BASE
        .from("EVENT_DATA")
        .select("EVENT_ID")
        .eq("USER_ID", USER_ID);
        
    const eventIds = hostEvents ? hostEvents.map(e => e.EVENT_ID) : [];

    // 2. Fetch bookings where user is attendee OR host of the event
    let query = SUP_BASE.from("BOOKINGS").select("*");
    
    if (eventIds.length > 0) {
        query = query.or(`USER_ID.eq.${USER_ID},EVENT_ID.in.(${eventIds.map(id => `"${id}"`).join(',')})`);
    } else {
        query = query.eq("USER_ID", USER_ID);
    }

    const { data, error } = await query;

    if (error) {
        console.log("Read Bookings Error:", error);
        return { STATUS: 500, DATA: error };
    } else {
        const res = await Write_Offline_Bookings(DB, data);
        return { STATUS: 200, DATA: data };
    }
}

/**
 * Loads notifications and prepares it for use by the application.
 */
const Load_Notifications = async (DB, USER_ID) => {
    const { data, error } = await SUP_BASE
        .from("NOTIFICATIONS")
        .select("*")
        .eq("USER_ID", USER_ID);

    if (error) {
        console.log("Read Notifications Error:", error);
        return { STATUS: 500, DATA: error };
    } else {
        const res = await Write_Offline_Notifications(DB, data);
        return { STATUS: 200, DATA: data };
    }
}

/**
 * Sync All User Data on Login.
 */
const Sync_All_User_Data_On_Login = async (DB, USER_ID) => {
    try {
        console.log("Starting Initial Data Sync for User:", USER_ID);
        await Load_Event_Data(DB);
        await Load_Event_Invitation(DB, USER_ID);
        await Load_Bookings(DB, USER_ID);
        await Load_Notifications(DB, USER_ID);
        console.log("Initial Data Sync Completed.");
        return { STATUS: 200 };
    } catch (err) {
        console.log("Initial Data Sync Failed:", err);
        return { STATUS: 500 };
    }
}


/**
 * Handle Stale Offline Data.
 */
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

        // 3. Fetch IDs pending creation (to avoid deleting events created offline that haven't synced yet)
        const pendingData = await DB.getAllAsync("SELECT DATA_ID FROM LOG_DATA WHERE TASK = 'create'");
        const pendingIds = pendingData.map(item => item.DATA_ID);

        // 4. Find IDs that are local but NOT online AND NOT pending creation
        const staleIds = localIds.filter(id => !onlineIds.includes(id) && !pendingIds.includes(id));

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

/**
 * Sync Offline App Logs.
 */
const Sync_Offline_App_Logs = async (DB) => {
    try {
        if (!DB) DB = await initDB();
        
        const pendingLogs = await DB.getAllAsync(`SELECT * FROM LOG_DATA WHERE TABLE_NAME = 'APP_LOGS' AND TASK = 'create'`);

        if (pendingLogs.length > 0) {
            console.log(`Syncing ${pendingLogs.length} pending app logs online...`);
            for (const task of pendingLogs) {
                const logEntry = await DB.getAllAsync("SELECT * FROM APP_LOGS WHERE LOG_ID = ?", [task.DATA_ID]);
                
                if (logEntry.length > 0) {
                    const onlineRes = await Create_App_Log_Online(logEntry[0]);
                    if (onlineRes.STATUS === 200) {
                        await DB.runAsync(`DELETE FROM LOG_DATA WHERE LOG_ID = '${task.LOG_ID}'`);
                    }
                } else {
                    await DB.runAsync(`DELETE FROM LOG_DATA WHERE LOG_ID = '${task.LOG_ID}'`);
                }
            }
            console.log("App logs sync completed.");
        }
    } catch (err) {
        console.log("Error syncing app logs:", err);
    }
}

/**
 * Sync Offline Data Changes.
 */
const Sync_Offline_Data_Changes = async (DB) => {
    try {
        if (!DB) DB = await initDB();

        const pendingTasks = await DB.getAllAsync(`SELECT * FROM LOG_DATA WHERE TABLE_NAME != 'APP_LOGS'`);

        if (pendingTasks.length > 0) {
            console.log(`--- Processing ${pendingTasks.length} pending offline changes ---`);
            for (const task of pendingTasks) {
                console.log(`Syncing task: ${task.TASK} for table ${task.TABLE_NAME} (ID: ${task.DATA_ID})`);
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
                    } else if (TABLE_NAME === 'BOOKINGS') {
                        if (TASK === 'create') {
                            const res = await DB.getAllAsync("SELECT * FROM BOOKINGS WHERE BOOKING_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const onlineRes = await Create_Booking_Online(res[0]);
                                if (onlineRes.STATUS === 200) success = true;
                            } else {
                                success = true;
                            }
                        } else if (TASK === 'UPDATE') {
                            const res = await DB.getAllAsync("SELECT * FROM BOOKINGS WHERE BOOKING_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const b = res[0];
                                const onlineRes = await UPDATE_BOOKING_STATUS_ONLINE(b.BOOKING_ID, b.STATUS);
                                if (onlineRes.STATUS === 200) success = true;
                            } else {
                                success = true;
                            }
                        }
                    } else if (TABLE_NAME === 'NOTIFICATIONS') {
                        if (TASK === 'create') {
                            const res = await DB.getAllAsync("SELECT * FROM NOTIFICATIONS WHERE NOTIFICATION_ID = ?", [DATA_ID]);
                            if (res.length > 0) {
                                const onlineRes = await Create_Notification_Online(res[0]);
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

/**
 * Sync Professional Process.
 */
const Sync_Professional_Process = async (DB, USER_ID) => {
    if (!DB) {
        console.log("DB missing in Sync_Professional_Process, initializing...");
        DB = await initDB();
    }
    console.log("Starting Periodic Sync for User:", USER_ID);
    await Write_App_Log(DB, USER_ID, "INFO", "Periodic Sync Started", `User: ${USER_ID}`);

    try {
        // 1. Get last sync time
        const userRes = await DB.getAllAsync("SELECT UPDATED_AT FROM USER_DATA WHERE USER_ID = ?", [USER_ID]);
        const lastSyncTime = userRes[0]?.UPDATED_AT || '0';

        // 2. Query Online for newer updates
        const { data, error } = await SUP_BASE
            .from("EVENT_DATA")
            .select("*")
            .gt("UPDATED_AT", lastSyncTime);

        if (error) {
            console.log("Periodic Sync Error (Online Fetch):", error);
            await Write_App_Log(DB, USER_ID, "ERROR", "Sync Failed (Online Fetch)", error.message);
        } else if (data && data.length > 0) {
            console.log(`Found ${data.length} new/updated/deleted events online.`);
            
            const activeEvents = data.filter(e => e.EVENT_STATUS === true || e.EVENT_STATUS === "true" || e.EVENT_STATUS === 1);
            const deletedEvents = data.filter(e => e.EVENT_STATUS === false || e.EVENT_STATUS === "false" || e.EVENT_STATUS === 0);

            if (deletedEvents.length > 0) {
                console.log(`Explicitly removing ${deletedEvents.length} deleted events from offline.`);
                for (const event of deletedEvents) {
                    await DB.runAsync("DELETE FROM EVENT_DATA WHERE EVENT_ID = ?", [event.EVENT_ID]);
                }
            }

            if (activeEvents.length > 0) {
                await Write_Offline_Event(DB, activeEvents);
                console.log(`Updated ${activeEvents.length} active events offline.`);
            }
            
            const latestUpdate = data.reduce((max, obj) => 
                obj.UPDATED_AT > max ? obj.UPDATED_AT : max, lastSyncTime);
            
            await Update_User_Sync_Time(DB, USER_ID, latestUpdate);
        }

        // Load latest invitations and bookings periodically to sync status across devices
        await Load_Event_Invitation(DB, USER_ID);
        await Load_Bookings(DB, USER_ID);
        await Load_Notifications(DB, USER_ID);
        
        // 3. Consistency Check
        await Handle_Stale_Offline_Data(DB, USER_ID);

        // 4. Sync pending application logs
        await Sync_Offline_App_Logs(DB);

        // 5. Sync pending data changes (LOG_DATA)
        await Sync_Offline_Data_Changes(DB);

        console.log("Full Professional Sync Completed Successfully.");
        await Write_App_Log(DB, USER_ID, "INFO", "Full Sync Completed");
    } catch (err) {
        console.log("Periodic Sync Process Error:", err);
        await Write_App_Log(DB, USER_ID, "ERROR", "Sync Process Crashed", err.message);
    }
}

let syncInterval = null;

/**
 * Start Sync Interval.
 */
const Start_Sync_Interval = (DB, USER_ID) => {
    if (syncInterval) {
        console.log("Sync Interval already running.");
        return;
    }

    console.log("Initializing Professional Sync Interval...");
    syncInterval = setInterval(() => {
        Sync_Professional_Process(DB, USER_ID);
    }, 30000);
}

export { Load_Event_Data, Load_Event_Invitation, Load_Bookings, Start_Sync_Interval, Sync_Offline_Data_Changes, Sync_All_User_Data_On_Login };