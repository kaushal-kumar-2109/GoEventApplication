// importing pri-build components
import { View,Text, ScrollView, TouchableOpacity, TextInput,StyleSheet, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";

// importing user-build componentes 
import { COLORS, FONTS } from "../../../public/styles/global";
import { USERSETUPDATA } from "../../../utils/global";
import { GET_USER_BY_EMAIL } from "../../Database/online/fetchApis";

const SignupPage = ({setPageStack}) => {

    // othet assets variables
    const [vewPassword,setViewPassword] = useState(false);

    // user assets variables
    const [getUserEmail,setUserEmail] = useState('');
    const [getUserName,setUserName] = useState('');
    const [getUserNumber,setUserNumber] = useState('');
    const [getUserPassword,setUserPassword] = useState('');

    // user error variables
    const [getUserEmailErr,setUserEmailErr] = useState(false);
    const [getUserNameErr,setUserNameErr] = useState(false);
    const [getUserNumberErr,setUserNumberErr] = useState(false);
    const [getUserPasswordErr,setUserPasswordErr] = useState(false);

    // function
    const createAccount = async () => {
        (getUserEmail.trim()=='')?setUserEmailErr('Email is Required❗'):setUserEmailErr(false);
        (getUserName.trim()=='')?setUserNameErr('User Name is Required❗'):setUserNameErr(false);
        (getUserNumber.trim()=='')?setUserNumberErr('User Phone Number is Required❗'):setUserNumberErr(false);
        (getUserPassword.trim()=='')?setUserPasswordErr('User Password is Required❗'):setUserPasswordErr(false);

        if(getUserEmail.trim()=='' || getUserName.trim()=='' || getUserNumber.trim()=='' || getUserPassword.trim()==''){
            return;
        }

        let emailPart = getUserEmail.trim().split('@');
        if('@'+emailPart[1]!='@gmail.com'){setUserEmailErr("Enter Valid Email Address! ");return;}

        if(isNaN(getUserNumber) || getUserNumber.length>10 || getUserNumber.length<10){
            setUserNumberErr("Enter Valid Number Without +91 or 0");
            return;
        }
        USERSETUPDATA['Data']={UserEmail:getUserEmail,UserName:getUserName,UserNumber:getUserNumber,UserPassword:getUserPassword,task:'signup'}
        
        const result = await GET_USER_BY_EMAIL(USERSETUPDATA['Data']);
        if(result.STATUS != 404){
            setUserEmailErr(result.MES);
            return;
        }

        // setGotData({userEmail:getUserEmail,userName:getUserName,userNumber:getUserNumber,userPassword:getUserPassword,task:'signup'});
        setPageStack(pageStack => [...pageStack,'verification']);
    }

    return (
        <>
            <SafeAreaView style={[{width:'100%',height:'100%'}]}>
                <ScrollView>
                    {/* Header */}
                    <View style={[{display:'flex',flexDirection:'row',paddingHorizontal:12}]}>
                        <TouchableOpacity 
                        onPress={()=>{setPageStack(pageStack => pageStack.slice(0,-1))}}
                        style={[{display:'flex',justifyContent:'center',flexDirection:'row'}]}>
                            <Ionicons name="arrow-back" size={26} color="black" />
                            <Text style={[{marginLeft:15,fontSize:20,fontStyle:600}]}>Back</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Container */}
                    <View style={[{marginTop:40,width:'100%',display:'flex',alignItems:'center'}]}>
                        <Text style={[{color:COLORS.primaryBtn,fontWeight:'700',fontSize:20}]}>Create Your New Account</Text>
                    </View>

                    {/* form */}
                    <View style={[{marginTop:40,display:'flex',alignItems:'center'}]}>

                        {/* email */}
                        <View style={[styles.searchBox]}>
                            <Fontisto name="email" size={24} color="black" />
                            <TextInput
                                style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'90%',overflow:'auto'}]}
                                value={getUserEmail}
                                onChangeText={setUserEmail}
                                placeholder="example@gmail.com"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                            ></TextInput>
                        </View>
                        {(getUserEmailErr)?<View><Text style={[FONTS.error]}>{getUserEmailErr}</Text></View>:<View></View>}
                        

                        {/* user name */}
                        <View style={[styles.searchBox]}>
                            <AntDesign name="user" size={24} color="black" />
                            <TextInput
                                value={getUserName}
                                onChangeText={setUserName}
                                style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'90%',overflow:'auto'}]}
                                placeholder="Enter Full Name"
                                placeholderTextColor="#aaa"
                            ></TextInput>
                        </View>
                        {(getUserNameErr)?<View><Text style={[FONTS.error]}>{getUserNameErr}</Text></View>:<View></View>}

                        {/* phone number */}
                        <View style={[styles.searchBox]}>
                            <Fontisto name="phone" size={24} color="black" />
                            <TextInput
                                value={getUserNumber}
                                onChangeText={setUserNumber}
                                style={[{marginLeft:15,borderLeftWidth:1,paddingHorizontal:15,width:'90%',overflow:'auto'}]}
                                placeholder="Enter Mobile Number"
                                maxLength={10}
                                placeholderTextColor="#aaa"
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
                                    placeholder="Create Password"
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

                    </View>

                    {/* login button */}
                    <View style={[{display:'flex',alignItems:'center',marginTop:50}]}>
                        <TouchableOpacity
                            onPress={createAccount}
                            style={[styles.loginBtn]}
                        >
                            <View></View>
                            <Text style={[{color:'#ffffff'}]}>Create Account</Text>
                            <View style={[{backgroundColor:COLORS.secondaryBtn,borderRadius:'50%'}]}>
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export {SignupPage};

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
        },
})