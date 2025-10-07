import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { ActionCard } from '../elements/ActionCard';
import { LinearColor } from '../../../public/styles/global';
import { EventCard } from '../elements/EventCard';

const EventPage = ({getAppData,setAppData,setPageStack,getPageStack}) => {

    const [getSideBar,setSideBar]=useState(false);
    const [getSearchValue,setSearchValue] = useState('');
    const [getFilteredEvent,setFilteredEvents] = useState([]);
    const [getFreeEvent,setFreeEvent] = useState([]);
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

                    {/* <TouchableOpacity style={[{display:'flex',flexDirection:'row',alignItems:'center',marginRight:8}]}>
                        <Text style={[{color:'#8d8a8aff',fontWeight:800,marginRight:5}]}>Show all</Text>
                        <AntDesign name="double-right" size={12} color="'#8d8a8aff" />
                    </TouchableOpacity> */}
                </View>
                <ScrollView horizontal={true}>
{getFilteredEvent && getFilteredEvent.length > 0
?(
    getFilteredEvent.map((event,index)=>(
        <EventCard key={event._id||index} DATA={event} color={'#686666ff'}></EventCard>
    ))
):(
                    <View><Text>No Event Found!</Text></View>
)}
                </ScrollView>


{/* Free Events area  */}
                <View style={[{marginTop:30},{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}> Free Events</Text>

                    {/* <TouchableOpacity style={[{display:'flex',flexDirection:'row',alignItems:'center',marginRight:8}]}>
                        <Text style={[{color:'#8d8a8aff',fontWeight:800,marginRight:5}]}>Show all</Text>
                        <AntDesign name="double-right" size={12} color="'#8d8a8aff" />
                    </TouchableOpacity> */}
                </View>
                <ScrollView horizontal={true}>
{getFreeEvent && getFreeEvent.length > 0
?(
    getFreeEvent.map((event,index)=>(

        <EventCard key={event._id||index} DATA={event} color={'#686666ff'}></EventCard>
    ))
):(
                    <View><Text>No Event Found!</Text></View>
)}
                </ScrollView>


{/* Saved Events area  */}
{getAppData.SavedEvent_Vendor_Data && getAppData.SavedEvent_Vendor_Data.length>0 &&
                <View style={[{marginTop:30},{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}]}>
                    <Text style={[{color:'#8d8a8aff',fontWeight:800}]}> Saved Events</Text>

                    {/* <TouchableOpacity style={[{display:'flex',flexDirection:'row',alignItems:'center',marginRight:8}]}>
                        <Text style={[{color:'#8d8a8aff',fontWeight:800,marginRight:5}]}>Show all</Text>
                        <AntDesign name="double-right" size={12} color="'#8d8a8aff" />
                    </TouchableOpacity> */}
                </View>
}
                <ScrollView horizontal={true}>
{getAppData.SavedEvent_Vendor_Data && getAppData.SavedEvent_Vendor_Data.length > 0
?(
    getAppData.SavedEvent_Vendor_Data.map((event,index)=>(
        <EventCard key={event._id||index} DATA={event} color={'#e6ea0cff'}></EventCard>
    ))
):(
                    <></>
)}
                </ScrollView>



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