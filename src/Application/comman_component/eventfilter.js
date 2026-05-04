// React component and screen logic for the app.
import { View,StyleSheet, ScrollView } from "react-native";
/**
 * Event Filter.
 */
const EventFilter = () => {
    return(
        <View style={[styles.container]}>
            <View style={[styles.filter]}>
                
            </View>
        </View>
    )
}

export {EventFilter};

// Style definitions for the styles component.
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