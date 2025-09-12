// importing pre-built components
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

// importing user-built components 
import { CSS } from "../../../../styles/basicStyle";
import { alignItem, colorSchema, display, felx, justifyContent } from "../../../../styles/constant";
import { sendMail } from "../../../../../../utils/sendMail";
import { RELOADAPP } from "../../../../../../utils/reloadApp";
import { getUserByEmail,updateUserByEmail } from "../../../../../../utils/fetchApi";
import { CREATEUSER } from "../../../../../DataBase/offline/dbHandle/createData";
import LottieView from "lottie-react-native";
import { DataBase } from "../../../../../../utils/GlobalVariable";


const Login = () => {
  // useState
  const [forgetPassword, setForgetPassword] = useState(false);
  const [emailEdit,setEmailEdit] = useState(true);
  const [validOtp,setValidOtp] = useState(false);
  const [loadings,setLoadings] = useState(false);

  // form states
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [femail, setFEmail] = useState('');
  const [emailOtp,setEmailOtp] = useState('');
  const [fPassword,setFPassword] = useState('');

  // error states (boolean)
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setpasswordErr] = useState(false);
  const [femailErr,setFEmailErr] = useState(false);
  const [emailOtpErr,setEmailOtpErr] = useState(false);
  const [fPasswordErr,setFPasswordErr] = useState(false);

// Send Otp to email 
  let sendOtp =async () => {
    (!femail.trim())?setFEmailErr("Email is Required! "):setFEmailErr(false);
    if(!femail.trim()){return;}

    let emailPart = femail.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'||!femail.trim()){setFEmailErr("Enter Valid Email Address! ");return;}
    setEmailEdit(false);
    alert ("otp will reach on your email soon!");
    const res =await sendMail(femail,'reset');
    setValidOtp(res.OTP);
  }

