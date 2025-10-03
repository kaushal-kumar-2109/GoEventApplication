import { APIs } from "./routers";

const sendEmail = async (data) => {
  let response
  try{
    response = await fetch(APIs.sendOtpByEmail, {      //"https://goeventserver.onrender.com/goevent/user/account/login"
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
    return({data:{OTP:res.otp},status:true});
  }else{
    alert("Not able to send 'OTP' check 'Email'");
    return ({status:false});
  }
}

export {sendEmail};