import { initDB } from "../ConnectDB";

// Example function to get users
const GETUSER =async (db) => {
  if(!db){
    db= await initDB();
  }
  const allRows = await db.getAllAsync("SELECT * FROM User");
  return allRows;
}

const GETEVENTS =async (db) => {
  
  if (!db) {
    db= await initDB(); // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM EventsData");
  return allRows;
}

const GETSAVED =async (id,db) => {
  
  if (!db) {
    const db= await initDB();
  }
  const allRows = await db.getAllAsync(`SELECT * FROM BookMarks where USERID='${id}'`);
  return allRows;
}

const GETSAVEDLIST =async (id,db) => {
  
  if (!db) {
    const db= await initDB();
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

class GETDATASETS {

  check(){
    console.log("class work fine");
  }

  async fetchDataSet (id) {
    console.log("initializing database and fetch data with id: ",id);
    const db= await initDB();
    console.log("Fetching userData from database");
    let userData = await GETUSER(db);
    console.log("got userData");
    console.log("Fetching eventData from database");
    let eventsData = await GETEVENTS(db);
    console.log("got eventData");
    console.log("Fetching getSavedData from database");
    let getSaved = await GETSAVED(id,db);
    console.log("got savedData");
    console.log("Fetching Saved Event and Vendor from database");
    let getSavedData = await GETSAVEDLIST(id,db);
    console.log("got saved event and vendors");
    return({UserData:userData[0],EventData:eventsData,SavedEvent_Vendor_list:getSaved,SavedEvent_Vendor_Data:getSavedData});
  }

}
export {GETUSER,GETEVENTS,GETSAVED,GETSAVEDLIST,GETDATASETS}