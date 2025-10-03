import * as SQLite from "expo-sqlite";


async function initDB() {
  const db = await SQLite.openDatabaseAsync("GoEvent");
  // Create table if not exists
  try{
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      USERNAME TEXT NOT NULL,
      USEREMAIL TEXT NOT NULL,
      USERPASS TEXT NOT NULL,
      COUNTRY TEXT DEFAULT 'India',
      CREATEDAT TEXT DEFAULT NULL,
      PROFILEPIC TEXT DEFAULT NULL,
      USERNUMBER TEXT DEFAULT NULL
    );
  `);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS EventsData (
      id TEXT PRIMARY KEY NOT NULL,
      USERID TEXT NOT NULL,
      EVENTNAME TEXT NOT NULL,
      EVENTDATE TEXT NOT NULL,
      EVENTAMOUNT TEXT NOT NULL,
      EVENTLOCATION TEXT NOT NULL,
      EVENTTIME TEXT NOT NULL,
      EVENTABOUT TEXT NOT NULL,
      EVENTHIGHLIGHT TEXT DEFAULT NULL,
      EVENTTYPE TEXT DEFAULT 'Public',
      EVENTCREATEDAT TEXT
    );
  `);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS BookMarks (
      id TEXT PRIMARY KEY NOT NULL,
      USERID TEXT NOT NULL,
      EVENTID TEXT NOT NULL UNIQUE
    );
  `);

  console.log("Database initialized ✅");
  return db;
  }catch(err){
    console.log("Error in Database initialization.:",err);
    alert('Some Error Please Restart Your App❗');
    return false;
  }
}

const db = initDB();
export {initDB,db};