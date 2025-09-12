import { checkInternet } from "./checkNetwork";
import { APIs } from "./routers";

const OtpCreater = () => {
    const char = '1234567890';
    let otp = 0 ;

    for(let i=0;i<7;i++){
        let val = Math.floor(Math.random()*10);
        let o = parseInt(char[val]);
        otp = (otp + o)*10
    }
    return(otp);
}

const sendMail = async (email,flag=false) => {

    if(! await checkInternet()){return false};

    let res = await fetch(APIs.getUesrByEmail, {           //https://goeventserver.onrender.com/goevent/user/email
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserEmail:email
      })
    });
      
    res = await res.json();

    if(!flag){
      if(res.status){
        alert("The Email Is Already In Use.");
        return;
      }
    }else{
      if(!res.status){
        alert("No Account Found With This Email.");
        return;
      }
    }

    const otp = OtpCreater();
    const resposn= await fetch(APIs.sendOtpByEmail, {       // https://goeventserver.onrender.com/goevent/sendemail
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        UserEmail:email,
        OTP:otp
      })
    });
     if(resposn.status==200){
      console.log('otp Send Sucessfully');
      alert('Otp Send Sucessfully');
      return({OTP:otp,status:true});
    }
    else{
      console.log("Otp not send");
        alert('Otp Send Error');
        return false;
    }
}

export {sendMail}