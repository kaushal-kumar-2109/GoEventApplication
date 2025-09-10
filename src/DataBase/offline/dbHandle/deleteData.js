import { initDB } from "../db";

// Example function to get users
const DELETEUSER =async (id) => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  console.log('h1');
  const allRows = await db.runAsync("DELETE FROM User WHERE id = ?", [id]);
  console.log('h2');
  console.log(allRows);
  console.log('data deleted');
  
  return allRows;
}

const TRUNCATEUSER = async () => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  console.log('h1');
  const allRows = await db.runAsync("TRUNCATE TABLE User;");
  console.log('h2');
  console.log(allRows);
  console.log('all data deleted');
  
  return allRows;
}

export {DELETEUSER,TRUNCATEUSER};