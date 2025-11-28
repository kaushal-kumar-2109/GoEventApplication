import { initDB } from "../ConnectDB";
import { CREATE_LOG } from "./log";

// Example function to create users
const CREATE_USER = async (data) => {
    const db= await initDB();
    if (!db) {
      return ({STATUS:500,MES:"Error in database."});
    }
    if(!data){
      console.log("Data not present to create user.");
      return ({STATUS:404,MES:"Data are missing."});
    }

//  -- for the login page 
    if(data.Data.task==='login'){
      let q = `INSERT INTO userdata VALUES ('${data.ActalData.id}','${data.ActalData.USERNAME}','${data.ActalData.USEREMAIL}','${data.ActalData.USERPASS}','${data.ActalData.COUNTRY}','${data.ActalData.PROFILEPIC}','${data.ActalData.USERNUMBER}','${data.ActalData.CREATEDAT}');`;
      const result = await db.runAsync(q);
      if(result.changes==1){
        return({STATUS:200,MES:'Data saved !'});
      }else{
        return({STATUS:500,mes:'data not save!'});
      }
    }
//  -- login end

//  -- reset password 
    if(data.Data.task==='reset'){
      q = `INSERT INTO userdata VALUES ('${data.ActalData.id}','${data.ActalData.USERNAME}','${data.ActalData.USEREMAIL}','${data.Data. UserPassword}','${data.ActalData.COUNTRY}','${data.ActalData.PROFILEPIC}','${data.ActalData.USERNUMBER}','${data.ActalData.CREATEDAT}');`;
      const result = await db.runAsync(q);
      if(result.changes==1){
        console.log("User data created ✅");
        let uq = `UPDATE userdata SET USERPASS = '${data.Data.UserPassword}' WHERE id='${data.ActalData.id}';`
        let log = await CREATE_LOG(data.ActalData.id,uq);
        if(log.STATUS==200){
          return({STATUS:200,MES:'Data saved !'});
        }
        return({STATUS:500,MES:"err"});
      }else{
        return({STATUS:500,mes:'data not save!'});
      }
    }
//  -- reset password end 

//  -- for the signup 
    let id = GET_RANDOM_ID();
    let q = `INSERT INTO userdata VALUES ('${id}','${data.Data.UserName}','${data.Data.UserEmail}','${data.Data.UserPassword}','${data.Country}','null','${data.Data.UserNumber}','${Date.now()}');`;
    const result = await db.runAsync(q);
    if(result.changes==1){
      console.log("User data created ✅");
      let log = await CREATE_LOG(id,q);
      if(log.STATUS==200){
        return({STATUS:200,MES:'Data saved !'});
      }
      return({STATUS:500,MES:"err"});
    }
    else{
      return({STATUS:500,mes:'data not save!'});
    }
//  -- for signup end 
}

export { CREATE_USER };

const GET_RANDOM_ID = () => {
  const characters = "qwertyuiopasdfghjklmnbvcxz1234567890QWERTYUIOPASDFGHJKLZXCVBNM"
  let id="";
  for(let i=0;i<25;i++){
    let v = Math.floor(Math.random()*characters.length);
    id = id+characters[v];
  }
  return id;
}