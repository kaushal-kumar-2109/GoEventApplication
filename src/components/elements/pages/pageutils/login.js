// importing pre-built components
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Picker} from '@react-native-picker/picker';

// importing user-built components 
import { CSS } from "../../../styles/basicStyle";
import { alignItem, colorSchema, display, felx, justifyContent } from "../../../styles/constant";
import { CreateNewUser } from "../../../../DataBase/online/accountHandler";
import { sendMail } from "../../../../../utils/sendMail";

const Login = () => {
  const [checkLogin, setCheckLogin] = useState(false);

  // form states
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("user");
  const [email, setEmail] = useState("");
  const [emailEdit,setEmailEdit] = useState(true);
  const [emailOtp, setEmailOtp] = useState("");
  // const [number, setNumber] = useState("");
  // const [numberOtp, setNumberOtp] = useState("");
  const [password, setPassword] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [validOtp,setValidOtp] = useState(false);

  // error states (boolean)
  const [userNameErr, setUserNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [emailOtpErr, setEmailOtpErr] = useState(false);
  // const [numberErr, setNumberErr] = useState(false);
  // const [numberOtpErr, setNumberOtpErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [logPasswordErr, setLogPasswordErr] = useState(false);

  // Send Otp to email 
  let sendOtp =async () => {
    (!email.trim())?setEmailErr("Email is Required! "):setEmailErr(false);
    let emailPart = email.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'||!email.trim()){setEmailErr("Enter Valid Email Address! ");return;}
    setEmailEdit(false);
    const res =await sendMail(email);
    setValidOtp(res.OTP);
  }

  // submit handler
  let createAccount =async () => {
    if(true){
      (!userName.trim())?setUserNameErr("User Name is Required! "):setUserNameErr(false);
      (!email.trim())?setEmailErr("Email is Required! "):setEmailErr(false);
      (!emailOtp.trim())?setEmailOtpErr("Email Otp is Required! "):setEmailOtpErr(false);
      // (!number.trim())?setNumberErr("Number is Required!"):setNumberErr(false);
      // (!numberOtp.trim())?setNumberOtpErr("Number Otp is Required! "):setNumberOtpErr(false);
      (!password.trim())?setPasswordErr("Password is Required! "):setPasswordErr(false);
    }
    if(!userName || !email || !emailOtp || !password){return;}
    let emailPart = email.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'){setEmailErr("Enter Valid Email Address! ");return;}
    if(isNaN(emailOtp)){setEmailOtpErr('Enter Valid Email Otp! ');return}
    // if(isNaN(number)){setNumberErr("Enter Valid Mobile Number! Without '+91' or '0' ");return}
    // if(isNaN(numberOtp)){setNumberOtpErr('Enter Valid Number Otp! ');return}
    if(parseInt(emailOtp)==parseInt(validOtp)){
      console.log('New User Got');
      CreateNewUser({UserName:userName,UserPassword:password,UserEmail:email,UserRole:userType});
    }
    else{
      setEmailOtpErr("Enter Valid Otp.");
      return;
    }
  };

// submit handler
  let loginAccount =async () => {
    if(true){
      (!email.trim())?setEmailErr("Email is Required! "):setEmailErr(false);
      (!logPassword.trim())?setLogPasswordErr("Password is Required! "):setLogPasswordErr(false);
    }
    if(!email || !logPassword){
      return;
    }
    let emailPart = email.trim().split('@');
    if('@'+emailPart[1]!='@gmail.com'){setEmailErr("Enter Valid Email Address! ");return;}

    console.log("Login account => email: ",email," password: ", logPassword);

  };

  return (
    <ScrollView>
      <View style={[CSS["px5"], CSS["py30"], display.df, alignItem.ali_c, justifyContent.jc_c]}>
        
        <Text style={[{ fontSize: 30 }, CSS["fw6"]]}>{checkLogin ? "Login" : "Signup"}</Text>

        <View style={[display.df, felx.fd_r]}>
          <Text>{checkLogin ? "Don’t have an account?" : "Already have an account?"} </Text>
          <TouchableOpacity onPress={() => setCheckLogin(!checkLogin)}>
            <Text style={[CSS["fw8"], CSS["ml10"]]}>{checkLogin ? "Register" : "Login"}</Text>
          </TouchableOpacity>
        </View>

        <View style={[CSS["mt40"], { width: "100%" }, display.df, alignItem.ali_c]}>

          {/* Signup form */}
          {!checkLogin && (
            <>


              {/* Username */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <Feather name="user" size={24} />
                  <TextInput
                    placeholder="User Name"
                    value={userName}
                    onChangeText={setUserName}
                    style={inputField}
                  />
                </View>
              </View>
              {userNameErr && <Text style={errMessage}>🚫 {userNameErr}</Text>}

              {/* userType */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <Feather name="user" size={24} />
                  <Text style={inputField}>Type : {userType}</Text>
                </View>
                <Picker
                  selectedValue={userType}
                  onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
                  style={{ height: 50, width:100,marginLeft:-15 }}
                >
                  <Picker.Item label="For Vendor" value="vendor" />
                  <Picker.Item label="For User" value="user" />
                </Picker>

              </View>

              {/* Email */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <Feather name="mail" size={24} />
                  <TextInput
                    placeholder="Example@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    editable={emailEdit}
                    style={inputField}
                  />
                </View>
                <TouchableOpacity style={button} onPress={()=>{sendOtp()}}><Text style={buttonText}>Get OTP</Text></TouchableOpacity>
              </View>
              {emailErr && <Text style={errMessage}>🚫 {emailErr}</Text>}

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

              {/* Phone Number */}
              {/* <View style={inputContainer}>
                <View style={inputLabel}>
                  <Feather name="phone" size={24} />
                  <TextInput
                    placeholder="Enter Mobile Number"
                    value={number}
                    onChangeText={setNumber}
                    keyboardType="number-pad"
                    style={inputField}
                  />
                </View>
                <TouchableOpacity style={button}><Text style={buttonText}>Get OTP</Text></TouchableOpacity>
              </View>
              {numberErr && <Text style={errMessage}>🚫 {numberErr}</Text>} */}

              {/* Phone Number OTP
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <MaterialCommunityIcons name="email-newsletter" size={24} />
                  <TextInput
                    placeholder="Enter OTP on Number"
                    value={numberOtp}
                    onChangeText={setNumberOtp}
                    keyboardType="number-pad"
                    style={inputField}
                  />
                </View>
              </View>
              {numberOtpErr && <Text style={errMessage}>🚫 {numberOtpErr}</Text>} */}

              {/* Password */}
              <View style={inputContainer}>
                <View style={inputLabel}>
                  <MaterialCommunityIcons name="lock" size={24} />
                  <TextInput
                    placeholder="Enter Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={inputField}
                  />
                </View>
              </View>
              {passwordErr && <Text style={errMessage}>🚫 {passwordErr}</Text>}
            </>
          )}

          {/* Login form */}
          {checkLogin && (
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
                    value={logPassword}
                    onChangeText={setLogPassword}
                    secureTextEntry
                    style={inputField}
                  />
                </View>
              </View>
              {logPasswordErr && <Text style={errMessage}>🚫 {logPasswordErr}</Text>}
            </>
          )}

          {/* Submit button */}
          <View style={[{ marginTop: 40, width: "80%" }]}>
            {checkLogin ? 
            <TouchableOpacity
              style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
              onPress={loginAccount}
            >
              <Text style={buttonText}>Login Account</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity
              style={[{ borderRadius: 10, width: "100%", backgroundColor: "#0d00fdff" }, CSS["p15"], display.df, alignItem.ali_c]}
              onPress={createAccount}
            >
              <Text style={buttonText}>Create Account</Text>
            </TouchableOpacity>
            }
            
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export { Login };

// Styling variables
const inputContainer = [{ width: "80%", borderWidth: 1, borderColor: "#1f1e1e30" }, display.df, felx.fd_r, alignItem.ali_c, justifyContent.jc_sb, CSS["py5"],CSS['px15'], CSS["mt20"]];
const inputLabel = [{ width: "80%" }, display.df, felx.fd_r, alignItem.ali_c];
const inputField = [CSS["ml10"], { borderLeftWidth: 1, width: "80%", borderColor: "#1f1e1e30" }, CSS["px10"]];
const errMessage = { color: "#ff0000ff" };
const button = [{ backgroundColor: "#0d00fdff", borderRadius: 10 }, CSS["p10"]];
const buttonText = [colorSchema.textLighter];
