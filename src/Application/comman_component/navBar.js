// importing pri-build components
import { View, Text,StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// importing custom components
import { COLORS, FONTS } from '../../../public/styles/global';
import { GETSAVED } from '../../Database/Offline/oprations/Read';
import { useEffect, useState } from 'react';

const NavBar = ({setPageStack,getAppData,title,setSideBar,getSearchValue,setSearchValue,getResult}) => {

    const [getSearchBar,setSearchBar] = useState(false);

    return(
        <>
        <View style={styles.container}>
{getSearchBar && <>
            <View style={[{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                <TouchableOpacity
                    onPress={()=>setSearchBar(false)}
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>

                <TextInput placeholder='Enter event name' style={[{marginLeft:5,width:150}]} value={getSearchValue} onChangeText={setSearchValue}></TextInput>

                <TouchableOpacity
                    onPress={()=>getResult()}
                    style={[{borderWidth:0.3,borderRadius:8,paddingVertical:5,paddingHorizontal:8,marginLeft:5,backgroundColor:COLORS.primary}]}
                >
                    <Text style={[{color:'#ffffff'}]}>Search</Text>
                </TouchableOpacity>
                
            </View>
</>}
{!getSearchBar &&<>
            <View style={[{display:'flex', flexDirection:'row', alignItems:'center'}]}>
    {title === 'Saved'?
                <TouchableOpacity
                    onPress={()=>setPageStack('home')}
                >
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
    :
                <TouchableOpacity
                 onPress={()=>setSideBar(true)}
                >
                    <Entypo name="menu" size={24} color="black" />
                </TouchableOpacity>
    }
                <Text style={[FONTS.title,{marginLeft:5}]}>{title}</Text>
            </View>
            <View style={[{display:'flex', flexDirection:'row', alignItems:'center'}]}>

{title==="Events"||title==="Vendors"?
                <TouchableOpacity style={[{marginRight:15}]}
                    onPress={()=>setSearchBar(true)}
                >
                    <MaterialCommunityIcons name="magnify" size={22} color="black" />
                </TouchableOpacity>
:<></>
}
{title !=='Saved' &&
                <TouchableOpacity
                    onPress={()=>setPageStack('saved')}
                    style={[{position:'relative'}]}
                >
                    <FontAwesome name="bookmark-o" size={20} color="black" />
                    <Text
                        style={[{position:'absolute',top:-8,right:-6,borderRadius:50,backgroundColor:'#f8e42bff',height:15,width:15,textAlign:"center",fontSize:10}]}
                    >
                        {getAppData.SavedEvent_Vendor_list.length}
                    </Text>
                </TouchableOpacity>
}
            </View>
</>}
        </View>

        </>
    )
}

export {NavBar};

const styles = StyleSheet.create({
    container:{
        paddingVertical:20,
        paddingHorizontal:15,
        width:'100%',
        height:"auto",
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderTopWidth:0,
        borderColor:'#cac4c42d',
        borderBottomWidth:3,
    }
});