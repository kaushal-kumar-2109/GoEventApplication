import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { ActionCard } from '../elements/ActionCard';
import { LinearColor } from '../../../public/styles/global';
import { EventCard } from '../elements/EventCard';
import { EventFilter } from '../comman_component/eventfilter';

const EventPage = ({getAppData,setAppData,setPageStack,getPageStack}) => {

    const [getSideBar,setSideBar]=useState(false);
    const [getSearchValue,setSearchValue] = useState('');
    const [getFilteredEvent,setFilteredEvents] = useState([]);
    const [getFreeEvent,setFreeEvent] = useState([]);
    const [getFilter,setFilter] = useState('');
    // console.log(getAppData.SavedEvent_Vendor_Data);

    const getSerachResult = () => {
        if (!getSearchValue || getSearchValue.trim() === "") {
            setFilteredEvents(getAppData.EventData);
        } else {
            const filtered = getAppData.EventData.filter(event =>
                event.EVENTNAME.toLowerCase().includes(getSearchValue.toLowerCase())
            );
            setFilteredEvents(filtered);
        }
    }
    const setEvents = async () =>{
        const FreeEvent = getAppData.EventData.filter(event =>
            event.EVENTAMOUNT === '0'
        );
        setFreeEvent(FreeEvent);
    }
    // getSerachResult();
    useEffect(()=>{
        getSerachResult();
        setEvents();
    },[])

    return(
        <>
        <SafeAreaView style={[styles.container]}>
            <NavBar setPageStack={setPageStack} getAppData={getAppData} getResult={getSerachResult} setSearchValue={setSearchValue} setSideBar={setSideBar} title={'Events'} style={[{position:'fixed'}]}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getUserData={getAppData.UserData} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <View>
                {/* <EventFilter></EventFilter> */}
                <ScrollView>

    {/* filter code  */}

    {/* filter code end */}
    {/* Top Action card  for user creation. */}
                    {/* <View style={[{paddingRight:8,marginTop:10}]}>
                        <ScrollView horizontal={true} style={[{width:'100%'}]}>

                            <TouchableOpacity>
                                <ActionCard title={'Create Event'} dis={'Create your own evnets.'} color={LinearColor.Sec_PriBtn_Sec}></ActionCard>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <ActionCard title={'Show Event'} dis={'Check created events.'} color={LinearColor.PriBtn_Sec_PriBtn}></ActionCard>
                            </TouchableOpacity>

                        </ScrollView>
                    </View> */}

                    <View style={[{width:'100%',paddingHorizontal:20,paddingVertical:30,flexDirection:'row',alignItems:'center'}]}>

                        <TouchableOpacity style={[{flexDirection:'row',alignItems:'center'}]}>
                            <MaterialCommunityIcons name="filter-plus-outline" size={24} color="#686666ff" />
                            <Text style={[{marginHorizontal:10,width:60,fontSize:20,color:'#686666ff'}]}>filter /</Text>
                        </TouchableOpacity>
                        <View style={[{width:'50%'}]}>
                            <Text style={[{width:'auto',color:'#686666ab'}]}
                            numberOfLines={1}
                            ellipsizeMode='true'
                            > 
                            {(getFilter.length<=0)?'No filter':getFilter}
                            </Text>
                        </View>

                    </View>
                    <ScrollView style={[{width:'100%', marginTop:30}]}>
                        <View style={[{width:'100%',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly'}]}>

    {getFilteredEvent && getFilteredEvent.length > 0
    ?(
        getFilteredEvent.map((event,index)=>(
                        <EventCard key={event._id||index} DATA={event} color={'#686666ff'}></EventCard>
        ))
    ):(
                        <View><Text>No Event Found!</Text></View>
    )}

                        </View>
                    </ScrollView>

                </ScrollView>
            </View>

        {/* <FootBar style={[{position:'absolute',bottum:0}]} getPageStack={getPageStack} setPageStack={setPageStack}></FootBar> */}
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
    },
    filter:{
        position:'absolute',
        backgroundColor:'#ffffff',
        height:100,
        width:'80%',
        top:0,
        right:0,
        zIndex:15,
        borderWidth:2,
        borderColor:'#c2c0c011'
    }
});