import { initDB } from "../src/Database/Offline/ConnectDB";

const AddToOffline = async (data) => {
    const db = await initDB();

    for(let d of data){
        try{
            const result = await db.runAsync(`INSERT INTO BookMarks VALUES ("${d._id}","${d.UserId}","${d.EventId}")`);
            console.log("BookMark data Save!");
        }catch(err){
            console.log("already done");
        }
    }

    return true;
}

export {AddToOffline};