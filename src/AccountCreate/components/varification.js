import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from 'lottie-react-native';

import { COLORS, FONTS } from "../../../public/global";
import { CheckInternet } from "../../../utils/checkNetwork";
import { SendEmail } from "../../../mailer/sendMail";
import { RELOADAPP } from "../../../utils/reloadApp";
import { Create_User } from "../../../private/database/offline/oprations/create";
import { Create_User_Online } from "../../../private/database/online/oprations/create";
import { Update_User_Data_Online } from "../../../private/database/online/oprations/update";

const Verification = ({ getDB, setPageStack, getPageStak, getUserData, setUserData }) => {

  const [getLoader, setLoader] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(null); // track which input is active
  const [code, setCode] = useState(["", "", "", ""]);
  const [codeErr, setCodeErr] = useState(false);
  const [getSendCode, setSendCode] = useState('');
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [getDataToSet, setDataToSet] = useState({});
  const [getError, setError] = useState(false);
  const [getEmail, setEmail] = useState(false);

  // refs for OTP inputs
  const inputRefs = useRef([]);

  // Handle OTP input change
  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < code.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };


  // Format time mm:ss
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Handle resend
  const handleResend = () => {
    sendMail();
    alert("OTP Resent");
    setTimer(120);
    setIsResendDisabled(true);
    setCode(["", "", "", ""]);
    inputRefs.current[0].focus();
  };

  const setupUser = async () => {
    setCodeErr(false);
    let inputCode = 0;
    for (let i = 0; i < 4; i++) {
      inputCode += parseInt(code[i]);
      if (i < 3) {
        inputCode *= 10;
      }
    }
    if (!inputCode || inputCode == NaN) {
      setCodeErr("Enter Complete OTP❗");
      setLoader(false);
      return;
    }

    if (parseInt(getSendCode) == parseInt(inputCode)) {
      console.log('valid otp');
      setLoader(true);

      if (getUserData[1] === 'login') {
        console.log("Login ");
        const user = await Create_User(getDB, getUserData[0].USER_ID, getUserData, "login", "");
        if (user.STATUS == 200) {
          console.log('data save! ✅');
          setLoader(false);
          await RELOADAPP();
        } else {
          setLoader(false);
          setError("Data Not Save ! Try Again");
          await RELOADAPP();
        }
      }

      if (getUserData[1][4] === 'signup') {
        console.log("signup");
        const online = await Create_User_Online(getUserData);
        const user = await Create_User(getDB, online.UID, getUserData, 'signup', "");
        if (user.STATUS == 200) {
          if (online.STATUS == 200) {
            console.log('data save! ✅');
            setLoader(false);
            await RELOADAPP();
          } else {
            console.log("user creted offline not online");
            setLoader(false);
            await RELOADAPP();
          }
        }
        else {
          setLoader(false);
          setError(user.MES);
        }
      }

      if (getUserData[1] === 'reset') {
        console.log("reset");
        // const user = await CREATE_USER();
        const onlie = await Update_User_Data_Online(getUserData[0].USER_EMAIL, getUserData[0].newPass);
        if (onlie.STATUS == 200) {
          const user = await Create_User(getDB, getUserData[0].USER_ID, getUserData, "reset", onlie.UPASS);
          if (user.STATUS == 200) {
            console.log('data save! ✅');
            setLoader(false);
            await RELOADAPP();
          } else {
            console.log("user not created try again !");
            setLoader(false);
            await RELOADAPP();
          }
        } else {
          setLoader(false);
          setError("There is an issue try again !");
          await RELOADAPP();
        }

        // if(user.STATUS==200){
        //   console.log('data save!');
        //   await RELOADAPP(); 
        // }else{
        //   setError(user.MES);
        //   return;
        // }
      }
      return;
    }
    else {
      setCodeErr("Wrong OTP❗");
      return;
    }
  }

  const sendMail = async () => {
    let emailRes;
    // if(getUserData[1][2]=='reset'){
    //   setEmail(getUserData[1][1]);
    //   emailRes = await SendEmail({EMAIL:getUserData[1][0]});
    // }
    if (getPageStak[getPageStak.length - 2] == "login") {
      // use plain email the login step attached to userData
      const plainEmail = getUserData[0].originalEmail || getUserData[0].USER_EMAIL;
      setEmail(plainEmail);
      emailRes = await SendEmail({ EMAIL: plainEmail });
    }
    if (getPageStak[getPageStak.length - 2] == "signup") {
      setEmail(getUserData[1][0]);
      emailRes = await SendEmail({ EMAIL: getUserData[1][0] });
    }

    if (emailRes) {
      alert('OTP send !');
      setSendCode(emailRes);
      return;
    } else {
      setError("There is an Error.");
    }
  }

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);
  useEffect(() => {
    sendMail();
  }, [])

  return (<>
    {getLoader ?
      <View style={styles.container}>
        <LottieView
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
          source={require('../../../assets/loader/l1.json')} // put your lottie file in assets
        />
      </View>
      :
      <SafeAreaView style={{ width: '100%', height: '100%' }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
            <TouchableOpacity
              onPress={() => setPageStack(prevStack => prevStack.slice(0, -1))}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons name="arrow-back" size={26} color="black" />
              <Text style={{ marginLeft: 15, fontSize: 20, fontWeight: "600" }}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={{ marginTop: 40, width: '100%', alignItems: 'center' }}>
            <Text style={{ color: COLORS.primaryBtn, fontWeight: '700', fontSize: 20 }}>Enter Verification Code</Text>
            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 5, zIndex: 10 }}>
              Please type the verification code sent to{"\n"}

            </Text>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{getEmail}</Text>
            <Text></Text>
          </View>

          {(getError) ? <Text style={{ fontWeight: '700', fontSize: 16, color: "#fa0202ff", marginTop: 10, textAlign: 'center' }}>{getError}</Text> : <></>}

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => inputRefs.current[index] = el}
                keyboardType="number-pad"
                style={[styles.otpBox, focusedIndex === index && styles.otpBoxFocused]}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>
          {/* OTP Error */}
          {codeErr ? <Text style={[FONTS.error, { textAlign: 'center' }]}>{codeErr}</Text> : <></>}

          {/* Timer */}
          <Text style={styles.resendText}>
            Resend available in: <Text style={{ color: "#90bfefff" }}>{formatTime(timer)}</Text>
          </Text>

          {/* Resend Code */}
          <TouchableOpacity disabled={isResendDisabled} onPress={handleResend}>
            <Text style={{ color: isResendDisabled ? "#aaa" : "#90bfefff", textAlign: 'center', marginTop: 5 }}>
              Resend My Code
            </Text>
          </TouchableOpacity>

          {/* Login button */}
          <View style={[{ display: 'flex', alignItems: 'center', marginTop: 50 }]}>
            <TouchableOpacity
              onPress={() => { setupUser(); }}
              style={styles.loginBtn}
            >
              <Text style={{ color: '#ffffff', fontWeight: '600', textAlign: 'center', width: '85%' }}>Continue</Text>
              <View style={[{ backgroundColor: COLORS.secondaryBtn, borderRadius: 50 }]}>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    }</>
  );
};

export { Verification };

const styles = StyleSheet.create({
  container: {
    paddingTop: '10%',
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 60,
    marginBottom: 40,
  },
  otpBox: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 50,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  resendText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 5
  },
  loginBtn:
  {
    display: 'flex',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    backgroundColor: COLORS.primaryBtn,
    borderRadius: 30,
    padding: 10
  },
  otpBoxFocused: {
    borderColor: "#1E90FF", // change color when focused
  },
});
