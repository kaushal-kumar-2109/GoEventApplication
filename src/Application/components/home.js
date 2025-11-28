import { View,Text,StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { useState } from 'react';
import { COLORS } from '../../../public/styles/global';
import { HomeCard } from '../elements/HomeCard';

const HomePage = ({getAppData,setAppData,setPageStack,getPageStack}) => {
    
    const [getSideBar,setSideBar] = useState(false);
    return(
        <>
        <SafeAreaView style={[styles.container,{position:'relative'}]}>
            {/* <NavBar setPageStack={setPageStack} getAppData={getAppData} title={'Home'} style={[{position:'fixed'}]} setSideBar={setSideBar}></NavBar> */}
{/* {getSideBar && 
            <SideBar setSideBar={setSideBar} getUserData={getAppData.UserData} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
} */}
            <ScrollView>
                <View style={[styles.header]}>
                    <View style={[styles.headerContainer1]}>
                        <Text style={[{color:"#ffffff",fontWeight:800,fontSize:20,textAlign:'center'}]}>Create Event And Send Ticket With Just One Click.</Text>
                        <TouchableOpacity style={[{marginTop:30,paddingVertical:10,paddingHorizontal:20,backgroundColor:'#ffffff',borderRadius:10}]}>
                            <Text style={[{color:COLORS.primary,fontWeight:800}]}>Create Event</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[{paddingVertical:50,paddingHorizontal:10}]}>

                    <Text style={[{fontWeight:800,fontSize:18,color:'#0e0d0d8a'}]}>Upcomming Events</Text>
                    <View style={[{marginTop:40,flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}]}>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                    </View>
                    <View style={[styles.ViewMore]}>
                        <TouchableOpacity style={[styles.ViewMoreLayer1]}
                            onPress={()=>setPageStack('event')}
                        >
                            <Text style={[styles.ViewMoreLayer2]}>View More</Text>
                        </TouchableOpacity>
                    </View>


                    <Text style={[{fontWeight:800,fontSize:18,color:'#0e0d0d8a'}]}>Top Vendors</Text>
                    <View style={[{marginTop:40,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-evenly',alignItems:'center'}]}>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                        <HomeCard DATA={{EVENTNAME:"Sample Event",EVENTLOCATION:'Sample Location',EVENTBANNER:'https://picsum.photos/800/400?random=12'}}></HomeCard>
                    </View>
                    <View style={[styles.ViewMore]}>
                        <TouchableOpacity style={[styles.ViewMoreLayer1]}
                            onPress={()=>setPageStack('vendor')}
                        >
                            <Text style={[styles.ViewMoreLayer2]}>View More</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </ScrollView>
            
            <FootBar setPageStack={setPageStack} getPageStack={getPageStack} style={[{position:'absolute',bottom:0}]}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {HomePage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    },
    header:{
        backgroundColor:'#6ba8d7c2',
        borderBottomWidth:2,
        borderLeftWidth:2,
        borderRightWidth:2,
        borderColor:'#635e5e63',
        width:'100%',
        height:250,
        borderBottomLeftRadius:40,
        borderBottomRightRadius:40,
        flexDirection:'row',
    },
    headerContainer1:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    ViewMore:{
        width:'100%',
        alignItems:'center',
        marginTop:20,
        marginBottom:50
    },
    ViewMoreLayer1:{
        width:'auto',
        height:40,
        borderWidth:1,
        borderColor:'#000000',
        backgroundColor:'#92aad76f',
        padding:2,
        borderRadius:10
    },
    ViewMoreLayer2:{
        paddingTop:4,
        fontWeight:600,
        fontSize:16,
        borderColor:'#000000',
        backgroundColor:'#ffffff',
        borderWidth:1,
        paddingHorizontal:20,
        borderRadius:10,
        height:'100%',
        width:'100%',
    }
});