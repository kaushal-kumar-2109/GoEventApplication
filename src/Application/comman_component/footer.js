// importing pri-build components
import { View,Text,StyleSheet,TouchableOpacity } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';

// importing custom components
import { FONTS,COLORS } from '../../../public/global';
import { useEffect, useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

/**
 * Foot Bar.
 */
const FootBar = ({setPageStack,getPageStack}) => {
    const { isDarkMode, colors: theme } = useTheme();
    const [getHomeColor,setHomeColor] = useState('#6B7280');
    const [getEventColor,setEventColor] = useState('#6B7280');
    const [getVendorColor,setVendorColor] = useState('#6B7280');
    const [getProfileColor,setProfileColor] = useState('#6B7280');
    
    /**
     * Set Color.
     */
    const setColor = () => {
        const activeColor = theme.primary;
        const inactiveColor = isDarkMode ? '#94A3B8' : '#6B7280';
        
        (getPageStack[getPageStack.length-1]==='home')?setHomeColor(activeColor):setHomeColor(inactiveColor);
        (getPageStack[getPageStack.length-1]==='event')?setEventColor(activeColor):setEventColor(inactiveColor);
        (getPageStack[getPageStack.length-1]==='vendor')?setVendorColor(activeColor):setVendorColor(inactiveColor);
        (getPageStack[getPageStack.length-1]==='user')?setProfileColor(activeColor):setProfileColor(inactiveColor);
    }

    useEffect(()=>{
        setColor();
    },[getPageStack, isDarkMode])

    return(
        <>
        <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
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

// Style definitions for the styles component.
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