// importing user-build componets 
import { checkInternet } from '../../../utils/checkNetwork';
import { CREATEUSER } from '../offline/dbHandle/createData';
import { fetchApi } from '../../../utils/fetchApi';

const CreateNewUser = async (body) => {
    const network = await checkInternet();
    if(!network){return false}

    console.log("uploading data");
    const resposn= await fetch("https://goeventserver.onrender.com/goevent/create/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserName:body.UserName,
        UserEmail:body.UserEmail,
        UserPassword:body.UserPassword,
        UserRole:body.UserRole
      })
    });

    if(resposn.status==200){
      let res = await fetch("https://goeventserver.onrender.com/goevent/user/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserEmail:body.UserEmail
      })
      });
      const Response = await res.json();
      const createResponse = await CREATEUSER(Response.res);
      if(createResponse.status==200||createResponse.status==true){
        alert("Account Create Sucessfully!");
        return ({status:true,message:'User Created !'});
      }
      else{
        alert("Account created please login ");
        return ({status:true,message:'User Created ! Try Login'});
      }
    }
    else{
      alert("There is problem in server. Try again later.")
      return({status:false,message:"User not Created dueto server error."})
    }
}

export {CreateNewUser}