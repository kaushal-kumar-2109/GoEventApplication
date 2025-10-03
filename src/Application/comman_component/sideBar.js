import { View,Text, TouchableOpacity,Image } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState,useEffect } from "react";
const SideBar = ({setSideBar,getPageStack,setPageStack}) => {

    const [getHomeColor,setHomeColor] = useState('#6B7280');
    const [getEventColor,setEventColor] = useState('#6B7280');
    const [getVendorColor,setVendorColor] = useState('#6B7280');
    const [getProfileColor,setProfileColor] = useState('#6B7280');
    const [getSettingColor,setSettingColor] = useState('#6B7280');

    const setColor = () => {
        getPageStack==='home'?setHomeColor('#90bfefff'):setHomeColor("#6B7280");
        getPageStack==='event'?setEventColor('#90bfefff'):setEventColor("#6B7280");
        getPageStack==='vendor'?setVendorColor('#90bfefff'):setVendorColor("#6B7280");
        getPageStack==='user'?setProfileColor('#90bfefff'):setProfileColor("#6B7280");
        getPageStack==='setting'?setSettingColor('#90bfefff'):setSettingColor("#6B7280");
    }
    
    useEffect(()=>{
        setColor();
    },[])

    return(
        <>
        <View style={[{position:'absolute',top:0,left:0,backgroundColor:'#e1dfdf6d',width:'100%',height:'100%',zIndex:1}]}>
            
            <View style={[{width:'80%',backgroundColor:"#FFFFFF",height:'100%'}]}>
                <TouchableOpacity
                style={[{marginTop:50,width:'100%', display:'flex',alignItems:'flex-end',paddingHorizontal:20}]}
                onPress={()=>setSideBar(false)}
                >
                    <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity>

                <View style={[{paddingHorizontal:5}]}>
                    <Image 
                        source={require("../../../assets/user.png")}
                        style={{ width: 150, height: 150 }}
                        resizeMode="contain"
                    ></Image>
                    <Text style={[{fontSize:17,fontWeight:600}]}>Kishore Kumar</Text>
                    <Text style={[{color:'#6d6b6bff',fontWeight:600}]}>Nothing21092003@gmail.com</Text>
                </View>

                <Text style={[{marginLeft:10,fontWeight:600,color:'#969696ff',marginTop:50}]}>Main Menu</Text>
                <View style={[{paddingHorizontal:30}]}>
                    <TouchableOpacity
                        onPress={()=>setPageStack('home')}
                        style={[{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}]}
                    >
                        <AntDesign name="home" size={17} color={getHomeColor} />
                        <Text style={[{fontSize:17,fontWeight:'600',color:getHomeColor,marginLeft:5}]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>setPageStack("event")}
                        style={[{display:'flex',flexDirection:'row',alignItems:'center',marginTop:20}]}
                    >
                        <MaterialIcons name="event" size={17} color={getEventColor} />
                        <Text style={[{fontSize:17,fontWeight:'600',color:getEventColor,marginLeft:5}]}>Events</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>setPageStack("vendor")}
                        style={[{display:'flex',flexDirection:'row',alignItems:'center',marginTop:20}]}
                    >
                        <Fontisto name="shopping-bag" size={17} color={getVendorColor} />
                        <Text style={[{fontSize:17,fontWeight:'600',color:getVendorColor,marginLeft:5}]}>Vendors</Text>
                    </TouchableOpacity>
                </View>

                <Text style={[{marginLeft:10,fontWeight:600,color:'#969696ff',marginTop:20}]}>Account</Text>
                <View style={[{paddingHorizontal:30}]}>
                    <TouchableOpacity 
                        onPress={()=>setPageStack("user")}
                        style={[{display:'flex',flexDirection:'row',alignItems:'center',marginTop:10}]}
                    >
                        <FontAwesome name="user-o" size={17} color={getProfileColor} />
                        <Text style={[{fontSize:17,fontWeight:'600',color:getProfileColor,marginLeft:5}]}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>setPageStack("setting")}
                        style={[{display:'flex',flexDirection:'row',alignItems:'center',marginTop:20}]}
                    >
                        <AntDesign name="setting" size={17} color={getSettingColor} />
                        <Text style={[{fontSize:17,fontWeight:'600',color:getSettingColor,marginLeft:5}]}>Settings</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
        </>
    )
}

export {SideBar};