// importing pri-build components
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

import { FONTS } from "../../../../public/global";
import { Create_Event_Offline } from "../../../../private/database/offline/oprations/create";

import { useTheme } from "../../../../context/ThemeContext";

/**
 * Create Form.
 */
const CreateForm = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {
    const { colors: theme, isDarkMode } = useTheme();
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
    const [getLoader, setLoader] = useState(false);
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

    /**
     * Create Event.
     */
    const createEvent = async () => {
        setLoader(true);
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
            setLoader(false);
            return;
        }
        if (getEVENTTYPE.trim().toLowerCase() != 'private' && getEVENTTYPE.trim().toLowerCase() != 'public') {
            setEVENTTYPEERROR('Event Type must be either "Private" or "Public"❗');
            setLoader(false);
            return;
        }

        try {
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
        } catch (err) {
            alert("Error in Creating Event❗");
        } finally {
            setLoader(false);
        }
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
        <SafeAreaView style={[{ width: '100%', height: '100%', backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[{ display: 'flex', flexDirection: 'row', paddingHorizontal: 12 }]}>
                <TouchableOpacity
                    onPress={() => { setPageStack(prevStack => prevStack.slice(0, -1)); }}
                    style={[{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }]}>
                    <Ionicons name="arrow-back" size={26} color={theme.text} />
                    <Text style={[{ marginLeft: 10, fontSize: 18, fontWeight: '700', color: theme.text }]}>Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Container */}
                <View style={[{ marginTop: 40, width: '100%', display: 'flex', alignItems: 'center' }]}>
                    <Text style={[{ color: theme.primary, fontWeight: '800', fontSize: 24 }]}>Create New Event</Text>
                    <Text style={[{ color: theme.subtext, fontSize: 14, marginTop: 5 }]}>Fill in the details below</Text>
                </View>

                {/* form */}
                <View style={[{ marginTop: 40, display: 'flex', alignItems: 'center' }]}>

                    {/* EVENT NAME */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="abc" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTNAME}
                            onChangeText={setEVENTNAME}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event Name"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTNAMEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTNAMEERROR}</Text></View> : <View></View>}

                    {/* EVENT DATE */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="calendar-today" size={24} color={theme.primary} />
                        <TouchableOpacity
                            style={{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', height: 40, justifyContent: 'center' }}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: getEVENTDATE ? theme.text : theme.subtext }}>
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
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="currency-rupee" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTAMOUNT}
                            onChangeText={setEVENTAMOUNT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event Amount"
                            placeholderTextColor={theme.subtext}
                            keyboardType="number-pad"
                        ></TextInput>
                    </View>
                    {(getEVENTAMOUNTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTAMOUNTERROR}</Text></View> : <View></View>}

                    {/* EVENT LOCATION */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="location-on" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTLOCATION}
                            onChangeText={setEVENTLOCATION}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event Location"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTLOCATIONERROR) ? <View><Text style={[FONTS.error]}>{getEVENTLOCATIONERROR}</Text></View> : <View></View>}

                    {/* EVENT TIME */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="access-time" size={24} color={theme.primary} />

                        <TouchableOpacity
                            style={{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', height: 40, justifyContent: 'center' }}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={{ color: getEVENTTIME ? theme.text : theme.subtext }}>
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
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="info-outline" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTABOUT}
                            onChangeText={setEVENTABOUT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event About"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTABOUTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTABOUTERROR}</Text></View> : <View></View>}

                    {/* EVENT HIGHLIGHT */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="stars" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTHIGHLIGHT}
                            onChangeText={setEVENTHIGHLIGHT}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event Highlight"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTHIGHLIGHTERROR) ? <View><Text style={[FONTS.error]}>{getEVENTHIGHLIGHTERROR}</Text></View> : <View></View>}

                    {/* EVENT TYPE */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <MaterialIcons name="public" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTTYPE}
                            onChangeText={setEVENTTYPE}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Event Type (Public/Private)"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTTYPEERROR) ? <View><Text style={[FONTS.error]}>{getEVENTTYPEERROR}</Text></View> : <View></View>}

                    {/* EVENT BANNER */}
                    <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <AntDesign name="picture" size={24} color={theme.primary} />
                        <TextInput
                            value={getEVENTBANNER}
                            onChangeText={setEVENTBANNER}
                            style={[{ marginLeft: 15, borderLeftWidth: 1, borderLeftColor: theme.border, paddingHorizontal: 15, width: '90%', color: theme.text }]}
                            placeholder="Poster URL"
                            placeholderTextColor={theme.subtext}
                            keyboardType="default"
                        ></TextInput>
                    </View>
                    {(getEVENTBANNERERROR) ? <View><Text style={[FONTS.error]}>{getEVENTBANNERERROR}</Text></View> : <View></View>}

                    {/* login button */}
                    <View style={[{ display: 'flex', alignItems: 'center', marginTop: 50, marginBottom: 25 }]}>
                        <TouchableOpacity
                            onPress={() => { createEvent(); }}
                            style={[styles.loginBtn, { backgroundColor: theme.primary }]}
                        >
                            <View></View>
                            <Text style={[{ color: '#ffffff', fontWeight: '800', fontSize: 16 }]}>{getLoader ? "CREATING..." : "CREATE EVENT"} </Text>
                            <View style={[{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25, padding: 5 }]}>
                                {getLoader ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Ionicons name="arrow-forward" size={20} color="white" />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    )
}

export default CreateForm;

// Style definitions for the styles component.
const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 20,
        borderWidth: 1,
        width: '85%',
        borderRadius: 30,
        marginTop: 20
    },
    loginBtn: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        borderRadius: 30,
        padding: 10
    }
});
