// importing pri-build components
import { View,Text, ScrollView, TouchableOpacity, TextInput,StyleSheet, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState,useEffect } from "react";

// importing user-build componentes 
import { COLORS,FONTS } from "../../../public/styles/global";
import { ForGotPassword } from "./forgetPassword";
import { USERSETUPDATA } from "../../../utils/global";

// importing functions 
import { getUserData } from "../../../utils/apis/fetchApis";

const LoginPage = ({setPageStack}) => {

    // othet assets variables
    const [vewPassword,setViewPassword] = useState(false);
    const [forgotPassword,setForgotPassword] = useState(false);

    // user assets variables
    const [getUserEmail,setUserEmail] = useState('');
    const [getUserPassword,setUserPassword] = useState('');

    // user error variables
    const [getUserEmailErr,setUserEmailErr] = useState(false);
    const [getUserPasswordErr,setUserPasswordErr] = useState(false);
    const [getMainError,setMainError] = useState(false);

    //function
    const loginAccount = async () => {
        setMainError(false);
        (getUserEmail.trim()=='')?setUserEmailErr('Email is Required❗'):setUserEmailErr(false);
        (getUserPassword.trim()=='')?setUserPasswordErr('User Password is Required❗'):setUserPasswordErr(false);

        if(getUserEmail.trim()=='' || getUserPassword.trim()==''){
            return;
        }

        let emailPart = getUserEmail.trim().split('@');
        if('@'+emailPart[1]!='@gmail.com'){setUserEmailErr("Enter Valid Email Address! ");return;}

        USERSETUPDATA['Data']={UserEmail:getUserEmail,UserPassword:getUserPassword,task:'login'};

        setPageStack(pageStack => [...pageStack,'verification']);

        // const data = await getUserData({userEmail:getUserEmail,userPassword:getUserPassword,task:'login'});
        
        // if(data.status==false){
        //     console.log(data);
        //     setMainError(data.res.mes);
        //     return;
        // }
        // else{
        //     console.log('need Restart App');
        // }
        
    }

    // useEffect(() => {
    //   loginAccount();
    // }, [loginAccount]);


    return(
        <>
        {forgotPassword
        ?
            <ForGotPassword setForgotPassword={setForgotPassword} setPageStack={setPageStack}></ForGotPassword>
        :
            <SafeAreaView style={[{width:'100%',height:'100%'}]}>
                <ScrollView>
                    {/* Header */}
                    <View style={[{display:'flex',flexDirection:'row',paddingHorizontal:12}]}>
                        <TouchableOpacity 
                        onPress={()=>{setPageStack(prevStack => prevStack.slice(0, -1));}}
                        style={[{display:'flex',justifyContent:'center',flexDirection:'row'}]}>
                            <Ionicons name="arrow-back" size={26} color="black" />
                            <Text style={[{marginLeft:15,fontSize:20,fontStyle:600}]}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Container */}
                    <View style={[{marginTop:40,width:'100%',display:'flex',alignItems:'center'}]}>
                        <Text style={[{color:COLORS.primaryBtn,fontWeight:'700',fontSize:20}]}>Login To Your Account</Text>
                    </View>

                    {/* Main Error Message  */}
                    {(getMainError||getMainError=='err')?<Text style={[FONTS.error,{textAlign:'center'}]}>{getMainError}</Text>:<></>}

                    {/* form */}
                    <View style={[{marginTop:40,display:'flex',alignItems:'center'}]}>

                        {/* email */}
                        <View style={[styles.searchBox]}>
                            <Fontisto name="email" size={24} color="black" />
                            <TextInput
                                value={getUserEmail}
                                onChangeText={setUserEmail}
                                style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'90%',overflow:'auto'}]}
                                placeholder="example@gmail.com"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                            ></TextInput>
                        </View>
                        {(getUserEmailErr)?<View><Text style={[FONTS.error]}>{getUserEmailErr}</Text></View>:<View></View>}

                        {/* password */}
                        <View style={[styles.searchBox,{justifyContent:'space-between'}]}>
                            <View style={[{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                                <MaterialIcons name="password" size={24} color="black" />
                                <TextInput
                                    value={getUserPassword}
                                    onChangeText={setUserPassword}
                                    style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'75%',overflow:'auto'}]}
                                    placeholder="Your Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!vewPassword}
                                ></TextInput>
                            </View>
                            {!vewPassword 
                            ?   
                                <TouchableOpacity onPress={()=>{setViewPassword(!vewPassword)}} ><AntDesign name="eye-invisible" size={24} color="#aaa" /></TouchableOpacity>
                            :
                                <TouchableOpacity onPress={()=>{setViewPassword(!vewPassword)}} ><AntDesign name="eye" size={24} color="#aaa" /></TouchableOpacity>
                            }
                        </View>
                        {(getUserPasswordErr)?<View><Text style={[FONTS.error]}>{getUserPasswordErr}</Text></View>:<View></View>}

                        {/* forgor password */}
                        <View style={[{marginTop:20}]}>
                            <TouchableOpacity onPress={()=>{setForgotPassword(true)}}>
                                <Text style={[{fontWeight:500}]}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* login button */}
                    <View style={[{display:'flex',alignItems:'center',marginTop:50}]}>
                        <TouchableOpacity
                            onPress={()=>{loginAccount();}}
                            style={[styles.loginBtn]}
                        >
                            <View></View>
                            <Text style={[{color:'#ffffff'}]}>Login</Text>
                            <View style={[{backgroundColor:COLORS.secondaryBtn,borderRadius:'50%'}]}>
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        }
        </>
    )
}

export {LoginPage};

const styles = StyleSheet.create({
    searchBox:
        {
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            padding:5,
            paddingHorizontal:20,
            borderWidth:1,
            width:'85%',
            borderRadius:30,
            borderColor:'#97959549',
            color:'#000000ff',
            marginTop:20
        },
    loginBtn:
        {
            display:'flex',
            flexDirection:"row",
            justifyContent:'space-between',
            alignItems:'center',
            width:'80%',
            backgroundColor:COLORS.primaryBtn,
            borderRadius:30,
            padding:10
        }
})