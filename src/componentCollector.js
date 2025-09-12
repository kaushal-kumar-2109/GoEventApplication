// importing pri-build components
import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// importing user-build components { styling }
import CSS from "./components/styles/basicStyle";

// importing components
import { NavBar} from "./components/elements/nav_foot_ele/navBar";
import {SideMenu} from "./components/elements/nav_foot_ele/sideMenu"
import { FootBar } from "./components/elements/nav_foot_ele/footBar";
// importing pagges 
import {  Home } from './components/elements/pages/home'
import {  Event } from './components/elements/pages/event'
import {  Vendor } from './components/elements/pages/vendor'
import {  User } from './components/elements/pages/user'
import {  About } from './components/elements/pages/about'
import {  Contact } from './components/elements/pages/contact'
import {  More } from './components/elements/pages/more'

// creating variables
const Stack = createNativeStackNavigator();

export default function Collector() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchShow , setIsSearchShow] = useState(false);
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const currentRoute = state.routes[state.index].name;
        if (currentRoute === "Event" || currentRoute === "Vendor") {
          setIsSearchShow(true);
          console.log('done');
        } else {
          setIsSearchShow(false);
        }
      }}
    >
      <View style={[SS.body]}>
        <NavBar onMenuPress={() => setIsSidebarOpen(true)} searchVariable={isSearchShow}/>
        <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home}/>
          <Stack.Screen name="Event" component={Event} />
          <Stack.Screen name="Vendor" component={Vendor} />
          <Stack.Screen name="User" component={User} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="More" component={More} />
        </Stack.Navigator>
        <FootBar/>
      </View>
    </NavigationContainer>
  );
}

const SS = StyleSheet.create({
    body:{
        width:'100%',
        height:'100%',
        // paddingTop:40
    },
    product: {
      backgroundColor: "#ffee00ff",
      flex: 1,
      width: "100%",
    },
});
