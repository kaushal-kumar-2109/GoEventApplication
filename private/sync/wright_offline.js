import { initDB } from "../database/offline/connect";

const Write_Offline_Event = async (data) => {
    const db = await initDB();
    try {
        data.forEach(async element => {
            const q = `INSERT INTO EVENT_DATA (EVENT_ID, USER_ID, EVENT_NAME, EVENT_DATE, EVENT_AMOUNT, EVENT_LOCATION, EVENT_TIME, EVENT_ABOUT, EVENT_HIGHLIGHT, EVENT_TYPE, EVENT_CREATED_AT, EVENT_BANNER, EVENT_CODE, EVENT_STATUS) VALUES ('${element.EVENT_ID}', '${element.USER_ID}', '${element.EVENT_NAME}', '${element.EVENT_DATE}', '${element.EVENT_AMOUNT}', '${element.EVENT_LOCATION}', '${element.EVENT_TIME}', '${element.EVENT_ABOUT}', '${element.EVENT_HIGHLIGHT}', '${element.EVENT_TYPE}', '${element.EVENT_CREATED_AT}', '${element.EVENT_BANNER}', '${element.EVENT_CODE}', '${element.EVENT_STATUS}')`;
            const res = await db.execAsync(q);
        });
    } catch (err) {
        console.log("Write Error:", err);
    }
    return { STATUS: 200, DATA: data };
}

export { Write_Offline_Event };