// importing pre-build components 
import { View, Text, TextInput,TouchableOpacity, ScrollView } from "react-native";
import { useEffect,useState } from "react";
import { ActivityIndicator } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// importing user-built components 
import { CSS } from '../../styles/basicStyle';
import { alignItem, colorSchema, display, felx, justifyContent } from '../../styles/constant';

// import utils functions 
import { fetchApi } from "../../../../utils/fetchApi";
import { Login } from "./pageutils/login";

const User = () => { 
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const setPage = async () => {
    let data = await fetchApi('https://goeventserver.onrender.com/GoEvent/User');
    if(true ){
        console.log("There is no user found!");
        setLoading(false);
    }
    else{
        console.log("There is a user found!");
    }

};

  useEffect(() => {
    setPage();
  }, [setPage]);

  return (
    <ScrollView >

        {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : user ? (
        <>
          <Text style={{ fontSize: 20 }}>Welcome, {user.name} 👋</Text>
          <Text>Email: {user.email}</Text>
        </>
      ) : (
        <Login></Login>
      )}
      
    </ScrollView>
  );
};

export { User };
