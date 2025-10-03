import { APIs } from "./routers";

const uploadData = async (data) => {
    let response
    try{
      response = await fetch(APIs.createUser, {     //"https://goeventserver.onrender.com/goevent/create/user"
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          data
        )
      });
    }catch(error){
      return ({err:error,mes:'There is Server Error',code:500,status:false});
    }
    const res = await response.json();
    return res;

//   if(res.status==true){
//     return(res.res.data);
//   }else{
//     return res;
//   }
}

const updateData = async (data) => {
    let response
    try{
      response = await fetch(APIs.updateEmailPassword, {     //"https://goeventserver.onrender.com/goevent/update/user/account`"
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          data
        )
      });
    }catch(error){
      return ({err:error,mes:'There is Server Error',code:500,status:false});
    }
    const res = await response.json();
    return res;
}

export { uploadData,updateData };