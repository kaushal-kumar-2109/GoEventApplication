import { APIs } from "../../src/Database/online/routers";

const GET_DATA = async (data) => {
  let response
  try{
    response = await fetch(APIs.getAllData, {      //"https://goeventserver.onrender.com/goevent/user/account/login"
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

export { GET_DATA };