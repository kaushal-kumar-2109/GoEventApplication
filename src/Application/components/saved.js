import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { EventCard } from '../elements/EventCard';

const SavedPage = ({getAppData,setAppData,setPageStack,getPageStack}) => {

    const [getSideBar,setSideBar]=useState(false);


    return(
        <>
        <SafeAreaView style={[styles.container]}>
            <NavBar setPageStack={setPageStack} getAppData={getAppData} setSideBar={setSideBar} title={'Saved'} style={[{position:'fixed'}]}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getUserData={getAppData.UserData} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>

            <View style={[{alignItems:'center'}]}>
{getAppData.SavedEvent_Vendor_Data && getAppData.SavedEvent_Vendor_Data.length > 0
?(
    getAppData.SavedEvent_Vendor_Data.map((event,index)=>(
        <EventCard key={event._id||index} DATA={event}></EventCard>
    ))
):(
                    <View><Text>No Event Found!</Text></View>
)}
                </View>


            </ScrollView>
            <FootBar style={[{position:'absolute',bottum:0}]} getPageStack={getPageStack} setPageStack={setPageStack}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {SavedPage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    }
});