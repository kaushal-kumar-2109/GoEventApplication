import { StyleSheet, Text, View } from 'react-native';
import { GETUSER } from './src/DataBase/offline/dbHandle/readData';
import { useState } from 'react';
import { useEffect } from 'react';
import { DataBase } from './utils/GlobalVariable';
import { ActivityIndicator } from "react-native";
import LottieView from 'lottie-react-native';


import Collector from './src/componentCollector';

export default function App() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const setPage = async () => {
    const User = await GETUSER();
    if(!User || User.length<1 || User==null){
        console.log("There is no user found!");
        setLoading(false);
        setUser(null);
        DataBase.user=null;
    }
    else{
      const data = User[0];
      setUser(data);
      DataBase.user=data;
      setLoading(false);
      console.log("There is a user found!");
    }
  };
  useEffect(() => {
    setPage();
  }, []);

  return (
    <View style={[styles.container]}>
      {loading?(
          <View style={[{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}]}>
            {/* <ActivityIndicator size="large" color="#007bff" /> */}
            <LottieView
              source={require("./assets/loader1.json")} // 👈 use your JSON file
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>
        ):user?(
          <Collector></Collector>
        ):(
          <Collector></Collector>
        )
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
});
