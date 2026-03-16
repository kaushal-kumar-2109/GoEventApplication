import { View,Image, StyleSheet,Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from "../../../public/styles/global";
import { use } from "react";
import { AddToOffline } from "../../../OfflineDataHandle/bookMark";

const HomeCard = ({DATA,color}) => {

    return(
        <TouchableOpacity style={[Style.Card]}>
            
            <View style={[{width:"90%",alignSelf:'center',top:-60}]}>
{/* here you need to add your image url */}
                <Image source={{ uri: `${DATA.EVENTBANNER }` }} style={[Style.CardImage]}></Image>
            </View>

            <View style={[{top:-50}]}>
                <Text style={[{fontWeight:800,fontSize:20,color:'#686666ff'}]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTNAME}</Text>
                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="location" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTLOCATION}</Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export {HomeCard};

const Style= StyleSheet.create({
    Card:{
        width:250,
        height:160,
        borderWidth:3,
        borderColor:'#cfc8c84d',
        borderRadius:10,
        marginVertical:40,
        padding:10,
        marginHorizontal:10
    },
    CardImage:{
        height:120,
        width:'100%',
        borderRadius:10
    },
    DetailDiv:{
        display:'flex',
        flexDirection:'row',
        marginTop:5,
        alignItems:'center',
        paddingHorizontal:5
    },
    Detail:{
        fontWeight:600,
        color:'#686666ff',
        marginLeft:5
    }
})