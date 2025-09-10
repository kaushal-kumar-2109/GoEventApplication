import { initDB } from "../db";

// Example function to get users
const GETUSER =async () => {
  const db= await initDB();
  if (!db) {
    return; // ensure db is ready
  }
  const allRows = await db.getAllAsync("SELECT * FROM User");
  return allRows;
}

export {GETUSER}


// // `execAsync()` is useful for bulk queries when you want to execute altogether.
// // Note that `execAsync()` does not escape parameters and may lead to SQL injection.
// // await db.execAsync(`PRAGMA journal_mode = WAL;CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY NOT NULL,name TEXT NOT NULL,email TEXT NOT NULL,password TEXT NOT NULL,userRole TEXT DEFAULT 'user',createdAT TEXT DEFAULT NULL,profilePic TEXT DEFAULT NULL,phone TEXT DEFAULT NULL);`);
// // `runAsync()` is useful when you want to execute some write operations.


// // const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
// // console.log(result.lastInsertRowId, result.changes);
// // await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa'); // Binding unnamed parameters from variadic arguments
// // await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']); // Binding unnamed parameters from array
// // await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' }); // Binding named parameters from object

// // // `getFirstAsync()` is useful when you want to get a single row from the database.
// // const firstRow = await db.getFirstAsync('SELECT * FROM test');
// // console.log(firstRow.id, firstRow.value, firstRow.intValue);

// // `getAllAsync()` is useful when you want to get all results as an array of objects.
// // const GETUSER =async () => {
// //   const db = await SQLite.openDatabaseAsync('GoEevent');
// //   console.log('p1');
// //   const allRows = await db.getAllAsync('SELECT * FROM test');
// //   console.log('p2');
// //   console.log(allRows);
// // }

// // export {GETUSER};
// // // `getEachAsync()` is useful when you want to iterate SQLite query cursor.
// // for await (const row of db.getEachAsync('SELECT * FROM test')) {
// //   console.log(row.id, row.value, row.intValue);
// // }

