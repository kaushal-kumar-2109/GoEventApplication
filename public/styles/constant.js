import { StyleSheet } from "react-native";

const CS = StyleSheet.create({
    textDark:{color:'#000000ff'},
    textLightDark:{color:'#222831'},
    textLighterDark:{color:'#393E46'},
    textLight:{color:'#EEEEEE'},
    textLighter:{color:'#ffffff'},
    
    bgdark:{backgroundColor:'#000000ff'},
    bgLightDark:{backgroundColor:'#222831'},
    bgColorLighterDark:{backgroundColor:'#393E46'},
    bgLight:{backgroundColor:'#eeeeeec1'},
    bgLighter:{backgroundColor:'#ffffff'},

    title:{color:'#0d00fdff'}
});

const Dis = StyleSheet.create({
    df:{display:'flex'},
    dn:{display:'none'},
});
const Flex =StyleSheet.create({
    fd_r:{flexDirection:'row'},
    fd_c:{flexDirection:'column'},
    fd_cr:{flexDirection:'column-reverse'},
    fd_rr:{flexDirection:'row-reverse'},
});
const JC = StyleSheet.create({
    jc_c:{justifyContent:'center'},
    jc_fe:{justifyContent:'flex-end'},
    jc_fs:{justifyContent:'flex-start'},
    jc_sa:{justifyContent:'space-around'},
    jc_sb:{justifyContent:'space-between'},
    jc_se:{justifyContent:'space-evenly'}
});
const AI = StyleSheet.create({
    ali_bl:{alignItems:'baseline'},
    ali_c:{alignItems:'center'},
    ali_fe:{alignItems:'flex-end'},
    ali_fs:{alignItems:'flex-start'},
    ali_s:{alignItems:'stretch'}
});
const Pos = StyleSheet.create({
    po_a:{position:'absolute'},
    po_r:{position:'relative'},
    po_s:{position:'static'}
})
export {CS,Dis,Flex,JC,AI,Pos};