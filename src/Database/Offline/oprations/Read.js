import { initDB } from "../ConnectDB";

// Example function to get users
const GETUSER =async (db) => {
  if(!db){
    db= await initDB();
  }
  const allRows = await db.getAllAsync("SELECT * FROM userdata;");
  return allRows;
}

const GETEVENTS =async (db) => {
  
  if (!db) {
    db= await initDB(); // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM eventsdata");
  return allRows;
}

const VENDORS =async (db) => {
  
  if (!db) {
    db= await initDB(); // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM vendordata");
  return allRows;
}


class GETDATASETS {

  check(){
    console.log("class work fine");
  }

  async fetchDataSet () {
    console.log("initializing database and fetch ");
    const db= await initDB();

    console.log("Fetching userData from database 🚫");
    let userData = await GETUSER(db);
    console.log("got userData ✅");

    if(userData.length<=0){
      return ({STATUS:404,MES:"There is no user found"});
    }
    
    console.log("Fetching eventData from database 🚫");
    let eventsData = await GETEVENTS(db);
    console.log("got eventData ✅");

    console.log("Fetching vendors from database 🚫");
    let vendorData = await VENDORS(db);
    console.log("got vendorData ✅");

    const result = {STATUS:200, UserData:userData[0],EventData:eventsData, VendorData:vendorData};
    
    return result;
  }

}
export {GETUSER,GETEVENTS,GETDATASETS}