import { StyleSheet, Text, View } from 'react-native';
import { UserSetup } from './src/AccountCreate/collector';
import { useEffect, useState } from 'react';
import { GETDATASETS, GETUSER } from './src/Database/Offline/oprations/Read';
import Application from './src/Application/collector';
import LottieView from 'lottie-react-native';
import { DELETETABLES } from './src/Database/Offline/oprations/Delete';
import * as Network from 'expo-network';
import { syncDatabase } from './utils/sync';

import * as SQLite from "expo-sqlite";


// DELETETABLES();
const GETDATASET = new GETDATASETS();

export default function App() {
  // user variable 
  const [getMainPageStack,setMainPageStack] = useState("");
  const [getLoader,setLoader] = useState(true);
  const [getAppData,setAppData] = useState(false);

  const checkUser = async () => {
    const data = await GETDATASET.fetchDataSet();
    if(data.STATUS == 200){
      setAppData(data);
      // console.log("dataSet => ",dataSet);
      setMainPageStack(true);
    }else{
      setMainPageStack(false);
    }
    
    setLoader(false);
  }

  useEffect(()=>{
    checkUser();
    SYNCPROCESS();
  },[setMainPageStack]);

  return (
    <>
{getLoader?
    <View style={styles.container}>
      <LottieView
        
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
        source={require('./assets/loader/l1.json')} // put your lottie file in assets
      />
    </View>
:
  <>
    {(getAppData == false || getMainPageStack == false)
    ?
      <View style={styles.container}>
        <UserSetup setMainPageStack={setMainPageStack}></UserSetup>
      </View>
    :
      <View style={styles.container}>
        <Application getAppData={getAppData} setAppData={setAppData}></Application>
      </View>
    }
  </>
}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:'10%',
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


const SYNCPROCESS = async () => {
  const db = await SQLite.openDatabaseAsync("GoEvent");

  const interval = setInterval(async () => {
    console.log("trying sync......");
    try{
      const net = await Network.getNetworkStateAsync();
      if (net.isConnected) {
        console.log("✅ Device connected to the internet");
        await syncDatabase(db);
      }
      else{
        console.log("🚫 Device not connected to internet");
      }
    }catch(err){
      console.log("🚫 Some error!");
    }
  }, 60000); // 1 min
// 60000
  // return () => clearInterval(interval);
}
