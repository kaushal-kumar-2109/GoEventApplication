import { View,Image, StyleSheet,Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from "../../../public/styles/global";
import { use } from "react";
import { AddToOffline } from "../../../OfflineDataHandle/bookMark";

const EventCard = ({DATA}) => {

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
            <View style={[{position:'relative'}]}>
                <Image source={require('../../../assets/eventpng/image.png')} style={[Style.CardImage]}></Image>

                <View style={[Style.CardImageCover,{padding:8}]}>
                    <View style={[{display:'flex',flexDirection:'row',justifyContent:'space-between'}]}>
                        <Text style={[{backgroundColor:'#ffffff',maxHeight:30,width:50,textAlign:'center',borderRadius:8,borderWidth:0.2,fontSize:12,fontWeight:600,marginTop:10}]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTDATE}</Text>
                        <TouchableOpacity 
                            onPress={()=>saveToBookMark(DATA.id,DATA.USERID)}
                            style={[{backgroundColor:'#ffffff',borderRadius:50,height:30,width:30,alignItems:'center',justifyContent:'center'}]}
                        >
                            <FontAwesome5 name="bookmark" size={16} color="black" />
                        </TouchableOpacity>
                    </View>
                    

                    {/* <View style={[{backgroundColor:'#ffffff',width:50,borderRadius:8,borderWidth:0.2,bottom:8,left:8,position:'absolute',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}]}>
                        <Entypo name="star" size={18} color="#e1da06ff" />
                        <Text style={[{textAlign:'center'}]}>4.9</Text>
                    </View> */}

                </View>
            </View>

            <View style={[{paddingHorizontal:10,marginTop:5}]}>
                <Text style={[{fontWeight:800,fontSize:16}]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTNAME}</Text>

                <View style={[Style.DetailDiv]}>
                    <EvilIcons name="location" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTLOCATION}</Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <Feather name="clock" size={18} color="#686666ff"/>
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.EVENTTIME}</Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <FontAwesome5 name="rupee-sign" size={18} color="#686666ff"/>
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">
                        {DATA.EVENTAMOUNT === '0'?"Free":DATA.EVENTAMOUNT}
                    </Text>
                </View>
                
                <TouchableOpacity
                    style={[{backgroundColor:COLORS.primary,width:80,marginTop:10,padding:5,borderRadius:8}]}
                >
                    <Text style={[{textAlign:'center',color:'#ffffff',fontWeight:600}]}>Join Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export {EventCard};

const Style= StyleSheet.create({
    Card:{
        marginTop:15,
        width:'90%',
        borderWidth:1,
        borderTopLeftRadius:8,
        borderTopRightRadius:8,
        borderBottomRightRadius:8,
        borderBottomLeftRadius:8,
        paddingBottom:8,
        borderColor:'#c5c1c185',
    },
    CardImage:{
        height:150,
        width:'100%',
        borderTopRightRadius:8,
        borderTopLeftRadius:8
    },
    CardImageCover:{
        position:'absolute',
        backgroundColor:'#00000055',
        top:0,
        height:'100%',
        width:'100%',
        borderRadius:8
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
        marginLeft:10
    }
})