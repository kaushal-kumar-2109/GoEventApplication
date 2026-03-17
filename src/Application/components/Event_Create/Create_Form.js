// importing pri-build components
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Touchable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { COLORS, FONTS } from "../../../../public/global";
import { Create_Event_Offline } from "../../../../private/database/offline/oprations/create";

const CreateForm = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {
    // values states
    const [getEVENTNAME, setEVENTNAME] = useState('');
    const [getEVENTDATE, setEVENTDATE] = useState('');
    const [getEVENTAMOUNT, setEVENTAMOUNT] = useState('');
    const [getEVENTLOCATION, setEVENTLOCATION] = useState('');
    const [getEVENTTIME, setEVENTTIME] = useState('');
    const [getEVENTABOUT, setEVENTABOUT] = useState('');
    const [getEVENTHIGHLIGHT, setEVENTHIGHLIGHT] = useState('');
    const [getEVENTTYPE, setEVENTTYPE] = useState('Public');
    const [getEVENTBANNER, setEVENTBANNER] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);


    // error states
    const [getEVENTNAMEERROR, setEVENTNAMEERROR] = useState(false);
    const [getEVENTDATEERROR, setEVENTDATEERROR] = useState(false);
    const [getEVENTAMOUNTERROR, setEVENTAMOUNTERROR] = useState(false);
    const [getEVENTLOCATIONERROR, setEVENTLOCATIONERROR] = useState(false);
    const [getEVENTTIMEERROR, setEVENTTIMEERROR] = useState(false);
    const [getEVENTABOUTERROR, setEVENTABOUTERROR] = useState(false);
    const [getEVENTHIGHLIGHTERROR, setEVENTHIGHLIGHTERROR] = useState(false);
    const [getEVENTTYPEERROR, setEVENTTYPEERROR] = useState(false);
    const [getEVENTBANNERERROR, setEVENTBANNERERROR] = useState(false);

    const createEvent = async () => {

        (getEVENTNAME.trim() == '') ? setEVENTNAMEERROR('Event Name is Required❗') : setEVENTNAMEERROR(false);
        (getEVENTDATE.trim() == '') ? setEVENTDATEERROR('Event Date is Required❗') : setEVENTDATEERROR(false);
        (getEVENTAMOUNT.trim() == '') ? setEVENTAMOUNTERROR('Event Amount is Required❗') : setEVENTAMOUNTERROR(false);
        (getEVENTLOCATION.trim() == '') ? setEVENTLOCATIONERROR('Event Location is Required❗') : setEVENTLOCATIONERROR(false);
        (getEVENTTIME.trim() == '') ? setEVENTTIMEERROR('Event Time is Required❗') : setEVENTTIMEERROR(false);
        (getEVENTABOUT.trim() == '') ? setEVENTABOUTERROR('Event About is Required❗') : setEVENTABOUTERROR(false);
        (getEVENTHIGHLIGHT.trim() == '') ? setEVENTHIGHLIGHTERROR('Event Highlight is Required❗') : setEVENTHIGHLIGHTERROR(false);
        (getEVENTTYPE.trim() == '') ? setEVENTTYPEERROR('Event Type is Required❗') : setEVENTTYPEERROR(false);
        (getEVENTBANNER.trim() == '') ? setEVENTBANNERERROR('Event Banner URL is Required❗') : setEVENTBANNERERROR(false);

        if (getEVENTNAME.trim() == '' || getEVENTDATE.trim() == '' || getEVENTAMOUNT.trim() == '' || getEVENTLOCATION.trim() == '' || getEVENTTIME.trim() == '' || getEVENTABOUT.trim() == '' || getEVENTHIGHLIGHT.trim() == '' || getEVENTTYPE.trim() == '' || getEVENTBANNER.trim() == '') {
            return;
        }
        if (getEVENTTYPE.trim().toLowerCase() != 'private' && getEVENTTYPE.trim().toLowerCase() != 'public') {
            setEVENTTYPEERROR('Event Type must be either "Private" or "Public"❗');
            return;
        }

        let status = await Create_Event_Offline(getDB, {
            USERID: getUserData[0].USER_ID,
            EVENTNAME: getEVENTNAME,
            EVENTDATE: getEVENTDATE,
            EVENTAMOUNT: getEVENTAMOUNT,
            EVENTLOCATION: getEVENTLOCATION,
            EVENTTIME: getEVENTTIME,
            EVENTABOUT: getEVENTABOUT,
            EVENTHIGHLIGHT: getEVENTHIGHLIGHT,
            EVENTTYPE: getEVENTTYPE,
            EVENTBANNER: getEVENTBANNER
        });
        if (status.STATUS == 200) {
            console.log("Event Created Successfully✅");
        } else {
            alert("Error in Creating Event❗ Please Try Again.");
        }
        setPageStack(prevStack => prevStack.slice(0, -1));

    }


    // DATE CHANGE
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            setEVENTDATE(formattedDate);
            setEVENTDATEERROR(false);
        }
    };

    // TIME CHANGE
    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            let hours = selectedTime.getHours();
            let minutes = selectedTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = String(minutes).padStart(2, '0');
            const formattedTime = `${hours}:${minutes} ${ampm}`;
            setEVENTTIME(formattedTime);
            setEVENTTIMEERROR(false);
        }
    };

    return (
        <SafeAreaView style={[{ width: '100%', height: '100%', backgroundColor: "#ffffff", }]}>
            {/* Header */}
            <View style={[{ display: 'flex', flexDirection: 'row', paddingHorizontal: 12 }]}>
                <TouchableOpacity
                    onPress={() => { setPageStack(prevStack => prevStack.slice(0, -1)); }}
                    style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }]}>
                    <Ionicons name="arrow-back" size={26} color="black" />
                    <Text style={[{ marginLeft: 15, fontSize: 20, fontStyle: 600 }]}>Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Container */}
                <View style={[{ marginTop: 40, width: '100%', display: 'flex', alignItems: 'center' }]}>
                    <Text style={[{ color: COLORS.primaryBtn, fontWeight: '700', fontSize: 20 }]}>Create Your Own Event </Text>
                </View>

                {/* form */}
                <View style={[{ marginTop: 40, display: 'flex', alignItems: 'center' }]}>

                    {/* EVENT NAME */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="abc" size={24} color="black" />
                        <TextInput
                            value={getEVENTNAME}
                            onChangeText={setEVENTNAME}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event Name"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTNAMEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTNAMEERROR}</Text></View> : <View></View>}

                    {/* EVENT DATE */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="calendar-today" size={24} color="black" />
                        <TouchableOpacity
                            style={{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', height: 40, justifyContent: 'center' }}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: getEVENTDATE ? "#000" : "#aaa" }}>
                                {getEVENTDATE || "Event Date"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                    {(getEVENTDATEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTDATEERROR}</Text></View> : <View></View>}

                    {/* EVENT AMOUNT */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="currency-rupee" size={24} color="black" />
                        <TextInput
                            value={getEVENTAMOUNT}
                            onChangeText={setEVENTAMOUNT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event Amount"
                            placeholderTextColor="#aaa"
                            keyboardType="number-pad"
                        ></TextInput>
                    </View>
                    {(getEVENTAMOUNTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTAMOUNTERROR}</Text></View> : <View></View>}

                    {/* EVENT LOCATION */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="location-on" size={24} color="black" />
                        <TextInput
                            value={getEVENTLOCATION}
                            onChangeText={setEVENTLOCATION}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event Location"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTLOCATIONERROR) ? <View><Text style={[FONTS.error]}>{getEVENTLOCATIONERROR}</Text></View> : <View></View>}

                    {/* EVENT TIME */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="access-time" size={24} color="black" />

                        <TouchableOpacity
                            style={{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', height: 40, justifyContent: 'center' }}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={{ color: getEVENTTIME ? "#000" : "#aaa" }}>
                                {getEVENTTIME || "Event Time"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showTimePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                            is24Hour={false}
                        />
                    )}

                    {(getEVENTTIMEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTTIMEERROR}</Text></View> : <View></View>}

                    {/* EVENT ABOUT */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="info-outline" size={24} color="black" />
                        <TextInput
                            value={getEVENTABOUT}
                            onChangeText={setEVENTABOUT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event About"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTABOUTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTABOUTERROR}</Text></View> : <View></View>}

                    {/* EVENT HIGHLIGHT */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="info-outline" size={24} color="black" />
                        <TextInput
                            value={getEVENTHIGHLIGHT}
                            onChangeText={setEVENTHIGHLIGHT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event Highlight"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTHIGHLIGHTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTHIGHLIGHTERROR}</Text></View> : <View></View>}

                    {/* EVENT TYPE */}
                    <View style={[styles.searchBox]}>
                        <MaterialIcons name="private-connectivity" size={24} color="black" />
                        <TextInput
                            value={getEVENTTYPE}
                            onChangeText={setEVENTTYPE}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Event Type"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTTYPEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTTYPEERROR}</Text></View> : <View></View>}

                    {/* EVENT BANNER */}
                    <View style={[styles.searchBox]}>
                        <AntDesign name="link" size={24} color="black" />
                        <TextInput
                            value={getEVENTBANNER}
                            onChangeText={setEVENTBANNER}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, paddingHorizontal: 15, width: '90%', overflow: 'auto' }]}
                            placeholder="Please Enter The Event Poster URL"
                            placeholderTextColor="#aaa"
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTBANNERERROR) ? <View><Text style={[FONTS.error]}>{getEVENTBANNERERROR}</Text></View> : <View></View>}

                    {/* login button */}
                    <View style={[{ display: 'flex', alignItems: 'center', marginTop: 50, marginBottom: 25 }]}>
                        <TouchableOpacity
                            onPress={() => { createEvent(); }}
                            style={[styles.loginBtn]}
                        >
                            <View></View>
                            <Text style={[{ color: '#ffffff' }]}>CREATE EVENT </Text>
                            <View style={[{ backgroundColor: COLORS.secondaryBtn, borderRadius: '50%' }]}>
                                <Ionicons name="arrow-forward" size={24} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default CreateForm;

const styles = StyleSheet.create({
    searchBox:
    {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        width: '85%',
        borderRadius: 30,
        borderColor: '#97959549',
        color: '#000000ff',
        marginTop: 20
    },
    loginBtn:
    {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        backgroundColor: COLORS.primaryBtn,
        borderRadius: 30,
        padding: 10
    }
})
