import { View,Image, StyleSheet,Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from "../../../public/styles/global";
import { use } from "react";
import { AddToOffline } from "../../../OfflineDataHandle/bookMark";

const EventCard = ({DATA,color}) => {

    const saveToBookMark = (eventid,userid) => {
        let id ='';
        const idstack = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
        for(let i=0;i<25;i++){
            let v = Math.floor(Math.random()*idstack.length);
            id = id+idstack[v];
        }
        AddToOffline([{_id:id,UserId:userid,EventId:eventid}]);
    }

    return(
        <View style={[Style.Card]}>

            <View style={[{width:"90%",alignSelf:'center',top:-60}]}>
                <Image source={require('../../../assets/eventpng/image.png')} style={[Style.CardImage]}></Image>
            </View>

            <View style={[{top:-50}]}>
                <Text style={[{fontWeight:800,fontSize:20,color:'#686666ff'}]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTNAME}</Text>
                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="calendar" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTDATE}</Text>
                </View>
                <View style={[Style.DetailDiv,{marginLeft:5}]}>
                    <Feather name="clock" size={18} color="#686666ff"/>
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTTIME}</Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="location" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTLOCATION}</Text>
                </View>
                <View style={[{flexDirection:'row',justifyContent:'space-between',marginTop:20,alignItems:'center'}]}>
                    <FontAwesome5 name="bookmark" size={20} color={color} style={[{marginLeft:10}]} />
                    <TouchableOpacity style={[{flexDirection:'row',alignItems:'center',paddingHorizontal:10,paddingVertical:5,borderRadius:10,backgroundColor:COLORS.primary,borderColor:'#9a9898ff',borderWidth:1}]}>
                        <FontAwesome5 name="rupee-sign" size={12} color="#ffffff"/>
                        <Text style={[{color:'#ffffff',marginLeft:5}]}>
                            {DATA.EVENTAMOUNT === '0'?"Free":DATA.EVENTAMOUNT}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )
}

export {EventCard};

const Style= StyleSheet.create({
    Card:{
        width:240,
        height:250,
        borderWidth:3,
        borderColor:'#cfc8c84d',
        borderRadius:10,
        marginTop:60,
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
        paddingHorizontal:5
    },
    Detail:{
        fontWeight:600,
        color:'#686666ff',
        marginLeft:5
    }
})