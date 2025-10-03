import { View,Text,StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { useState } from 'react';

const SettingPage = ({getUserData,setPageStack,getPageStack}) => {

    const [getSideBar,setSideBar] = useState(false);
    return(
        <>
        <SafeAreaView style={[styles.container,{position:'relative'}]}>
            <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Home'} style={[{position:'fixed'}]} setSideBar={setSideBar}></NavBar>
{getSideBar && 
            <SideBar setSideBar={setSideBar} getPageStack={getPageStack} setPageStack={setPageStack}></SideBar>
}
            <ScrollView>
                <View>
                    <Text> this is an Setting page.</Text>
                </View>
            </ScrollView>
            <FootBar setPageStack={setPageStack} getPageStack={getPageStack} style={[{position:'absolute',bottom:0}]}></FootBar>
        </SafeAreaView>
        </>
    )
}

export {SettingPage};

const styles = StyleSheet.create({
    container:{
        position:'relative',
        width:'100%',
        height:'100%',
    }
});