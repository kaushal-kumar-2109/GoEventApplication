// importing pri-build components
import { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity,Text,View,StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';

// importing user-build components
import { alignItem, colorSchema, display, felx, justifyContent } from "../../styles/constant";
import { CSS } from "../../styles/basicStyle";
import { TextCOLORS } from "../../styles/global";

const FootBar = () => {

  const [home,setHome] = useState(TextCOLORS.primary);
  const [event,setEvent] = useState({});
  const [vendor,setVendor] = useState({});
  const [user,setUser] = useState({});

  const checkLink = (target) => {
    switch (target) {
      case 'home':
        setHome(TextCOLORS.primary);
        setEvent({});
        setVendor({});
        setUser({});
        break;
      case 'event':
        setHome({});
        setEvent(TextCOLORS.primary);
        setVendor({});
        setUser({});
        break;
      case 'vendor':
        setHome({});
        setEvent({});
        setVendor(TextCOLORS.primary);
        setUser({});
        break;
      case 'user':
        setHome({});
        setEvent({});
        setVendor({});
        setUser(TextCOLORS.primary);
        break;
  
      default:
        break;
    }
  }

    const navigation = useNavigation();

    return(
    <View className="Footer" style={[display.df,felx.fd_r,justifyContent.jc_se,colorSchema.bgLighter,CSS['py20'],SS.foot]}>

      <TouchableOpacity onPress={()=>{navigation.navigate("Home");checkLink('home')}} style={[display.df,alignItem.ali_c,justifyContent.jc_c]}>
        <MaterialIcons name="home" size={24} style={[home,CSS['fw9']]}/>
        <Text style={[home,CSS['fw9']]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{navigation.navigate("Event");checkLink('event')}} style={[display.df,alignItem.ali_c,justifyContent.jc_c]}>
        <MaterialIcons name="event" size={24} style={[event,CSS['fw9']]}/>
        <Text style={[event,CSS['fw9']]}>Events</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{navigation.navigate("Vendor");checkLink('vendor')}} style={[display.df,alignItem.ali_c,justifyContent.jc_c]}>
        <MaterialIcons name="web-asset" size={24} style={[vendor,CSS['fw9']]}/>
        <Text style={[vendor,CSS['fw9']]}>Vendors</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{navigation.navigate("User");checkLink('user')}} tyle={[display.df,alignItem.ali_c,justifyContent.jc_c]}>
        <AntDesign name="user" size={24} style={[user,CSS['fw9']]}/>
        <Text style={[user,CSS['fw9']]}>User</Text>
      </TouchableOpacity>
      
    </View>
    )
}

const SS = StyleSheet.create({
    foot:{
        // position:'absolute',
        borderTopWidth:0.6,
        borderTopColor:'#9691917e',
        zIndex:1,
        width:'100%',
        bottom:0
    }
})
export {FootBar};