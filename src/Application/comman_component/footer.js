// importing pri-build components
import { View,Text,StyleSheet,TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useRouter } from "expo-router";

// importing custom components
import { FONTS } from '../../../public/styles/global';
import { useEffect, useState } from "react";

const FootBar = ({setPageStack,getPageStack}) => {

    const [getHomeColor,setHomeColor] = useState('#6B7280');
    const [getEventColor,setEventColor] = useState('#6B7280');
    const [getVendorColor,setVendorColor] = useState('#6B7280');
    const [getProfileColor,setProfileColor] = useState('#6B7280');
    
    const setColor = () => {
        getPageStack==='home'?setHomeColor('#90bfefff'):setHomeColor("#6B7280");
        getPageStack==='event'?setEventColor('#90bfefff'):setEventColor("#6B7280");
        getPageStack==='vendor'?setVendorColor('#90bfefff'):setVendorColor("#6B7280");
        getPageStack==='user'?setProfileColor('#90bfefff'):setProfileColor("#6B7280");
    }

    useEffect(()=>{
        setColor();
    },[])

    return(
        <>
        <View style={[styles.container]}>
            <View style={[{display:'flex', flexDirection:'row', alignItems:'center',justifyContent:'space-evenly',width:'100%'}]}>

{getPageStack[getPageStack.length - 1]=='home' ? 
                <TouchableOpacity style={[styles.block]} >
                    <Ionicons name="home-outline" size={20} color={getHomeColor} />
                    <Text style={[FONTS.small,{color:getHomeColor}]}>Home</Text>
                </TouchableOpacity>
:
                <TouchableOpacity style={[styles.block]} 
                onPress={()=>setPageStack(preStack => [...preStack,'home'] )}
                >
                    <Ionicons name="home-outline" size={20} color={getHomeColor} />
                    <Text style={[FONTS.small,{color:getHomeColor}]}>Home</Text>
                </TouchableOpacity>
}

{getPageStack[getPageStack.length - 1]=='event' ? 
                <TouchableOpacity style={[styles.block]} >
                    <MaterialIcons name="event" size={20} color={getEventColor} />
                    <Text style={[FONTS.small,{color:getEventColor}]}>Events</Text>
                </TouchableOpacity>
:
                <TouchableOpacity style={[styles.block]} 
                onPress={()=>setPageStack(preStack => [...preStack, "event" ] )}
                >
                    <MaterialIcons name="event" size={20} color={getEventColor} />
                    <Text style={[FONTS.small,{color:getEventColor}]}>Events</Text>
                </TouchableOpacity>
}

{getPageStack[getPageStack.length - 1]=='vendor' ? 
                <TouchableOpacity style={[styles.block]}>
                    <Fontisto name="shopping-store" size={20} color={getVendorColor} />
                    <Text style={[FONTS.small,{color:getVendorColor}]}>Vendors</Text>
                </TouchableOpacity>
:
                <TouchableOpacity style={[styles.block]} 
                onPress={()=>setPageStack(preStack => [...preStack, "vendor" ] )}
                >
                    <Fontisto name="shopping-store" size={20} color={getVendorColor} />
                    <Text style={[FONTS.small,{color:getVendorColor}]}>Vendors</Text>
                </TouchableOpacity>
}

{getPageStack[getPageStack.length - 1] == "user" ?
                <TouchableOpacity style={[styles.block]} >
                    <FontAwesome name="user-o" size={20} color={getProfileColor} />
                    <Text style={[FONTS.small,{color:getProfileColor}]}>Profile</Text>
                </TouchableOpacity>
:
                <TouchableOpacity style={[styles.block]} 
                    onPress={()=>setPageStack(preStack => [...preStack, "user" ] )}
                >
                    <FontAwesome name="user-o" size={20} color={getProfileColor} />
                    <Text style={[FONTS.small,{color:getProfileColor}]}>Profile</Text>
                </TouchableOpacity>
}

            </View>
        </View>
        </>
    )
}

export {FootBar};

const styles = StyleSheet.create({
    container:{
        paddingVertical:10,
        paddingHorizontal:15,
        width:'100%',
        height:"auto",
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#cac4c42d',
        borderTopWidth:3,
    },
    block:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    }
});