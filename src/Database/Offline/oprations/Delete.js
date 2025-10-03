import { initDB } from "../ConnectDB";

// Example function to get users
const DELETEUSER =async (id) => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  
  const allRows = await db.runAsync("DELETE FROM User WHERE id = ?", [id]);
  console.log('data deleted');
  
  return allRows;
}

export {DELETEUSER};