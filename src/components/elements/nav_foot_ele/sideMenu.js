// importing pri-build componets 
import React, { useEffect, useRef,useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Entypo, MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// importing user-build components
import { CSS } from "../../styles/basicStyle";
import { alignItem, colorSchema, display, felx } from "../../styles/constant";
import { TextCOLORS } from "../../styles/global";
import { DataBase } from "../../../../utils/GlobalVariable";
import { DELETEUSER } from "../../../DataBase/offline/dbHandle/deleteData";
import { RELOADAPP } from "../../../../utils/reloadApp";

// creating variables 
const title = [CSS["fs25"], TextCOLORS.primary, CSS["fw9"]];
const linkTitle = [CSS["mt40"]];
const links = [display.df, felx.fd_r, alignItem.ali_c, CSS["mx5"], CSS["my10"]];
const linksIconSize = 20;
const linkName = [CSS["fs18"], CSS["fw6"], CSS["ml8"]];

const SideMenu = ({ isOpen, onClose }) => {
  const handleLogOut = () => {
    const res = DELETEUSER(DataBase.user.id);
    if(res.chages || res.chages>1){
      RELOADAPP();
    }
  }
    // creating animation 
  const widthAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);
  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"], // 👈 expands full screen
  });

  const [home,setHome] = useState(TextCOLORS.primary);
  const [event,setEvent] = useState({});
  const [vendor,setVendor] = useState({});
  const [user,setUser] = useState({});
  const [about,setAbout] = useState({});
  const [contact,setContact] = useState({});
  const [more,setMore] = useState({});
  // creating active links
  const checkLink = (target) => {
    switch (target) {
      case 'home':
        setHome(TextCOLORS.primary);setEvent({});setVendor({});setUser({});setAbout({});setContact({});setMore({});
        break;
      case 'event':
        setHome({});setEvent(TextCOLORS.primary);setVendor({});setUser({});setAbout({});setContact({});setMore({});
        break;
      case 'vendor':
        setHome({});setEvent({});setVendor(TextCOLORS.primary);setUser({});setAbout({});setContact({});setMore({});
        break;
      case 'user':
        setHome({});setEvent({});setVendor({});setUser(TextCOLORS.primary);setAbout({});setContact({});setMore({});
        break;
      case 'about':
        setHome({});setEvent({});setVendor({});setUser({});setAbout(TextCOLORS.primary);setContact({});setMore({});
        break;
      case 'contact':
        setHome({});setEvent({});setVendor({});setUser({});setAbout({});setContact(TextCOLORS.primary);setMore({});
        break;
      case 'more':
        setHome({});setEvent({});setVendor({});setUser({});setAbout({});setContact({});setMore(TextCOLORS.primary);
        break;
  
      default:
        break;
    }
  }

  const navigation = useNavigation();

  return (
    <Animated.View style={[SS.sideBG, colorSchema.bgLight, { width: animatedWidth }]}>
      <View style={[SS.container, colorSchema.bgLighter, CSS["px10"], CSS["py40"]]}>
        {/* close btn */}
        <View style={[display.df, alignItem.ali_fe, { width: "100%" }, CSS["px20"]]}>
          <TouchableOpacity style={{ width: 40 }} onPress={onClose}>
            <Entypo name="cross" size={40} color="black" />
          </TouchableOpacity>
        </View>

        {/* title */}
        <View style={CSS["mt20"]}>
          <Text style={title}>GoEvent</Text>
        </View>

        {/* explore section */}
        <View>
          <Text style={linkTitle}>EXPLORE</Text>
          <TouchableOpacity onPress={()=>{navigation.navigate("Home");checkLink('home')}}>
            <View style={links}>
              <MaterialIcons name="home" size={linksIconSize} style={[home]} />
              <Text style={[linkName,home]}>Home</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate("Event");checkLink('event')}}>
            <View style={links}>
              <MaterialIcons name="event" size={linksIconSize} style={[event]} />
              <Text style={[linkName,event]}>Events</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate("Vendor");checkLink('vendor')}}>
            <View style={links}>
              <MaterialIcons name="web-asset" size={linksIconSize} style={[vendor]} />
              <Text style={[linkName,vendor]}>Vendor</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate("User");checkLink('user')}}>
            <View style={links}>
              <AntDesign name="user" size={linksIconSize} style={[user]} />
              <Text style={[linkName,user]}>User</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* about us */}
        <View>
          <Text style={linkTitle}>KNOW ABOUT US</Text>
          <TouchableOpacity onPress={()=>{navigation.navigate("About");checkLink('about')}}>
            <View style={links}>
              <FontAwesome name="users" size={linksIconSize} style={[about]} />
              <Text style={[linkName,about]}>About Us</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate("Contact");checkLink('contact')}}>
            <View style={links}>
              <AntDesign name="mail" size={linksIconSize} style={[contact]} />
              <Text style={[linkName,contact]}>Contact Us</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate("More");checkLink('more')}}>
            <View style={links}>
              <Feather name="more-vertical" size={linksIconSize} style={[more]} />
              <Text style={[linkName,more]}>More</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* logout */}
{DataBase.user!=null?
        <View>
          <Text style={linkTitle}>LOGOUT ACCOUNT</Text>
          <TouchableOpacity
            onPress={()=>{handleLogOut();}}
          >
            <View style={links}>
              <MaterialIcons name="logout" size={linksIconSize} color="black" />
              <Text style={linkName}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
:
        <View></View>
}
      </View>
    </Animated.View>
  );
};

const SS = StyleSheet.create({
  sideBG: {
    position: "absolute",
    top: 40,
    left: 0,
    height: "100%",
    zIndex: 10,
    overflow: "hidden", // prevents content from showing when closed
  },
  container: {
    width: "80%",
    height: "100%",
    borderRightWidth:0.6,
    borderRightColor:'#9691917e',
  },
});

export { SideMenu };
