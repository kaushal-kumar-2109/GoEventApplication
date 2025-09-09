import db from "../db";

export const addUser = (id, name, email, password, phone = 'none', role = 'user', profilepic = 'none') => {
  return new Promise((resolve, reject) => {
    const createdAt = new Date().toISOString(); // store in ISO format
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO user (id, name, email, phone, password, role, createdAt, profilepic) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [id, name, email, phone, password, role, createdAt, profilepic],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};
