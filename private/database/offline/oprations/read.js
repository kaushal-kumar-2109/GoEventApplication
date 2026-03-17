import { initDB } from "../connect";
import * as Crypto from "expo-crypto";
import { decryptData } from "../../../../utils/Hash";
import { CheckInternet } from "../../../../utils/checkNetwork";

// duplicate of hashing helper from create.js; keep in sync
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

const Read_From_userdata = async (DB) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Reading data from the userdata");
    try {
        let res = await DB.getAllAsync("SELECT * FROM USER_DATA;");
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading userdata:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_userdata_By_ID = async (DB, ID) => {
    if (!DB) {
        DB = await initDB();
        if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
    }

    try {
        let res = await DB.getAllAsync("SELECT * FROM USER_DATA WHERE USER_ID = ?", [ID]);
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading userdata:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_User_By_Email = async (DB, email) => {
    if (!DB) {
        DB = await initDB();
    }

    try {
        // For encrypted data, we need to fetch all and filter in-memory
        let allUsers = await DB.getAllAsync(`SELECT * FROM USER_DATA;`);
        const user = allUsers.find(u => {
            try {
                return decryptData(u.USER_EMAIL) === email;
            } catch (e) {
                // If decryption fails, maybe it was still hashed (old data)
                return false;
            }
        });

        if (user) {
            return { STATUS: 200, DATA: [user] };
        } else {
            return { STATUS: 200, DATA: [] };
        }
    } catch (err) {
        console.log("Error in reading userdata by email:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_evetndata = async (DB) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Reading data from the EVENT_DATA");
    try {
        let res = await DB.getAllAsync("SELECT * FROM EVENT_DATA;");
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading EVENT_DATA:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_evetndata_By_ID = async (DB, ID) => {
    if (!DB) {
        DB = await initDB();
        if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
    }

    try {
        let res = await DB.getAllAsync("SELECT * FROM EVENT_DATA WHERE EVENT_ID = ?", [ID]);
        // console.log("Event data : ",res);
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading EVENT_DATA:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_venderdata = async (DB) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Reading data from the venderdata");
    try {
        let res = await DB.getAllAsync("SELECT * FROM vendordata;");
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading venderdata:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_venderdata_By_ID = async (DB, ID) => {
    if (!DB) {
        DB = await initDB();
        if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
    }
    console.log("Reading data from the venderdata by ID : ", ID);
    try {
        let res = await DB.getAllAsync("SELECT * FROM vendordata WHERE Id = ?", [ID]);
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading venderdata:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_All_Offline_Data = async (DB, USERID) => {
    console.log("Reading all offline data for the user : ", USERID);
    try {
        if (!DB) {
            DB = await initDB();
            if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
        }
        let events = await DB.getAllAsync("SELECT * FROM EVENT_DATA where USER_ID = ?", [USERID]);
        // let vendors = await DB.getAllAsync("SELECT * FROM vendordata where USERID = ?", [USERID]);
        if (events.length == 0) {
            events = false;
        }
        // if (vendors.length == 0) {
        //     vendors = false;
        // }
        return ({ STATUS: 200, EVENTS: events });
    } catch (err) {
        console.log("Error in reading data : ", err);
        return ({ STATUS: 500, DATA: err });
    }
}

const Read_From_InvitationList_By_EventID = async (DB, EVENTID) => {

    if (!DB) {
        DB = await initDB();
        if (!DB) return { STATUS: 500, MES: "DB Init Failed" };
    }
    try {
        let res = await DB.getAllAsync("SELECT * FROM EVENT_INVITATION WHERE EVENT_ID = ?", [EVENTID]);
        return ({ STATUS: 200, DATA: res });
    } catch (err) {
        console.log("Error in reading invitation list:", err);
        return ({ STATUS: 500, DATA: err });
    }
}

export {
    Read_From_userdata,
    Read_From_evetndata,
    Read_From_venderdata,
    Read_From_venderdata_By_ID,
    Read_All_Offline_Data,
    Read_From_evetndata_By_ID,
    Read_From_InvitationList_By_EventID,
    Read_From_userdata_By_ID
};