// React component and screen logic for the app.
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Platform, Dimensions, Share, Alert, ActivityIndicator, Modal, TextInput, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5, MaterialIcons, Feather, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Read_From_evetndata_By_ID } from '../../../private/database/offline/oprations/read';
import { Create_Booking } from '../../../private/database/offline/oprations/create';
import { decryptData } from '../../../utils/Hash';

const { width } = Dimensions.get('window');

import { useTheme } from '../../../context/ThemeContext';
import { APIs } from '../../../mailer/routers';

/**
 * Event Details.
 */
const Event_Details = ({ getDB, getUserData, setUserData, getPageStack, setPageStack }) => {
    const { colors: theme, isDarkMode } = useTheme();

    const [getEventData, setEventData] = useState(false);
    const [getHighLights, setHighLights] = useState([]);
    const [isBooking, setIsBooking] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [attendeeData, setAttendeeData] = useState({ name: '', email: '', number: '', gender: '' });

    /**
     * Set Page Data.
     */
    const setPageData = async () => {
        const eventID = getPageStack[getPageStack.length - 1].split('.')[1];
        const event = await Read_From_evetndata_By_ID(getDB, eventID);
        if (event.STATUS == 200 && event.DATA.length > 0) {
            setEventData(event.DATA[0]);
            const highlights = decryptData(event.DATA[0].EVENT_HIGHLIGHT);
            setHighLights(highlights ? highlights.split(',') : []);
        } else {
            console.log("Error in reading event data:", event.DATA);
        }
    }

    useEffect(() => {
        setPageData();
    }, []);

    /**
     * On Share.
     */
    const onShare = async () => {
        try {
            await Share.share({
                message: `Check out this event: ${decryptData(getEventData.EVENT_NAME)} at ${decryptData(getEventData.EVENT_LOCATION)}!`,
            });
        } catch (error) {
            alert(error.message);
        }
    };

    /**
     * Handles  booking logic for the application.
     */
    const handleBooking = async () => {
        if (!attendeeData.name || !attendeeData.email || !attendeeData.number || !attendeeData.gender) {
            Alert.alert("Required", "Please fill in all details.");
            return;
        }
        if (isBooking) return;

        setIsBooking(true);
        const eventName = decryptData(getEventData.EVENT_NAME);
        const eventId = getEventData.EVENT_ID;
        const userId = getUserData[0].USER_ID;

        try {
            const res = await Create_Booking(getDB, userId, eventId, eventName, attendeeData);
            if (res.STATUS === 200) {
                // Send Email Notification
                try {
                    const eventData = {
                        EVENT_ID: getEventData.EVENT_ID,
                        EVENT_NAME: decryptData(getEventData.EVENT_NAME),
                        EVENT_DATE: decryptData(getEventData.EVENT_DATE),
                        EVENT_LOCATION: decryptData(getEventData.EVENT_LOCATION),
                        EVENT_TIME: decryptData(getEventData.EVENT_TIME)
                    };
                    const userData = [{
                        name: attendeeData.name,
                        email: attendeeData.email,
                        number: attendeeData.number
                    }];
                    
                    const mailRes = await fetch(`${APIs.sendInvitation}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ users: userData, event: eventData })
                    });
                    
                    const mailData = await mailRes.json();
                    if (mailData.STATUS !== 200) {
                        console.log("Email failed:", mailData);
                    }
                } catch (e) {
                    console.log("Error sending confirmation email:", e);
                }

                setShowBookingForm(false);
                Alert.alert(
                    "Success! 🎉",
                    `You have successfully booked your spot for ${eventName}. Check your notifications for details.`,
                    [{ text: "Great!", onPress: () => setPageStack(prev => prev.slice(0, -1)) }]
                );
            } else {
                Alert.alert("Error", "Booking failed. Please try again.");
            }
        } catch (err) {
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

            {getEventData && (
                <>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} stickyHeaderIndices={[0]}>
                        <View style={styles.stickyHeader}>
                            <View style={styles.headerButtons}>
                                <TouchableOpacity
                                    style={[styles.headerBtn, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                                    onPress={() => setPageStack(prev => prev.slice(0, -1))}
                                >
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.headerBtn, { backgroundColor: 'rgba(0,0,0,0.3)' }]}
                                    onPress={onShare}
                                >
                                    <Ionicons name="share-social-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.bannerContainer}>
                            <Image
                                source={{ uri: `${decryptData(getEventData.EVENT_BANNER)}` }}
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                            <LinearGradient
                                colors={['transparent', isDarkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)']}
                                style={styles.bannerOverlay}
                            />
                            <View style={[styles.typeBadge, { backgroundColor: theme.primary }]}>
                                <Text style={styles.typeText}>{decryptData(getEventData.EVENT_TYPE)}</Text>
                            </View>
                        </View>

                        <View style={[styles.content, { backgroundColor: theme.background }]}>
                            <View style={styles.titleSection}>
                                <Text style={[styles.title, { color: theme.text }]}>{decryptData(getEventData.EVENT_NAME)}</Text>
                                <View style={styles.priceRow}>
                                    <LinearGradient
                                        colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#4F46E5']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.priceBadge}
                                    >
                                        <FontAwesome5 name="rupee-sign" size={14} color="#fff" />
                                        <Text style={styles.priceText}>
                                            {decryptData(getEventData.EVENT_AMOUNT) === '0' ? "Free Entry" : `${decryptData(getEventData.EVENT_AMOUNT)}`}
                                        </Text>
                                    </LinearGradient>
                                    <Text style={[styles.creatorInfo, { color: theme.subtext }]}>By {getEventData.EVENT_CODE}</Text>
                                </View>
                            </View>

                            <View style={styles.infoGrid}>
                                <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                    <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#EEF2FF' }]}>
                                        <Ionicons name="calendar" size={20} color={theme.primary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.infoLabel, { color: theme.subtext }]}>Date</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{decryptData(getEventData.EVENT_DATE)}</Text>
                                    </View>
                                </View>

                                <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                    <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#FFF7ED' }]}>
                                        <Feather name="clock" size={20} color="#F97316" />
                                    </View>
                                    <View>
                                        <Text style={[styles.infoLabel, { color: theme.subtext }]}>Time</Text>
                                        <Text style={[styles.infoValue, { color: theme.text }]}>{decryptData(getEventData.EVENT_TIME)}</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity style={[styles.locationCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <View style={[styles.iconCircle, { backgroundColor: isDarkMode ? '#1E293B' : '#F0FDF4' }]}>
                                    <Ionicons name="location" size={22} color="#22C55E" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.infoLabel, { color: theme.subtext }]}>Location</Text>
                                    <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={2}>{decryptData(getEventData.EVENT_LOCATION)}</Text>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.subtext} />
                            </TouchableOpacity>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>About Event</Text>
                                <Text style={[styles.aboutText, { color: isDarkMode ? '#94A3AF' : '#475569' }]}>{decryptData(getEventData.EVENT_ABOUT)}</Text>
                            </View>

                            {getHighLights.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Event Highlights</Text>
                                    <View style={styles.highlightWrapper}>
                                        {getHighLights.map((highlight, i) => (
                                            highlight.trim() !== "" && (
                                                <View key={i} style={[styles.highlightChip, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                                    <Ionicons name="checkmark-circle" size={16} color={theme.primary} />
                                                    <Text style={[styles.highlightText, { color: theme.text }]}>{highlight.trim()}</Text>
                                                </View>
                                            )
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View style={{ height: 150 }} />
                        </View>
                    </ScrollView>

                    <View style={styles.bottomAction}>
                        <LinearGradient
                            colors={['transparent', theme.background]}
                            style={styles.bottomBlur}
                        />
                        {decryptData(getEventData.EVENT_TYPE).toLowerCase() === 'public' ? (
                            <TouchableOpacity activeOpacity={0.9} style={styles.mainBtn} onPress={() => setShowBookingForm(true)}>
                                <LinearGradient
                                    colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#4F46E5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.btnGradient}
                                >
                                    <Text style={styles.btnText}>{isBooking ? "Booking..." : "Reserve Your Spot"}</Text>
                                    {isBooking ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Ionicons name="arrow-forward" size={22} color="#fff" />
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.mainBtn, { opacity: 0.7 }]}>
                                <LinearGradient
                                    colors={['#94A3B8', '#64748B']}
                                    style={styles.btnGradient}
                                >
                                    <Feather name="lock" size={20} color="#fff" />
                                    <Text style={[styles.btnText, { marginLeft: 10 }]}>Private Event Only</Text>
                                </LinearGradient>
                            </View>
                        )}
                    </View>

                    <Modal visible={showBookingForm} animationType="slide" transparent={true} onRequestClose={() => setShowBookingForm(false)}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                            <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: theme.text }]}>Attendee Details</Text>
                                    <TouchableOpacity onPress={() => setShowBookingForm(false)}>
                                        <Ionicons name="close" size={24} color={theme.text} />
                                    </TouchableOpacity>
                                </View>
                                
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name</Text>
                                        <TextInput 
                                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]} 
                                            placeholder="Enter your name"
                                            placeholderTextColor={theme.subtext}
                                            value={attendeeData.name}
                                            onChangeText={text => setAttendeeData({...attendeeData, name: text})}
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: theme.text }]}>Email Address</Text>
                                        <TextInput 
                                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]} 
                                            placeholder="Enter your email"
                                            placeholderTextColor={theme.subtext}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            value={attendeeData.email}
                                            onChangeText={text => setAttendeeData({...attendeeData, email: text})}
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: theme.text }]}>Phone Number</Text>
                                        <TextInput 
                                            style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]} 
                                            placeholder="Enter your number"
                                            placeholderTextColor={theme.subtext}
                                            keyboardType="phone-pad"
                                            value={attendeeData.number}
                                            onChangeText={text => setAttendeeData({...attendeeData, number: text})}
                                        />
                                    </View>
                                    
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: theme.text }]}>Gender</Text>
                                        <View style={styles.genderRow}>
                                            {['Male', 'Female', 'Other'].map((g) => (
                                                <TouchableOpacity 
                                                    key={g} 
                                                    style={[styles.genderBtn, { borderColor: theme.border }, attendeeData.gender === g && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                                                    onPress={() => setAttendeeData({...attendeeData, gender: g})}
                                                >
                                                    <Text style={[styles.genderText, { color: attendeeData.gender === g ? '#fff' : theme.text }]}>{g}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                    
                                    <TouchableOpacity style={[styles.mainBtn, { marginTop: 20 }]} onPress={handleBooking}>
                                        <LinearGradient
                                            colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#4F46E5']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.btnGradient}
                                        >
                                            <Text style={styles.btnText}>{isBooking ? "Confirming..." : "Confirm Booking"}</Text>
                                            {isBooking && <ActivityIndicator size="small" color="#fff" />}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <View style={{ height: 20 }} />
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                </>
            )}
        </SafeAreaView>
    );
};

export { Event_Details };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerBtn: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: {
        width: '100%',
        height: 350,
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    typeBadge: {
        position: 'absolute',
        bottom: 50,
        left: 25,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    typeText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    content: {
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        marginTop: -35,
        paddingTop: 30,
        paddingHorizontal: 25,
    },
    titleSection: {
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        lineHeight: 36,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        justifyContent: 'space-between',
    },
    priceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
    },
    priceText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        marginLeft: 6,
    },
    creatorInfo: {
        fontSize: 13,
        fontWeight: '600',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoCard: {
        width: '48%',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    locationCard: {
        width: '100%',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 10,
        fontWeight: '800',
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 15,
    },
    aboutText: {
        fontSize: 15,
        lineHeight: 26,
    },
    highlightWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    highlightChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
    },
    highlightText: {
        marginLeft: 8,
        fontWeight: '700',
        fontSize: 13,
    },
    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 25,
        paddingBottom: 30,
        paddingTop: 20,
    },
    bottomBlur: {
        position: 'absolute',
        top: -40,
        left: 0,
        right: 0,
        height: 40,
    },
    mainBtn: {
        height: 60,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
    },
    btnGradient: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        maxHeight: '80%',
        borderWidth: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    genderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderBtn: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    genderText: {
        fontWeight: '600',
        fontSize: 14,
    }
});