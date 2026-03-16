import { TextCOLORS,LinearColor } from "../../../public/styles/global";
import { View,Text,TouchableOpacity,StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from '@expo/vector-icons/Entypo';
const ActionCard = ({color,title,dis}) => {
    return(
        <LinearGradient
                colors={color} // gradient colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.createCard]}
            >
            <Text style={[TextCOLORS.background,{fontWeight:800,fontSize:18}]}>{title}</Text>
            <Text style={[TextCOLORS.background,{marginLeft:5,fontWeight:600,fontSize:12}]}>{dis}</Text>
            <View style={[{width:"100%",alignItems:'flex-end',marginTop:20}]}>
                <Entypo name="arrow-with-circle-right" size={24} color={'#ffffff'} />
            </View>
        </LinearGradient>
    )
}

export {ActionCard};

const styles = StyleSheet.create({
    createCard:{
        borderWidth:0.5,
        borderColor:'#8e8d8dff',
        height:150,
        width:200,
        borderRadius:6,
        padding:5,
        elevation:1,
        marginHorizontal:10
    }
});