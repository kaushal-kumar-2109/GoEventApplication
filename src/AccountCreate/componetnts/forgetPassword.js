// importing pri-build components
import { View,Text, ScrollView, TouchableOpacity, TextInput,StyleSheet, Touchable } from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";

// importing user-build componentes 
import { COLORS,FONTS } from "../../../public/styles/global";
import { USERSETUPDATA } from "../../../utils/global";

const ForGotPassword = ({setForgotPassword,setPageStack}) => {

    // other variables
    const [viewPassword,setViewPassword] = useState(false);

    // user variables
    const [getUserEmail,setUserEmail] = useState('');
    const [getUserNumber,setUserNumber] = useState('');
    const [getUserPassword,setUserPassword] = useState('');

    // error variables
    const [getUserEmailErr,setUserEmailErr] = useState('');
    const [getUserNumberErr,setUserNumberErr] = useState('');
    const [getUserPasswordErr,setUserPasswordErr] = useState('');

    // function 
    const resetPassword = () => {
        (getUserEmail.trim()=='')?setUserEmailErr('Email is Required❗'):setUserEmailErr(false);
        (getUserNumber.trim()=='')?setUserNumberErr('User Phone Number is Required❗'):setUserNumberErr(false);
        (getUserPassword.trim()=='')?setUserPasswordErr('User Password is Required❗'):setUserPasswordErr(false);

        if(getUserEmail.trim()=='' || getUserNumber.trim()=='' || getUserPassword.trim()==''){
            return;
        }

        let emailPart = getUserEmail.trim().split('@');
        if('@'+emailPart[1]!='@gmail.com'){setUserEmailErr("Enter Valid Email Address! ");return;}

        if(isNaN(getUserNumber) || getUserNumber.length>10 || getUserNumber.length<10){
            setUserNumberErr("Enter Valid Number Without +91 or 0");
            return;
        }

        USERSETUPDATA['Data']={UserEmail:getUserEmail,UserNumber:getUserNumber,UserPassword:getUserPassword,task:'reset'};

        setPageStack(pageStack => [...pageStack,"verification"]);

    }

    return(
        <>
            <SafeAreaView style={[{width:'100%',height:'100%'}]}>
                <ScrollView>
                    {/* Header */}
                    <View style={[{display:'flex',flexDirection:'row',paddingHorizontal:12}]}>
                        <TouchableOpacity
                        style={[{display:'flex',justifyContent:'center',flexDirection:'row'}]}
                        onPress={()=>{setForgotPassword(false)}}
                        >
                            <Ionicons name="arrow-back" size={26} color="black" />
                            <Text style={[{marginLeft:15,fontSize:20,fontStyle:600}]}>Forgot Password</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Container */}
                    <View style={[{marginVertical:80,width:'100%',display:'flex',alignItems:'center',position:'relative'}]}>
                        <View style={[{position:'absolute',backgroundColor:'#efe3bcc3',borderRadius:'50%',padding:10,marginRight:45,zIndex:1}]}>
                            <Fontisto name="email" size={60} color="black" />
                        </View>
                        <View style={[{position:'absolute',backgroundColor:'#f4edd6c3',borderRadius:'50%',padding:10,marginLeft:45,marginTop:30}]}>
                            <Fontisto name="phone" size={60} color="black" />
                        </View>
                        <Text style={[{marginTop:130,color:'#aaa',paddingHorizontal:30,textAlign:'center'}]}>Enter your registered email and phone number to reset your password</Text>
                    </View>

                    {/* form */}
                    <View style={[{display:'flex',alignItems:'center'}]}>

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

                        {/* phone number */}
                        <View style={[styles.searchBox]}>
                            <Fontisto name="phone" size={24} color="black" />
                            <TextInput
                                value={getUserNumber}
                                onChangeText={setUserNumber}
                                style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'90%',overflow:'auto'}]}
                                placeholder="Enter Mobile Number"
                                placeholderTextColor="#aaa"
                                maxLength={10}
                            ></TextInput>
                        </View>
                        {(getUserNumberErr)?<View><Text style={[FONTS.error]}>{getUserNumberErr}</Text></View>:<View></View>}

                        {/* password */}
                        <View style={[styles.searchBox,{justifyContent:'space-between'}]}>
                            <View style={[{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                                <MaterialIcons name="password" size={24} color="black" />
                                <TextInput
                                    value={getUserPassword}
                                    onChangeText={setUserPassword}
                                    style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'75%',overflow:'auto'}]}
                                    placeholder="Your New Password"
                                    placeholderTextColor="#aaa"
                                    secureTextEntry={!viewPassword}
                                ></TextInput>
                            </View>
                            {!viewPassword 
                            ?   
                                <TouchableOpacity onPress={()=>{setViewPassword(!viewPassword)}} ><AntDesign name="eye-invisible" size={24} color="#aaa" /></TouchableOpacity>
                            :
                                <TouchableOpacity onPress={()=>{setViewPassword(!viewPassword)}} ><AntDesign name="eye" size={24} color="#aaa" /></TouchableOpacity>
                            }
                        </View>
                        {(getUserPasswordErr)?<View><Text style={[FONTS.error]}>{getUserPasswordErr}</Text></View>:<View></View>}

                        {/* Know Your Password */}
                        <View style={[{marginTop:20}]}>
                            <TouchableOpacity onPress={()=>{setForgotPassword(false)}}>
                                <Text style={[{fontWeight:500}]}>Know Your Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* login button */}
                    <View style={[{display:'flex',alignItems:'center',marginTop:50}]}>
                        <TouchableOpacity
                            onPress={resetPassword}
                            style={[styles.loginBtn]}
                        >
                            <View></View>
                            <Text style={[{color:'#ffffff'}]}>Reset Password</Text>
                            <View style={[{backgroundColor:COLORS.secondaryBtn,borderRadius:'50%'}]}>
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

export { ForGotPassword };

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