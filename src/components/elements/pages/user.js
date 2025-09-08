// importing pri-build components 
import { View,Text } from "react-native"

// importing user-build componetes 
import {CSS} from '../../styles/basicStyle';

const fetchApi = async () => {
    await fetch('http://localhost:3000/GoEvent/User')
    .then((data)=>{return JSON.parse(data);})
    .then((data)=>console.log(data))
    .catch((err)=>console.log("err in fetching data : ",err));
}
const User = () => {
    fetchApi();
    return(
        <View style={[CSS['px5'],CSS['py20']]}>
            <Text>This is user.</Text>
        </View>
    )
}

export {User};