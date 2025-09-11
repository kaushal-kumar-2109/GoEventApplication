//  importing pri-bui; componets 
import { Text, TouchableOpacity, View,StyleSheet, TextInput } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';


// importing user-build componets { styling }
import {CSS} from '../../styles/basicStyle'
import { justifyContent,display,alignItem,felx,colorSchema, position } from '../../styles/constant';
import { FONTS, ICONS } from '../../styles/global';

// creating variable
const title =  [CSS['fs25'],CSS['ml10'],colorSchema.title,CSS['fw9']];


const NavBar = ({ onMenuPress }) => {

    const [searchBar,setSearchBar] = useState({display:'none'});
    const [handleSearch,setHandleSearch] = useState({display:'flex'});
  return (
    <View className="navBar" style={[display.df,felx.fd_r,justifyContent.jc_sb,alignItem.ali_c,CSS['p10'],colorSchema.bgLighter,SS.nav]}>
         {/* app title and menu logo */}
        <View style={[felx.fd_r,alignItem.ali_c,handleSearch]}>
            <TouchableOpacity onPress={onMenuPress}>
                <Entypo name='menu' size={ICONS.nav}></Entypo>
            </TouchableOpacity>
            <Text style={[FONTS.logo]}>GoEvent</Text>
        </View>
        {/* app title and menu logo end ! */}

        {/* search bar and search button  */}
        <View style={[searchBar,felx.fd_r,alignItem.ali_c]}>
            <TouchableOpacity style={[colorSchema.bgLighter]} onPress={()=>{setHandleSearch({display:'flex'});setSearchBar({display:'none'});}}>
                <AntDesign name="arrowleft" size={24} />
            </TouchableOpacity>
            <TextInput
            style={[CSS['ml15'],{borderBottomWidth:1,width:200}]}
            placeholder='Enter Event,Vendor Name.'>
            </TextInput>
            <TouchableOpacity style={[CSS['ml15']]}>
                <Text style={[{backgroundColor:'#202ef3ff',borderRadius:30},CSS['py10'],CSS['px20'],colorSchema.textLighter]}>Search</Text>
            </TouchableOpacity>
        </View>
        {/* search bar and search button end */}

        {/* search Logo  */}
        <View style={[handleSearch]}>
            <TouchableOpacity onPress={()=>{setHandleSearch({display:'none'});setSearchBar({display:'flex'})}}>
                <FontAwesome name="search" size={ICONS.nav} color="black" />
            </TouchableOpacity>
        </View>
        {/* search logo end ! */}
    </View>
  );
}



const SS = StyleSheet.create({
    nav:{
        // position:'absolute',
        paddingTop:45,
        borderBottomWidth:0.6,
        borderBottomColor:'#9691917e',
        paddingBottom:15,
        zIndex:1,
        width:'100%',
        top:0
    }
});

export {NavBar};