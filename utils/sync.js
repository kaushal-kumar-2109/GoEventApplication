import { CREATE_USER } from "./apis/createApis";
import { GET_DATA } from "./apis/fetchApis";
import * as SQLite from "expo-sqlite";

export async function syncDatabase(db) {
  let resultCount = [];

  // ✅ Open DB if not passed
  const database = db ? db : await SQLite.openDatabaseAsync("GoEvent");

  // ✅ Step 1: Get local logs
  let logs = [];

  try {
    logs = await database.getAllAsync("SELECT * FROM updatelogs");
  } catch (err) {
    console.log("Log read error:", err);
  }

  // ✅ Step 2: Send logs to backend
  if (logs.length > 0) {
    const res = await CREATE_USER({ LOG: logs });

    if (res.STATUS == 200) {
      console.log("✅ Clearing log from SQLite");

      resultCount.push({
        DATA: logs,
        TABLE: "updatelogs",
        STATUS: 200,
        RESULT: res
      });

      // ✅ Correct: DELETE FROM
      try {
        await database.runAsync(`DELETE FROM updatelogs;`);
      } catch (err) {
        console.log("Delete log error:", err);
      }
    }
  }

  // ✅ Step 3: Fetch EVENTS from server
  const DATA = await GET_DATA({ data: "data" });

  if (DATA.STATUS == 200) {

    // log the the event data 
    for (let d of DATA.DATA.EVENTS) {
      let q = `
      INSERT OR REPLACE INTO eventsdata (
        id, USERID, EVENTNAME, EVENTDATE, EVENTAMOUNT,
        EVENTLOCATION, EVENTTIME, EVENTABOUT, EVENTHIGHLIGHT,
        EVENTTYPE, EVENTCREATEDAT, EVENTBANNER
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      try {
        const res = await database.runAsync(q, [d.id,d.USERID,d.EVENTNAME,d.EVENTDATE,d.EVENTAMOUNT,d.EVENTLOCATION,d.EVENTTIME,d.EVENTABOUT,d.EVENTHIGHLIGHT,d.EVENTTYPE,d.EVENTCREATEDAT,d.EVENTBANNER]);
        if(res.changes==1){
          resultCount.push({
            DATA: d,
            TABLE: "eventsdata",
            STATUS: 200
          });
        }
      } catch (err) {
        console.log("Insert event error:", err);
      }
    }
    // event data end 

    // event data start
    for (let d of DATA.DATA.VENDORS) {
      
      let q = `
      INSERT OR REPLACE INTO vendordata (
        id, USERID, VENDORNAME, VENDOREMAIL, VENDORPHONE, VENDORADDRESS, VENDORCITY, 
        VENDORSTATE, VENDORCOUNTRY, VENDORBANNER, VENDORWEBSITE, VENDORRATING, VENDORBIO, VENDORPRICE, CREATEDAT 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;
      try {
        const res = await database.runAsync(q, [d.id,d.USERID,d.VENDORNAME,d.VENDOREMAIL,d.VENDORPHONE,d.VENDORADDRESS,d.VENDORCITY,d.VENDORSTATE,d.VENDORCOUNTRY,d.VENDORBANNER,d.VENDORWEBSITE,d.VENDORRATING,d.VENDORBIO, d.VENDORPRICE,d.CREATEDAT ]);
        if(res.changes==1){
          resultCount.push({
            DATA: d,
            TABLE: "vendordata",
            STATUS: 200
          });
        }

      } catch (err) {}
    }
    // event data end

  }

  // ✅ If nothing synced
  if (resultCount.length === 0) {
    console.log("✅ Nothing to sync");
    return "empty";
  }
  else{
    console.log("Total data sync : ",resultCount.length);
    resultCount=[];
  }

  console.log("✅ Sync Completed");
  return "synced";
}
