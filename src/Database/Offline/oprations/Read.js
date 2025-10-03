import { initDB } from "../ConnectDB";

// Example function to get users
const GETUSER =async () => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM User");
  return allRows;
}

const GETEVENTS =async () => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM EventsData");
  return allRows;
}

const GETSAVED =async (id) => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  const allRows = await db.getAllAsync(`SELECT * FROM BookMarks where USERID='${id}'`);
  return allRows;
}

const GETSAVEDLIST =async (id) => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  const allRows = await db.getAllAsync(`SELECT * FROM BookMarks where USERID='${id}'`);
  let q="";
  for(let i=0;i<allRows.length ;i++){
    q=q+`id='${allRows[i].EVENTID}'`;
    if(i<allRows.length-1){
      q=q+" or ";
    }
  }
  // console.log(allRows);
  const allRowss = await db.getAllAsync(`SELECT * FROM EventsData where USERID='${id}' AND ${q}`);
  return allRowss;
}

export {GETUSER,GETEVENTS,GETSAVED,GETSAVEDLIST}