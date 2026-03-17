import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

//importing created files
import { Account_Create_Collector } from './src/AccountCreate/collector';

// importing created function 
import { initDB } from './private/database/offline/connect';
import { Read_From_userdata } from './private/database/offline/oprations/read';
import Application from './src/Application/collector';
import { Load_Event_Invitation } from './private/sync/read_online';
// import { Delete_Unwanted_Event } from './private/sync/wright_offline';

export default function App() {

  const [getUserData, setUserData] = useState(false);
  const [getDB, setDB] = useState(false);

  const CheckUser = async () => {
    const DB = await initDB();
    setDB(DB);
    let Data = await Read_From_userdata(DB);
    if (Data.STATUS == 200 && Data.DATA.length > 0) {
      setUserData(Data.DATA);
      Load_Event_Invitation(DB, Data.DATA[0].USER_ID);
      // Delete_Unwanted_Event(DB);
    }
  }

  useEffect(() => {
    CheckUser();
  }, []);

  return (<>
    {!getUserData &&
      <Account_Create_Collector getDB={getDB}></Account_Create_Collector>
    }
    {getUserData &&
      <Application getDB={getDB} getUserData={getUserData} setUserData={setUserData}></Application>
    }
  </>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
