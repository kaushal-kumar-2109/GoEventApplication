import { View,StyleSheet, ScrollView } from "react-native";
const EventFilter = () => {
    return(
        <View style={[styles.container]}>
            <View style={[styles.filter]}>
                
            </View>
        </View>
    )
}

export {EventFilter};

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        top:0,
        zIndex:25,
    },
    filter:{
        position:'relative',
        borderWidth:2,
        borderColor:'#7b787811',
        backgroundColor:'#ffffff',
        height:"80%",
        width:'80%'
    }
});