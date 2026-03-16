import { SUP_BASE } from "../database/online/connect";
import { Write_Offline_Event } from "./wright_offline";

const Load_Event_Data = async () => {
    const { data, error } = await SUP_BASE
        .from("EVENT_DATA")
        .select("*");

    if (error) {
        console.log("Read Error:", error);
        return { STATUS: 500, DATA: error };
    }
    else {
        const res = await Write_Offline_Event(data);
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

export { Load_Event_Data };