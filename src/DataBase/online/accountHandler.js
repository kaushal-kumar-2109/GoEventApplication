// importing user-build componets 
import { checkInternet } from '../../../utils/checkNetwork';

const CreateNewUser = async (body) => {

    console.log(body.UserEmail);
    const network = await checkInternet();
    if(!network){return false}

    console.log("uploading data");
    const resposn= await fetch("https://goeventserver.onrender.com/GoEvent/Create/User", {
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

    console.log(resposn);
    if(resposn.status==200){
      alert("Account Create Sucessfully!");
      return ({status:true,message:'User Created !'});
    }
}

export {CreateNewUser}