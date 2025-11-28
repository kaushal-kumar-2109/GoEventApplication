import { View,Image, StyleSheet,Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { COLORS } from "../../../public/styles/global";
import { use } from "react";
import { AddToOffline } from "../../../OfflineDataHandle/bookMark";

const VendorCard = ({DATA,color}) => {

    return(
        <TouchableOpacity style={[Style.Card]}>
            
            <View style={[{width:"90%",alignSelf:'center',top:-60}]}>
{/* here you need to add your image url */}
                <Image source={{ uri: `${DATA.VENDORBANNER }` }} style={[Style.CardImage]}></Image>
            </View>

            <View style={[{top:-50}]}>
                <Text style={[{fontWeight:800,fontSize:20,color:'#686666ff'}]} numberOfLines={1} ellipsizeMode="tail">{DATA.VENDORNAME}</Text>
                <View style={[Style.DetailDiv]}>
                    <Entypo name="location-pin" size={24} color="#686666ff" />
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.VENDORCITY} / {DATA.VENDORCOUNTRY}</Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <FontAwesome5 name="rupee-sign" size={18} color="#686666ff" style={[{marginLeft:8}]}/>
                    <Text style={[Style.Detail,{marginLeft:10}]} numberOfLines={1} ellipsizeMode="tail">
                        {DATA.VENDORPRICE}
                    </Text>
                </View>
                <View style={[Style.DetailDiv]}>
                    <AntDesign name="star" size={24} color="#f1e917a5"/>
                    <Text style={[Style.Detail]} numberOfLines={1} ellipsizeMode="tail">{DATA.VENDORRATING}</Text>
                </View>
                <View style={[Style.DetailDiv,{marginLeft:5}]}>
                    <Text style={[Style.Detail]} numberOfLines={2} ellipsizeMode="tail">{DATA.VENDORBIO}</Text>
                </View>

                <View style={[{flexDirection:'row',justifyContent:'space-between',marginTop:20,alignItems:'center'}]}>
                    <TouchableOpacity onPress={()=>saveToBookMark(DATA.id,DATA.UserId)}>
                        <FontAwesome5 name="bookmark" size={20} color={color} style={[{marginLeft:10}]} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={[{flexDirection:'row',alignItems:'center',paddingHorizontal:10,paddingVertical:5,borderRadius:10,backgroundColor:COLORS.primary,borderColor:'#9a9898ff',borderWidth:1}]}>
                        <FontAwesome5 name="rupee-sign" size={12} color="#ffffff"/>
                        <Text style={[{color:'#ffffff',marginLeft:5}]}>
                            {DATA.VENDORCITY === '0'?"Free":DATA.VENDORCITY}
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </View>

        </TouchableOpacity>
    )
}

9924584716

export {VendorCard};

const Style= StyleSheet.create({
    Card:{
        width:280,
        height:290,
        borderWidth:3,
        borderColor:'#cfc8c84d',
        borderRadius:10,
        marginVertical:60,
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
        alignItems:'center',
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