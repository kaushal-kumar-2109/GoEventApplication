import { View,Text,StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';


// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { useState } from 'react';
import { ActionCard } from '../elements/ActionCard';
import { LinearColor } from '../../../public/styles/global';
import {VendorCard} from '../elements/VendorCard';

const VendorPage = ({getUserData,setPageStack,getPageStack}) => {
    const [getSideBar,setSideBar] = useState(false);
    return(
        <>
        <SafeAreaView style={[styles.container]}>
            <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Vendors'} style={[{position:'fixed'}]} setSideBar={setSideBar}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>

{/* Top Action card  for user creation. */}
                <View style={[{paddingRight:8,marginTop:10}]}>
                    <ScrollView horizontal={true} style={[{width:'100%'}]}>

                        <TouchableOpacity>
                            <ActionCard title={'Create Vendor'} dis={'Create your own Vendor.'} color={LinearColor.Sec_PriBtn_Sec}></ActionCard>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <ActionCard title={'Show Vendors'} dis={'Check created vendors.'} color={LinearColor.PriBtn_Sec_PriBtn}></ActionCard>
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
                    <VendorCard></VendorCard>
                    <VendorCard></VendorCard>
                    <VendorCard></VendorCard>
                    <VendorCard></VendorCard>
                    <VendorCard></VendorCard>
                </View>

                <View style={[{marginVertical:30,display:'flex',flexDirection:'row',justifyContent:'space-between',paddingHorizontal:8}]}>
                    
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
                    
                </View>

            </ScrollView>
            <FootBar getPageStack={getPageStack} setPageStack={setPageStack} style={[{position:'absolute',bottum:0}]}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {VendorPage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    }
});