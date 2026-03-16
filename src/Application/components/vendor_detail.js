import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';

// importing the created files 
import { FootBar } from '../comman_component/footer';
import { Read_From_venderdata_By_ID } from '../../../private/database/offline/oprations/read';

const Vendor_Details = ({ getDB, getUserData, setUserData, getPageStack, setPageStack }) => {

    const [getVendorData, setVendorData] = useState(false);

    const setPageData = async () => {
        const eventID = getPageStack[getPageStack.length - 1].split('.')[1];
        const event = await Read_From_venderdata_By_ID(getDB, eventID);
        if (event.STATUS == 200) {
            setVendorData(event.DATA[0]);

        } else {
            console.log("Error in reading event data");
        }
    }

    useEffect(() => {
        setPageData();
    }, []);

    return (
        <SafeAreaView style={[{ width: '100%', height: '100%', position: 'relative', paddingHorizontal: 10, paddingTop: 10 }]}>

            <View style={[{ width: '100%', zIndex: 100, paddingVertical: 10, borderColor: '#a7a5a54d', borderBottomWidth: 3, marginBottom: 10 }]}>
                <Text style={[{ fontSize: 18, fontWeight: 'bold', color: '#565555' }]}>Details</Text>
            </View>
            {getVendorData &&
                <ScrollView style={[{ width: '100%', height: '100%', marginVertical: 10 }]}>
                    <View>
                        <Image source={{ uri: `${getVendorData.VENDORBANNER}` }} style={[{ width: '100%', height: 250, borderRadius: 8 }]}></Image>
                    </View>

                    <View style={[{ marginTop: 20, borderColor: '#a7a5a54d', borderBottomWidth: 2, borderTopWidth: 2, paddingVertical: 10 }]}>
                        <Text style={[{ fontSize: 22, fontWeight: 'bold', color: 'rgb(49, 82, 193)' }]}>{getVendorData.VENDORNAME}</Text>

                        <View style={[{ padding: 5 }]}>
                            <Text style={[{ fontWeight: 600, color: '#565555' }]}>{getVendorData.VENDORBIO}</Text>
                            {/* <Text style={[{color:'#8e8d8d',fontSize:12}]}> Created by {getEventCeatorData.USERNAME}</Text> */}
                        </View>
                        <View style={[{ padding: 10, backgroundColor: 'rgb(49, 82, 193)', width: '100%', borderRadius: 8, marginTop: 10 }]}>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }]}>
                                <FontAwesome name="calendar" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDOREMAIL}</Text>
                            </View>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }]}>
                                <Entypo name="location" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDORPHONE}</Text>
                            </View>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }]}>
                                <AntDesign name="field-time" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDORADDRESS}, {getVendorData.VENDORCITY}, {getVendorData.VENDORSTATE}</Text>
                            </View>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }]}>
                                <Feather name="type" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDORCOUNTRY}</Text>
                            </View>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5, paddingHorizontal: 4 }]}>
                                <FontAwesome5 name="rupee-sign" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDORPRICE}</Text>
                            </View>

                        </View>

                        <Text style={[{ fontWeight: 700, fontSize: 18, color: '#565555', marginTop: 15, marginBottom: 7 }]}>Highlight</Text>
                        <View style={[{ padding: 10, backgroundColor: 'rgb(49, 82, 193)', width: '100%', borderRadius: 8, marginTop: 10 }]}>

                            <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, marginVertical: 5 }]}>
                                <FontAwesome name="dot-circle-o" size={20} color="white" />
                                <Text style={[{ color: 'white', fontWeight: 'bold', marginLeft: 10 }]}>{getVendorData.VENDORWEBSITE}</Text>
                            </View>

                        </View>
                    </View>

                    <View>
                        <TouchableOpacity style={[{ padding: 15, backgroundColor: 'rgb(49, 82, 193)', width: '100%', borderRadius: 8, marginTop: 20, alignItems: 'center' }]}>
                            <Text style={[{ color: 'white', fontWeight: 'bold' }]}>Book Vendor</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            }
            <FootBar setPageStack={setPageStack} getPageStack={getPageStack} style={[{ position: 'absolute', bottom: 0 }]}></FootBar>

        </SafeAreaView>
    )
}

export { Vendor_Details };