import { APIs } from "./routers";

const GET_USER_BY_EMAIL = async (data) => {
  let response
  try{
    response = await fetch(APIs.getUserByEmail, {      //"https://goeventserver.onrender.com/goevent/user/account/login"
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

  if(res.status==true){
    return(res.res.data);
  }else{
    return res;
  }
}

export { GET_USER_BY_EMAIL };