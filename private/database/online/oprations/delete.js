import { SUP_BASE } from "../connect";

const Delete_Event_Online = async (UID, EID) => {
    const { data, error } = await SUP_BASE
        .from("EVENT_DATA")
        .update({
            EVENT_STATUS: false,
            UPDATED_AT: new Date().toISOString()
        })
        .eq("EVENT_ID", EID)
        .select();

    if (error) {
        console.log("Delete Error:", error);
        return { STATUS: 500 };
    } else {
        console.log("Deleted Successfully:");
        return { STATUS: 200 };
    }
}

export { Delete_Event_Online }
