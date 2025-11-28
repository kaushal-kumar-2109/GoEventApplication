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

const DELETETABLES =async () => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  
  const allRows = await db.runAsync("DROP TABLE userdata");
  const allRow = await db.runAsync("DROP TABLE eventsdata");
  const aw = await db.runAsync("DROP TABLE updatelogs");
  const ven = await db.runAsync("DROP TABLE vendordata");
  console.log('data deleted');
  
  
  return true;
}
// DELETETABLES();

export {DELETEUSER,DELETETABLES};