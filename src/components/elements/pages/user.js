// importing pre-build components 
import { Text, ScrollView } from "react-native";
import { useEffect,useState } from "react";
import { ActivityIndicator } from "react-native";
import { DataBase } from "../../../../utils/GlobalVariable";

// import utils functions 
import { Log_Reg_col } from "./Userutils/log_reg_col";
import {GETUSER} from '../../../DataBase/offline/dbHandle/readData';
import {DELETEUSER} from '../../../DataBase/offline/dbHandle/deleteData';
const User = () => { 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(DataBase.user);
  }, []);

  return (
    <ScrollView >

        {user ? (
        <>
          <Text style={{ fontSize: 20 }}>Welcome, {user.name} 👋</Text>
          <Text>Email: {user.email}</Text>
        </>
      ) : (
        <Log_Reg_col></Log_Reg_col>
      )}
      
    </ScrollView>
  );
};

export { User };
