import { StyleSheet, Text, View } from 'react-native';
import { UserSetup } from './src/AccountCreate/collector';
import { useEffect, useState } from 'react';
import { GETDATASETS, GETUSER } from './src/Database/Offline/oprations/Read';
import Application from './src/Application/collector';
import LottieView from 'lottie-react-native';
import { getEventsData } from './utils/eventApis/fetchApis';
import { AddToOffline } from './OfflineDataHandle/events';

const GETDATASET = new GETDATASETS();

export default function App() {

  // user variable 
  const [getMainPageStack,setMainPageStack] = useState("");
  const [getLoader,setLoader] = useState(true);

  const [getAppData,setAppData] = useState(false);

  const checkUser = async () => {
    const data = await GETUSER();
    if(data && data[0]){
      GETDATASET.check();
      const dataSet =await GETDATASET.fetchDataSet(data[0].id);
      setAppData(dataSet);
      setMainPageStack(true);
    }else{
      setMainPageStack(false);
    }
    
    setLoader(false);
  }

  const setupApp = async () => {
    const res = await getEventsData({data:"none"});
    const response = await AddToOffline(res);
    console.log(response);
  } 

  useEffect(()=>{
    checkUser();
    setupApp();
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
    {(getMainPageStack=='none' || getMainPageStack == false)
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
