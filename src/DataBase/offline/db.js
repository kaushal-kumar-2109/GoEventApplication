import * as SQLite from "expo-sqlite";

// open or create database (sync API works well in RN/Expo)
const db = SQLite.openDatabaseSync("goevent.db");

// create table if not exists
export const initDB = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      email TEXT,
      phone TEXT DEFAULT 'none',
      password TEXT,
      role TEXT DEFAULT 'user',
      createdAt TEXT,
      profilepic TEXT DEFAULT 'none'
    );
  `);
};

export default db;
