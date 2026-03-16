import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import { Alert } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Delete_EventData } from "../../../../private/database/offline/oprations/delete";
import { COLORS } from "../../../../public/global";
import { useState } from "react";
import { decryptData } from "../../../../utils/Hash";

const EventCard = ({ getDB, DATA, color, getPageStack, setPageStack }) => {

    const [getMenu, setMenu] = useState(false);

    return (
        <TouchableOpacity style={[Style.Card]}>

            <View style={[{ width: "90%", alignSelf: 'center', top: -60 }]}>
                {/* here you need to add your image url */}
                <Image source={{ uri: `${decryptData(DATA.EVENT_BANNER)}` }} style={[Style.CardImage]}></Image>
            </View>

            <View style={[{ top: -50 }]}>
                <Text style={[{ fontWeight: 800, fontSize: 20, color: '#686666ff' }]} numberOfLines={1} ellipsizeMode="tail">{decryptData(DATA.EVENT_NAME)}</Text>
                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="calendar" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{decryptData(DATA.EVENT_DATE)}</Text>
                </View>
                <View style={[Style.DetailDiv, { marginLeft: 5 }]}>
                    <Feather name="clock" size={18} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{decryptData(DATA.EVENT_TIME)}</Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="location" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{decryptData(DATA.EVENT_LOCATION)}</Text>
                </View>
                <View style={[{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' }]}>
                    <TouchableOpacity onPress={() => setMenu(!getMenu)} style={[{ height: 30, width: 30, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }]}>
                        <MaterialIcons name="details" size={24} color="rgb(29, 141, 233)" />
                    </TouchableOpacity>
                    {/* menu  */}
                    {getMenu &&
                        <View
                            style={[{ position: 'absolute', height: "auto", width: "90%", backgroundColor: '#c4c1c1', borderRadius: 3, left: 30, bottom: 0, zIndex: 10, padding: 5 }]}
                        >
                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, `scan.${DATA.EVENT_ID}`])}
                                style={[{ backgroundColor: "white", margin: 2, padding: 5, borderRadius: 3 }]}>
                                <Text>Scan</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, `invite.${DATA.EVENT_ID}`])}
                                style={[{ backgroundColor: "white", margin: 2, padding: 5, borderRadius: 3 }]}>
                                <Text>Invite</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setPageStack(preStack => [...preStack, `eventDetails.${DATA.EVENT_ID}`])}
                                style={[{ backgroundColor: "white", margin: 2, padding: 5, borderRadius: 3 }]}>
                                <Text>Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                // onPress={()=>setPageStack(preStack => [...preStack, `eventDetails.${DATA.ID}` ])}
                                onPress={() => {
                                    Alert.alert(
                                        "Delete Event",              // Title
                                        "Do you want to delete?",   // Message
                                        [
                                            {
                                                text: "No",
                                                onPress: () => console.log(0),
                                                style: "cancel"
                                            },
                                            {
                                                text: "Yes",
                                                onPress: async () => {
                                                    const res = await Delete_EventData(getDB, DATA.USER_ID, DATA.EVENT_ID);
                                                }
                                            }
                                        ],
                                        { cancelable: true }
                                    );

                                }}

                                style={[{ backgroundColor: "white", margin: 2, padding: 5, borderRadius: 3 }]}>
                                <Text>Delete</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: COLORS.primary, borderColor: '#9a9898ff', borderWidth: 1 }]}>
                        <FontAwesome5 name="rupee-sign" size={12} color="#ffffff" />
                        <Text style={[{ color: '#ffffff', marginLeft: 5 }]}>
                            {decryptData(DATA.EVENT_AMOUNT) === '0' ? "Free" : decryptData(DATA.EVENT_AMOUNT)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export { EventCard };

const Style = StyleSheet.create({
    Card: {
        width: 280,
        height: 250,
        borderWidth: 3,
        borderColor: '#cfc8c84d',
        borderRadius: 10,
        marginVertical: 60,
        padding: 10,
        marginHorizontal: 10
    },
    CardImage: {
        height: 120,
        width: '100%',
        borderRadius: 10
    },
    DetailDiv: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        paddingHorizontal: 5
    },
    Detail: {
        fontWeight: 600,
        color: '#686666ff',
        marginLeft: 5
    }
})