import { initDB } from "../src/Database/Offline/ConnectDB";

const AddToOffline = async (data) => {
    const db = await initDB();

    for(let d of data){
        try{
            const result = await db.runAsync(`INSERT INTO EventsData VALUES ("${d._id}","${d.UserId}","${d.EventName}","${d.EventDate}","${d.EventAmount}","${d.EventLocation}","${d.EventTime}","${d.EventAbout}","${d.EventHighlight}","${d.EventType}","${d.EventCreatedAt}")`);
        }catch(err){
            console.log("already done");
        }
    }

    return true;
}

export {AddToOffline};