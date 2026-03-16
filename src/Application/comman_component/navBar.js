// importing pri-build components
import { View, Text,StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// importing custom components
import { COLORS, FONTS } from '../../../public/global';
import { useState } from 'react';

const NavBar = ({
    setPageStack,
    title,
    setSideBar,
    getSearchValue,
    setSearchValue
}) => {

    const [getSearchBar,setSearchBar] = useState(false);

    return(
        <View style={styles.container}>

            {/* SEARCH BAR MODE */}
            {getSearchBar ? (

                <View style={styles.searchContainer}>

                    {/* Back button */}
                    <TouchableOpacity
                        onPress={()=>setSearchBar(false)}
                        style={styles.searchBackBtn}
                    >
                        <Feather name="arrow-left" size={24} color="black" />
                    </TouchableOpacity>

                    {/* Dynamic width input */}
                    <TextInput
                        placeholder='Enter event name'
                        style={styles.searchInput}
                        value={getSearchValue}
                        onChangeText={setSearchValue}
                        autoFocus={true}
                    />

                </View>

            ) : (

                <>
                {/* LEFT SIDE */}
                <View style={styles.leftContainer}>

                    {title === 'Saved' ? (

                        <TouchableOpacity
                            onPress={()=>setPageStack('home')}
                        >
                            <Feather name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>

                    ) : (

                        <TouchableOpacity
                            onPress={()=>setSideBar(true)}
                        >
                            <Entypo name="menu" size={24} color="black" />
                        </TouchableOpacity>

                    )}

                    <Text style={[FONTS.title,{marginLeft:8}]}>
                        {title}
                    </Text>

                </View>


                {/* RIGHT SIDE */}
                <View style={styles.rightContainer}>

                    {(title==="Events" || title==="Vendors") &&

                        <TouchableOpacity
                            style={{marginRight:18}}
                            onPress={()=>setSearchBar(true)}
                        >
                            <MaterialCommunityIcons
                                name="magnify"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>

                    }


                    {title !=='Saved' &&

                        <TouchableOpacity
                            onPress={()=>setPageStack('saved')}
                        >
                            <FontAwesome
                                name="bookmark-o"
                                size={22}
                                color="black"
                            />
                        </TouchableOpacity>

                    }

                </View>

                </>
            )}

        </View>
    )
}

export {NavBar};


const styles = StyleSheet.create({

    container:{
        paddingVertical:18,
        paddingHorizontal:15,
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomWidth:3,
        borderColor:'#cac4c42d',
        backgroundColor:'#fff'
    },


    leftContainer:{
        flexDirection:'row',
        alignItems:'center'
    },


    rightContainer:{
        flexDirection:'row',
        alignItems:'center'
    },


    // SEARCH MODE CONTAINER
    searchContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
    },


    searchBackBtn:{
        marginRight:10
    },


    // ✅ Dynamic width input (takes remaining 80–90% space)
    searchInput:{
        flex:1,                  // important for dynamic width
        fontSize:16,
        borderBottomWidth:1,
        borderColor:'#ccc',
        paddingVertical:6,
        paddingHorizontal:5,
        width:'80%'              // fallback safety
    }

});
