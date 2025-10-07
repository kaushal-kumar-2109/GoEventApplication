import { View,Text,StyleSheet, ScrollView,Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { MessageCard } from '../elements/messageCard';
import { COLORS, LinearColor } from '../../../public/styles/global';
import { useState } from 'react';

const UserPage = ({getAppData,setAppData,setPageStack,getPageStack}) => {
    
    const [getSideBar,setSideBar] = useState(false);

    return(
        <>
        <SafeAreaView style={[styles.container]}>
            {/* <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Profile'} style={[{position:'fixed'}]} setSideBar={setSideBar}></NavBar> */}
{getSideBar && 
            <SideBar setSideBar={setSideBar} getUserData={getAppData.UserData} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}


            <ScrollView>
                <View style={[{justifyContent:'center',alignItems:'center',paddingHorizontal:10,paddingVertical:25,borderBottomWidth:3,borderColor:'#d4d1d13e'}]}>
                    <Image 
                        source={require("../../../assets/user.png")}
                        style={{ width: 150, height: 150 }}
                        resizeMode="contain"
                    ></Image>
                    <Text style={[{fontWeight:800,fontSize:20}]}>{getAppData.UserData.name}</Text>
                    <Text style={[{fontWeight:600,color:'#8a8888ff'}]}>{getAppData.UserData.email}</Text>
                </View>

                <ScrollView horizontal={true} style={[{width:'100%',paddingVertical:10}]}>

                    <MessageCard count={0} title={'Booked Events'} dis={'Total booked evnets.'} color={LinearColor.Sec_PriBtn_Sec}></MessageCard>
                    <MessageCard count={0} title={'Booked Vendors'} dis={'Total booked vendors.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                     
                </ScrollView>

                <View style={[{marginVertical:20,alignItems:'center'}]}>
                    <Text style={[{fontWeight:800,fontSize:20}]}>Update Profile</Text>
                    <View style={[{borderWidth:1,borderRadius:8,width:'90%',borderColor:'#d4d1d18c',marginTop:10}]}>
                        <Text style={[styles.lable]}>Name:</Text>
                        <TextInput style={[styles.input]} placeholder={getAppData.UserData.name}></TextInput>
                        <Text style={[styles.lable]}>Phone Number:</Text>
                        <TextInput style={[styles.input]} placeholder={getAppData.UserData.phone}></TextInput>
                        <Text style={[styles.lable]}>Password:</Text>
                        <TextInput style={[styles.input]} placeholder='********'></TextInput>

                        <TouchableOpacity style={[{marginVertical:20,alignSelf:'center'}]}>
                            <Text style={[styles.btn]}>Update</Text>
                        </TouchableOpacity>

                    </View>
                </View>


{/* for the boked events  */}
                <View style={[styles.cardContainer]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}>Booked Events</Text>
{getAppData.bookedEvent 
?
                    <></>
:
                    <View style={[{alignItems:'center',paddingVertical:20}]}>
                        <MessageCard count={""} title={'No Event Found'} dis={'There is no booked Event.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                    </View>
}
                </View>


{/* for the booked vendores */}
                <View style={[styles.cardContainer]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}>Booked Vendors</Text>
{getAppData.bookedEvent 
?
                    <></>
:
                    <View style={[{alignItems:'center',paddingVertical:20}]}>
                        <MessageCard count={""} title={'No Vendor Found'} dis={'There is no booked Vendor.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                    </View>
}
                </View>


{/* for the created events  */}
                <View style={[styles.cardContainer]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}>Created Events</Text>
{getAppData.bookedEvent 
?
                    <></>
:
                    <View style={[{alignItems:'center',paddingVertical:20}]}>
                        <MessageCard count={""} title={'No Event Found'} dis={'There is no Event created.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                    </View>
}
                </View>


{/* for the created vendors */}
                <View style={[styles.cardContainer]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}>Created Vendors</Text>
{getAppData.bookedEvent 
?
                    <></>
:
                    <View style={[{alignItems:'center',paddingVertical:20}]}>
                        <MessageCard count={""} title={'No Vendor Found'} dis={'There is no vendor Created.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                    </View>
}
                </View>

            </ScrollView>


            <FootBar getPageStack={getPageStack} setPageStack={setPageStack} style={[{position:'absolute',bottum:0}]}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {UserPage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    },
    lable:{
        fontSize:17,
        fontWeight:'600',
        color:"#8a8888ff",
        marginLeft:10,
        marginTop:10
    },
    input:{
        borderBottomWidth:1,
        marginBottom:10,
        width:'90%',
        alignSelf:'center'
    },
    btn:{
        paddingVertical:5,
        borderWidth:0.4,
        paddingHorizontal:10,
        borderRadius:8,
        backgroundColor:COLORS.primary,
        color:'#ffffff',
        borderColor:'#8a8888ff'
    },
    cardContainer:{
        padding:10,
        borderColor:'#d4d1d14a',
        borderTopWidth:4,
    }
});