// submit handler
  let resetAccount =async () => {
    if(!femail || !fPassword || !emailOtp){
      (!femail.trim())?setFEmailErr("Email is Required! "):setFEmailErr(false);
      (!emailOtp.trim())?setEmailOtpErr("Otp is Required! "):setEmailOtpErr(false);
      (!fPassword.trim())?setFPasswordErr("Password is Required! "):setFPasswordErr(false);
      return;
    }
    let emailPart = femail.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'){setFEmailErr("Enter Valid Email Address! ");return;}
    if(isNaN(emailOtp)){setEmailOtpErr('Enter Valid Email Otp! ');return}
    setLoadings(true);
    if(parseInt(emailOtp)==parseInt(validOtp)){
      const user =await updateUserByEmail(femail,fPassword);
      if(user){
        const createResponse = await CREATEUSER(user);
        if(createResponse.status==200||createResponse.status){
          setLoadings(false)
          RELOADAPP();
        }
      }
      else{
        setLoadings(false);
        return;
      }
    }
    else{
      setLoadings(false);
      setEmailOtpErr("Otp is Wrong!");
      return;
    }

  };


  let loginAccount =async () => {
    
    (!email.trim())?setEmailErr("Email is Required! "):setEmailErr(false);
    (!password.trim())?setpasswordErr("Password is Required! "):setpasswordErr(false);
    if(!email || !password){
      return;
    }
    let emailPart = email.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'){setEmailErr("Enter Valid Email Address! ");return;}

    setLoadings(true);
    const user = await getUserByEmail(email,password);
    if(user){
      const createResponse = await CREATEUSER(user);
      if(createResponse.status==200||createResponse.status){
        setLoadings(false);
        RELOADAPP();
      }
    }
    else{
      setLoadings(false);
      return;
    }
  };

  return (
    <ScrollView>
{loadings?
      <View style={[{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}]}>
        {/* <ActivityIndicator size="large" color="#007bff" /> */}
        <LottieView
          source={require("../../../../../../assets/loader1.json")} // 👈 use your JSON file
          autoPlay
          loop
          style={{ width: 300, height: 300 }}
        />
      </View>
:
      <View style={[CSS["px5"], CSS["py30"], display.df, alignItem.ali_c, justifyContent.jc_c]}>
        <View style={[CSS["mt40"], { width: "100%" }, display.df, alignItem.ali_c]}>
          {forgetPassword?
            <>
              {/* Email */}
              <View style={inputContainer}>
                <View style={[{ width: "70%"}, display.df, felx.fd_r, alignItem.ali_c]}>
                  <Feather name="mail" size={24} />
                  <TextInput
                    placeholder="Example@gmail.com"
                    value={femail}
                    onChangeText={setFEmail}
                    keyboardType="email-address"
                    editable={emailEdit}
                    style={inputField}
                  />
                </View >
                <View style={Otpbtn}>
                  <TouchableOpacity style={button} onPress={()=>{sendOtp()}}><Text style={buttonText}>Get OTP</Text></TouchableOpacity>
                </View>
        
              </View>
              {femailErr && <Text style={errMessage}>🚫 {femailErr}</Text>}

              {/* Email OTP */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <MaterialCommunityIcons name="email-newsletter" size={24} />
                  <TextInput
                    placeholder="Enter OTP on Email"
                    value={emailOtp}
                    onChangeText={setEmailOtp}
                    style={inputField}
                  />
                </View>
              </View>
              {emailOtpErr && <Text style={errMessage}>🚫 {emailOtpErr}</Text>}

              {/* Password */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <MaterialCommunityIcons name="lock" size={24} />
                  <TextInput
                    placeholder="Enter New Password"
                    value={fPassword}
                    onChangeText={setFPassword}
                    secureTextEntry
                    style={inputField}
                  />
                </View>
              </View>
              {fPasswordErr && <Text style={errMessage}>🚫 {fPasswordErr}</Text>}
            </>
          :
            <>
              {/* Email */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <Feather name="mail" size={24} />
                  <TextInput
                    placeholder="Example@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={inputField}
                  />
                </View>
              </View>
              {emailErr && <Text style={errMessage}>🚫 {emailErr}</Text>}

              {/* Password */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <MaterialCommunityIcons name="lock" size={24} />
                  <TextInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setpassword}
                    secureTextEntry
                    style={inputField}
                  />
                </View>
              </View>
              {passwordErr && <Text style={errMessage}>🚫 {passwordErr}</Text>}
            </>
          }


          {/* toggle forget password  */}
          <View style={[display.df, felx.fd_r,CSS['mt40']]}>
            <Text>{forgetPassword ? "Know Your Password?" : "Forget Your Password?"} </Text>
            {forgetPassword?
            <TouchableOpacity onPress={() => {setForgetPassword(!forgetPassword);}}>
              <Text style={[CSS["fw8"], CSS["ml10"]]}>Try Again</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => { setForgetPassword(!forgetPassword);}}>
              <Text style={[CSS["fw8"], CSS["ml10"]]}>Reset Password</Text>
            </TouchableOpacity>
            }
          </View>


          {/* Submit button */}
          {forgetPassword?
              <View style={[{ marginTop: 40, width: "80%" }]}>
                <TouchableOpacity
                  style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
                  onPress={()=>{resetAccount();}}
                >
                  <Text style={buttonText}>Reset Account</Text>
                </TouchableOpacity>
              </View>
          :
            <View style={[{ marginTop: 40, width: "80%" }]}>
              <TouchableOpacity
                style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
                onPress={()=>{loginAccount();}}
              >
                <Text style={buttonText}>Login Account</Text>
              </TouchableOpacity>
            </View>
          }

        </View>
      </View>
}
    </ScrollView>
  );
};

export { Login };

// Styling variables
const inputContainer = [{ width: "90%", borderWidth: 0.7, borderColor: "#1f1e1e30"}, display.df, felx.fd_r, alignItem.ali_c, justifyContent.jc_sb, CSS["py5"],CSS['px10'], CSS["mt20"]];
const inputLabel = [{ width: "100%" }, display.df, felx.fd_r, alignItem.ali_c];
const Otpbtn =[{width:'auto'}];
const inputField = [CSS["ml10"], { borderLeftWidth: 1, width: "80%", borderColor: "#1f1e1e30" }, CSS["px10"]];
const errMessage = { color: "#ff0000ff" };
const button = [{ backgroundColor: "#0d00fdff", borderRadius: 10 }, CSS["p10"]];
const buttonText = [colorSchema.textLighter];
