import * as SQLite from "expo-sqlite";


async function initDB() {
  const db = await SQLite.openDatabaseAsync("GoEvent");
  // Create table if not exists
  try{
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      userRole TEXT DEFAULT 'user',
      createdAT TEXT DEFAULT NULL,
      profilePic TEXT DEFAULT NULL,
      phone TEXT DEFAULT NULL
    );
  `);
  console.log("Database initialized ✅");
  return db;
  }catch(err){
    console.log("Error in Database initialization.:",err);
    return false;
  }
}

export {initDB};