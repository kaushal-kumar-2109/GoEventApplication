import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { EventCard } from '../elements/EventCard';
import { GETSAVEDLIST } from '../../Database/Offline/oprations/Read';

const SavedPage = ({getUserData,setPageStack,getPageStack,getEvents}) => {

    const [getSideBar,setSideBar]=useState(false);
    const [getFilteredEvent,setFilteredEvents] = useState([]);

    const saveToBookMark = async (id) => {
        const res = await GETSAVEDLIST(id);
        setFilteredEvents(res);
    }

    // getSerachResult();
    useEffect(()=>{
        saveToBookMark(getUserData.getUserData.id);
    },[])

    return(
        <>
        <SafeAreaView style={[styles.container]}>
            <NavBar setPageStack={setPageStack} getUserData={getUserData} setSideBar={setSideBar} title={'Saved'} style={[{position:'fixed'}]}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>

            <View style={[{alignItems:'center'}]}>
{getFilteredEvent && getFilteredEvent.length > 0
?(
    getFilteredEvent.map((event,index)=>(
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