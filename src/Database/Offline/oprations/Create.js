import { initDB } from "../ConnectDB";

// Example function to create users
const CREATEUSER = async (data) => {
    const db= await initDB();
    if (!db) {
      return; // ensure db is ready
    }
    if(!data){
      console.log("Data not present to create user.");
      return;
    }
    const result = await db.runAsync(`INSERT INTO User VALUES ("${data._id}","${data.UserName}","${data.UserEmail}","${data.UserPassword}","${data.Country}","${data.UserCreatedAt}","${data.UserProfile}","${data.UserNumber}");`);

    if(result.changes || result){
      return({status:200,mes:'data save!'});
    }
    else{
      return({staus:false,mes:'data not save!'});
    }
}

export {CREATEUSER};