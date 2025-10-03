import React from "react";
import { View,Text,Image,StyleSheet,TouchableOpacity,ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GETUSER } from "../../Database/Offline/oprations/Read";
import { DELETEUSER } from "../../Database/Offline/oprations/Delete";
import { RELOADAPP } from "../../../utils/function/reloadApp";
// DELETEUSER('68cc1191cd57670235a58f87');
// console.log(GETUSER());

const WelcomeScreen = ({setPageStack}) => {
  return (
    <>
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/icon.jpg")}
            style={styles.logo}
          />
          <Text style={styles.appName}>GoEvent</Text>
        </View>
        
        {/* Event Images Grid */}
        <View style={styles.imageGrid}>
          <Image source={require("../../../assets/w1.jpg")} style={styles.image} />
          <Image source={require("../../../assets/w2.jpg")} style={styles.image} />
          <Image source={require("../../../assets/w3.jpg")} style={styles.image} />
          <Image source={require("../../../assets/w4.jpg")} style={styles.image} />
          <Image source={require("../../../assets/w5.jpg")} style={styles.image} />
        </View>

        {/* Title + Subtitle */}
        <Text style={styles.title}>See what's happening in your area</Text>
        <Text style={styles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
          dapibus.
        </Text>

        {/* Get Started Button */}
        <View style={[{display:'flex',flexDirection:'row',justifyContent:'space-evenly',marginTop:40}]}>
          <TouchableOpacity style={[styles.button,{backgroundColor: "#003366",}]} onPress={()=>{setPageStack(prevStack => [...prevStack, "login"]);}}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button,{backgroundColor: "#90bfefff",}]} onPress={()=>{setPageStack(prevStack => [...prevStack, "signup"]);}}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
}

export {WelcomeScreen};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 30,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    margin: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#003366",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    padding: 14,
    width:100,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
