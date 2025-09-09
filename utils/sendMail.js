import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";
import { checkInternet } from "./checkNetwork";

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

const sendMail = async (email) => {
    if(! await checkInternet()){return false};
    const otp = OtpCreater();
    const resposn= await fetch("http://10.86.127.18:3000/GoEvent/User/Email/Otp", {
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