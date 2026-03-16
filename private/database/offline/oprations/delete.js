import { initDB } from "../connect";

const Delete_Userdata = async (DB) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Delete data from the USER_DATA");
    let res = await DB.getAllAsync("DROP TABLE USER_DATA;");
    return ({ STATUS: 200, DATA: res });
}

const Delete_EventData = async (DB, UID, EID) => {
    if (!DB) {
        DB = await initDB();
    }
    console.log("Delete data from the EventData");
    try {
        let res = await DB.getAllAsync(`DELETE FROM EVENT_DATA WHERE EVENT_ID ='${EID}';`);
        let res2 = await DB.getAllAsync(`INSERT INTO LOG_DATA VALUES ('${Create_Id()}','EVENT_DATA','${EID}','delete');`);
        if (res) {
            return res;
        }
    } catch (err) {
        console.log("err", err);
        return ({ STATUS: 500, DATA: err });
    }
    return false;
}

export { Delete_Userdata, Delete_EventData };

const Create_Id = () => {
    const serial = "1234567890qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ";
    let id = "";

    for (let i = 0; i < 25; i++) {
        let index = Math.floor(Math.random() * serial.length);
        id += serial[index];
    }

    return id;
};