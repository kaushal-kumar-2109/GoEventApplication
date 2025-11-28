import * as SQLite from "expo-sqlite";


async function initDB() {
  const db = await SQLite.openDatabaseAsync("GoEvent");
  // Create table if not exists
  try{
    const user = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS userdata (
	    id varchar(100) PRIMARY key ,
	    USERNAME TEXT NOT NULL,
	    USEREMAIL varchar(500) NOT NULL unique,
	    USERPASS TEXT NOT NULL,
	    COUNTRY varchar(200) DEFAULT 'India',
	    PROFILEPIC TEXT DEFAULT NULL,
	    USERNUMBER TEXT DEFAULT NULL,
	    CREATEDAT TEXT DEFAULT NULL
    );
  `);

  const eventdata = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS eventsdata (
	    id varchar(100) PRIMARY KEY,
	    USERID varchar(100),
	    EVENTNAME TEXT NOT NULL,
	    EVENTDATE TEXT NOT NULL,
	    EVENTAMOUNT TEXT NOT NULL,
	    EVENTLOCATION TEXT NOT NULL,
	    EVENTTIME TEXT NOT NULL,
	    EVENTABOUT TEXT NOT NULL,
	    EVENTHIGHLIGHT TEXT DEFAULT NULL,
	    EVENTTYPE varchar(100) DEFAULT 'Public',
	    EVENTCREATEDAT TEXT default null,
      EVENTBANNER TEXT default null
    );
  `);
  
  const logtable = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS updatelogs (
	    id varchar(100) PRIMARY KEY,
	    QUE varchar(8000)
    );
  `);

  const vendordata = await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS vendordata (
      id VARCHAR(100) PRIMARY KEY,
      USERID VARCHAR(100) NOT NULL,
      VENDORNAME TEXT NOT NULL,
      VENDOREMAIL varchar(500) NOT NULL UNIQUE,
      VENDORPHONE TEXT NOT NULL,
      VENDORADDRESS TEXT DEFAULT NULL,
      VENDORCITY TEXT DEFAULT NULL,
      VENDORSTATE TEXT DEFAULT NULL,
      VENDORCOUNTRY varchar(100) DEFAULT 'India',
      VENDORBANNER TEXT DEFAULT NULL,
      VENDORWEBSITE TEXT DEFAULT NULL,
      VENDORRATING varchar(10) DEFAULT '0',
      VENDORBIO TEXT,
      VENDORPRICE TEXT,
      CREATEDAT TEXT DEFAULT NULL
    );
  `);

  const allRows = await db.getAllAsync(`SELECT * FROM updatelogs;`);
  console.log("The log table => ",allRows);

  console.log("Database initialized ✅");
  return db;
  }catch(err){
    console.log("Error in Database initialization.:",err);
    alert('Some Error Please Restart Your App❗');
    return false;
  }
}

// const db = initDB();
export {initDB};

