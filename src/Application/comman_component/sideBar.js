import { View, Text, TouchableOpacity, Image } from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Alert } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState, useEffect } from "react";

import { FONTS, COLORS } from '../../../public/global';
import { Delete_Userdata } from "../../../private/database/offline/oprations/delete";
import { RELOADAPP } from "../../../utils/reloadApp";
import { decryptData } from "../../../utils/Hash";


const SideBar = ({ getDB, getUserData, setSideBar, getPageStack, setPageStack }) => {

    const [getHomeColor, setHomeColor] = useState();
    const [getEventColor, setEventColor] = useState();
    const [getVendorColor, setVendorColor] = useState();
    const [getProfileColor, setProfileColor] = useState();
    const [getSettingColor, setSettingColor] = useState();

    const setColor = () => {
        console.log("checck");
        (getPageStack[getPageStack.length - 1] === "home") ? setHomeColor(COLORS.primary) : setHomeColor("#6B7280");
        (getPageStack[getPageStack.length - 1] === 'event') ? setEventColor(COLORS.primary) : setEventColor("#6B7280");
        (getPageStack[getPageStack.length - 1] === 'vendor') ? setVendorColor(COLORS.primary) : setVendorColor("#6B7280");
        (getPageStack[getPageStack.length - 1] === 'user') ? setProfileColor(COLORS.primary) : setProfileColor("#6B7280");
        (getPageStack[getPageStack.length - 1] === 'setting') ? setSettingColor(COLORS.primary) : setSettingColor("#6B7280");
    }

    useEffect(() => {
        setColor();
    }, [])

    return (
        <>
            <View style={[{ position: 'absolute', top: 0, left: 0, backgroundColor: '#e1dfdf6d', width: '100%', height: '106%', zIndex: 1 }]}>

                <View style={[{ width: '80%', backgroundColor: "#FFFFFF", height: '100%', position: 'relative' }]}>
                    <TouchableOpacity
                        style={[{ marginTop: 50, width: '100%', display: 'flex', alignItems: 'flex-end', paddingHorizontal: 20 }]}
                        onPress={() => setSideBar(false)}
                    >
                        <Entypo name="cross" size={30} color="black" />
                    </TouchableOpacity>

                    <View style={[{ paddingHorizontal: 5 }]}>
                        <Image
                            source={{ uri: `${decryptData(getUserData[0].USER_PIC)}` }}
                            style={{ width: 150, height: 150, borderRadius: 100 }}
                            resizeMode="contain"
                        ></Image>
                        <Text style={[{ fontSize: 17, fontWeight: 600 }]}>{decryptData(getUserData[0].USER_NAME)}</Text>
                        <Text style={[{ color: '#6d6b6bff', fontWeight: 600 }]}>{decryptData(getUserData[0].USER_EMAIL)}</Text>
                    </View>


                    <Text style={[{ marginLeft: 10, fontWeight: 600, color: '#969696ff', marginTop: 50 }]}>Main Menu</Text>
                    <View style={[{ paddingHorizontal: 30 }]}>

                        {getPageStack[getPageStack.length - 1] == 'home' ?
                            <TouchableOpacity style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}>
                                <AntDesign name="home" size={17} color={getHomeColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getHomeColor, marginLeft: 5 }]}>Home</Text>
                            </TouchableOpacity>

                            :
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, "home"])}
                                style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}
                            >
                                <AntDesign name="home" size={17} color={getHomeColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getHomeColor, marginLeft: 5 }]}>Home</Text>
                            </TouchableOpacity>
                        }

                        {getPageStack[getPageStack.length - 1] === 'event' ?
                            <TouchableOpacity style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
                                <MaterialIcons name="event" size={17} color={getEventColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getEventColor, marginLeft: 5 }]}>Events</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, "event"])}
                                style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}
                            >
                                <MaterialIcons name="event" size={17} color={getEventColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getEventColor, marginLeft: 5 }]}>Events</Text>
                            </TouchableOpacity>
                        }

                        {getPageStack[getPageStack.length - 1] === 'vendor' ?
                            <TouchableOpacity style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
                                <Fontisto name="shopping-bag" size={17} color={getVendorColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getVendorColor, marginLeft: 5 }]}>Vendors</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, "vendor"])}
                                style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}
                            >
                                <Fontisto name="shopping-bag" size={17} color={getVendorColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getVendorColor, marginLeft: 5 }]}>Vendors</Text>
                            </TouchableOpacity>
                        }

                    </View>

                    <Text style={[{ marginLeft: 10, fontWeight: 600, color: '#969696ff', marginTop: 20 }]}>Account</Text>

                    <View style={[{ paddingHorizontal: 30 }]}>

                        {getPageStack[getPageStack.length - 1] === 'user' ?
                            <TouchableOpacity style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}>
                                <FontAwesome name="user-o" size={17} color={getProfileColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getProfileColor, marginLeft: 5 }]}>Profile</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, "user"])}
                                style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10 }]}
                            >
                                <FontAwesome name="user-o" size={17} color={getProfileColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getProfileColor, marginLeft: 5 }]}>Profile</Text>
                            </TouchableOpacity>
                        }

                        {getPageStack[getPageStack.length - 1] === 'setting' ?
                            <TouchableOpacity style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}>
                                <AntDesign name="setting" size={17} color={getSettingColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getSettingColor, marginLeft: 5 }]}>Settings</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, "setting"])}
                                style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 20 }]}
                            >
                                <AntDesign name="setting" size={17} color={getSettingColor} />
                                <Text style={[{ fontSize: 17, fontWeight: '600', color: getSettingColor, marginLeft: 5 }]}>Settings</Text>
                            </TouchableOpacity>
                        }

                    </View>


                    <TouchableOpacity
                        // onPress={async ()=>{
                        //     let res = await Delete_Userdata(getDB);
                        //     if(res.STATUS == 200){
                        //         console.log("User Deleted !")
                        //         RELOADAPP();
                        //     }
                        // }}
                        onPress={() => {
                            Alert.alert(
                                "Logout",              // Title
                                "Do you want to logout?",   // Message
                                [
                                    {
                                        text: "No",
                                        onPress: () => console.log(0),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Yes",
                                        onPress: async () => {
                                            let res = await Delete_Userdata(getDB);
                                            if (res.STATUS == 200) {
                                                console.log("User Deleted !")
                                                RELOADAPP();
                                            }
                                        }
                                    }
                                ],
                                { cancelable: true }
                            );
                        }}
                        style={[{ paddingVertical: 60, position: 'absolute', bottom: 0, width: '100%', alignItems: 'center' }]}
                    >
                        <Text style={[{ fontSize: 17, fontWeight: '600', color: getSettingColor }]}>Logout</Text>
                    </TouchableOpacity>


                </View>

            </View>
        </>
    )
}

export { SideBar };