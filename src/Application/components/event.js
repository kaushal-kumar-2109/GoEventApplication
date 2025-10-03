import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import {LinearGradient} from 'expo-linear-gradient'
import { useEffect, useState } from 'react';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { ActionCard } from '../elements/ActionCard';
import { COLORS, LinearColor, TextCOLORS } from '../../../public/styles/global';
import { EventCard } from '../elements/EventCard';

const EventPage = ({getUserData,setPageStack,getPageStack,getEvents}) => {

    const [getSideBar,setSideBar]=useState(false);
    const [getSearchValue,setSearchValue] = useState('');
    const [getFilteredEvent,setFilteredEvents] = useState([]);

    const getSerachResult = () => {
        if (!getSearchValue || getSearchValue.trim() === "") {
            setFilteredEvents(getEvents);
        } else {
            const filtered = getEvents.filter(event =>
                event.EVENTNAME.toLowerCase().includes(getSearchValue.toLowerCase())
            );
            setFilteredEvents(filtered);
        }
    }
    // getSerachResult();
    useEffect(()=>{
        getSerachResult();
    },[])

    return(
        <>
        <SafeAreaView style={[styles.container]}>
            <NavBar setPageStack={setPageStack} getUserData={getUserData} getResult={getSerachResult} setSearchValue={setSearchValue} setSideBar={setSideBar} title={'Events'} style={[{position:'fixed'}]}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>

{/* Top Action card  for user creation. */}
                <View style={[{paddingRight:8,marginTop:10}]}>
                    <ScrollView horizontal={true} style={[{width:'100%'}]}>

                        <TouchableOpacity>
                            <ActionCard title={'Create Event'} dis={'Create your own evnets.'} color={LinearColor.Sec_PriBtn_Sec}></ActionCard>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <ActionCard title={'Show Event'} dis={'Check created events.'} color={LinearColor.PriBtn_Sec_PriBtn}></ActionCard>
                        </TouchableOpacity>
                        
                    </ScrollView>
                </View>

{/* Trending Events area  */}
                <View style={[{marginTop:30},{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}> Trending Events</Text>

                    <TouchableOpacity style={[{display:'flex',flexDirection:'row',alignItems:'center',marginRight:8}]}>
                        <Text style={[{color:'#8d8a8aff',fontWeight:800,marginRight:5}]}>Show all</Text>
                        <AntDesign name="double-right" size={12} color="'#8d8a8aff" />
                    </TouchableOpacity>
                </View>
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

                {/* <View style={[{marginVertical:30,display:'flex',flexDirection:'row',justifyContent:'space-between',paddingHorizontal:8}]}>
                    
                    <TouchableOpacity>
                        <View style={[{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                            <AntDesign name="double-left" size={12} color="#8d8a8aff" />
                            <Text style={[{color:'#8d8a8aff',fontWeight:800,marginLeft:5}]}>Privious</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <View style={[{display:'flex',flexDirection:'row',alignItems:'center'}]}>
                            <Text style={[{color:'#8d8a8aff',fontWeight:800,marginRight:5}]}>Next</Text>
                            <AntDesign name="double-right" size={12} color="#8d8a8aff" />
                        </View>
                    </TouchableOpacity>
                    
                </View> */}


            </ScrollView>
            <FootBar style={[{position:'absolute',bottum:0}]} getPageStack={getPageStack} setPageStack={setPageStack}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {EventPage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    }
});