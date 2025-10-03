import { View,Text,StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { useState } from 'react';

const UserPage = ({getUserData,setPageStack,getPageStack}) => {
    const [getSideBar,setSideBar] = useState(false);
    return(
        <>
        <SafeAreaView style={[styles.container]}>
            {/* <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Profile'} style={[{position:'fixed'}]} setSideBar={setSideBar}></NavBar> */}
{getSideBar && 
            <SideBar setSideBar={setSideBar} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>
                <View>
                    <Text> this is an User Page.</Text>
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
    }
});