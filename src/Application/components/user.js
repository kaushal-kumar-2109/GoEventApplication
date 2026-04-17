import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { MessageCard } from './sub_compo/messageCard';
import { COLORS } from '../../../public/global';
import { LinearColor } from '../../../public/global';
import { Read_All_Offline_Data } from '../../../private/database/offline/oprations/read';
import { EventCard } from './Event_Create/EventCard';

import { encryptData, decryptData } from '../../../utils/Hash';

const UserPage = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {

    const [getSideBar, setSideBar] = useState(false);
    const [getUData, setUData] = useState(false);

    const FieldData = async () => {
        let uData = await Read_All_Offline_Data(getDB, getUserData[0].USER_ID);
        if (uData.STATUS == 200) {
            setUData(uData);
        }

        // setTimeout(async() => {
        //     let uData = await userPageSetupData(getUserData.UserData.id);
        //     if(uData.STATUS==200){
        //         setUData(uData);
        //         console.log(getUData);
        //     }
        // }, 30000);
    }

    useEffect(() => {
        FieldData();
    }, []);

    return (
        <>
            <SafeAreaView style={[styles.container]}>
                <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Profile'} style={[{ position: 'fixed' }]} setSideBar={setSideBar}></NavBar>
                {getSideBar &&
                    <SideBar getDB={getDB} setSideBar={setSideBar} getUserData={getUserData} getPageStack={getPageStack} setPageStack={setPageStack} setUserData={setUserData}></SideBar>
                }


                <ScrollView>
                    <View style={[{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 25, borderBottomWidth: 3, borderColor: '#d4d1d13e', marginVertical: 10 }]}>
                        <Image
                            source={{ uri: `${decryptData(getUserData[0].USER_PIC)}` }}
                            // source={{ uri: `${decryptData(profile)}` }}
                            style={{ width: 150, height: 150, borderRadius: 100, borderWidth: 3, borderColor: '#8a8888ff' }}
                            resizeMode="contain"
                        ></Image>
                        <Text style={[{ fontWeight: 800, fontSize: 20 }]}>{decryptData(getUserData[0].USER_NAME)}</Text>
                        <Text style={[{ fontWeight: 600, color: '#8a8888ff' }]}>{decryptData(getUserData[0].USER_EMAIL)}</Text>
                    </View>

                    <ScrollView horizontal={true} style={[{ width: '100%', paddingVertical: 10 }]}>

                        <MessageCard setPageStack={setPageStack} count={0} title={'Create Events'} dis={'Create Your Own evnets.'} color={LinearColor.Sec_PriBtn_Sec}></MessageCard>
                        {/* <MessageCard setPageStack={setPageStack} count={0} title={'Create Vendors'} dis={'Create Your Own vendors.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard> */}

                    </ScrollView>

                    <View style={[{ marginVertical: 20, alignItems: 'center' }]}>
                        <Text style={[{ fontWeight: 800, fontSize: 20 }]}>Update Profile</Text>
                        <View style={[{ borderWidth: 1, borderRadius: 8, width: '90%', borderColor: '#d4d1d18c', marginTop: 10 }]}>
                            <Text style={[styles.lable]}>Name:</Text>
                            <TextInput style={[styles.input]} placeholder={getUserData[0].USERNAME}></TextInput>
                            <Text style={[styles.lable]}>Phone Number:</Text>
                            <TextInput style={[styles.input]} placeholder={getUserData[0].USERNUMBER}></TextInput>
                            <Text style={[styles.lable]}>Password:</Text>
                            <TextInput style={[styles.input]} placeholder='********'></TextInput>

                            <TouchableOpacity style={[{ marginVertical: 20, alignSelf: 'center' }]}>
                                <Text style={[styles.btn]}>Update</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    {/* for the created events  */}
                    <View style={[styles.cardContainer]}>
                        <Text style={[{ color: '#8d8a8aff', fontWeight: 800 }]}>Created Events</Text>
                        <ScrollView
                            horizontal={true}
                        >
                            {(getUData.EVENTS)
                                ?
                                getUData.EVENTS.map((event, index) => (
                                    <EventCard getDB={getDB} getPageStack={getPageStack} setPageStack={setPageStack} key={event.EVENT_ID || index} DATA={event} color={'#686666ff'}></EventCard>
                                ))
                                :
                                <View style={[{ alignItems: 'center', paddingVertical: 20 }]}>
                                    <MessageCard count={""} title={'No Event Found'} dis={'There is no Event created.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                                </View>
                            }
                        </ScrollView>
                    </View>

                    {/* for the created vendors */}
                    {/* <View style={[styles.cardContainer]}>
                        <Text style={[{ color: '#8d8a8aff', fontWeight: 800 }]}>Created Vendors</Text>
                        {getUserData.bookedEvent
                            ?
                            <></>
                            :
                            <View style={[{ alignItems: 'center', paddingVertical: 20 }]}>
                                <MessageCard count={""} title={'No Vendor Found'} dis={'There is no vendor Created.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                            </View>
                        }
                    </View> */}

                    {/* for the boked events  */}
                    <View style={[styles.cardContainer]}>
                        <Text style={[{ color: '#8d8a8aff', fontWeight: 800 }]}>Booked Events</Text>
                        {getUserData.bookedEvent
                            ?
                            <></>
                            :
                            <View style={[{ alignItems: 'center', paddingVertical: 20 }]}>
                                <MessageCard count={""} title={'No Event Found'} dis={'There is no booked Event.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                            </View>
                        }
                    </View>


                    {/* for the booked vendores */}
                    {/* <View style={[styles.cardContainer]}>
                        <Text style={[{ color: '#8d8a8aff', fontWeight: 800 }]}>Booked Vendors</Text>
                        {getUserData.bookedEvent
                            ?
                            <></>
                            :
                            <View style={[{ alignItems: 'center', paddingVertical: 20 }]}>
                                <MessageCard count={""} title={'No Vendor Found'} dis={'There is no booked Vendor.'} color={LinearColor.PriBtn_Sec_PriBtn}></MessageCard>
                            </View>
                        }
                    </View> */}

                </ScrollView>


                <FootBar getPageStack={getPageStack} setPageStack={setPageStack} style={[{ position: 'absolute', bottum: 0 }]}></FootBar>
            </SafeAreaView>
        </>
    )
}

export { UserPage };

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: "#ffffff",
    },
    lable: {
        fontSize: 17,
        fontWeight: '600',
        color: "#8a8888ff",
        marginLeft: 10,
        marginTop: 10
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center'
    },
    btn: {
        paddingVertical: 5,
        borderWidth: 0.4,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: COLORS.primary,
        color: '#ffffff',
        borderColor: '#8a8888ff'
    },
    cardContainer: {
        padding: 10,
        borderColor: '#d4d1d14a',
        borderTopWidth: 4,
    }
});