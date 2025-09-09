// importing user-build componets 
import { checkInternet } from '../../../utils/checkNetwork';

const CreateNewUser = async (body) => {

    console.log(body);
    
    if(await checkInternet()){return false}

    const resposn= await fetch("https://goeventserver.onrender.com/GoEvent/Create/User", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // console.log(resposn.status);
}

export {CreateNewUser}