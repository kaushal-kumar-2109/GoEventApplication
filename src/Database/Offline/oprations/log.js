import { initDB } from "../ConnectDB";

const CREATE_LOG = async (id,qu) => {
    const db= await initDB();
    let q2 = `INSERT INTO updatelogs VALUES ("${id}","${qu}")`;
    console.log("Saveing the log data.");
    const saved = await db.runAsync(q2);
    console.log("log data saved ✅");
    if(saved.changes == 1){
        return ({STATUS:200,MES:"Log saved"});
    }
    return false;
}

export {CREATE_LOG};