import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, StatusBar, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONTS, SPACING } from '../../../public/global';

// importing the created files 
import { FootBar } from '../comman_component/footer';
import { Read_From_evetndata_By_ID } from '../../../private/database/offline/oprations/read';
import { Read_From_userdata_By_ID } from '../../../private/database/offline/oprations/read';
import { decryptData } from '../../../utils/Hash';

const Event_Details = ({ getDB, getUserData, setUserData, getPageStack, setPageStack }) => {

    const [getEventData, setEventData] = useState(false);
    // const [getEventCeatorData, setEventCreatorData] = useState(false);
    const [getHighLights, setHighLights] = useState([]);

    const setPageData = async () => {
        const eventID = getPageStack[getPageStack.length - 1].split('.')[1];
        const event = await Read_From_evetndata_By_ID(getDB, eventID);
        setHighLights(decryptData(event.DATA[0].EVENT_HIGHLIGHT).split(','));
        if (event.STATUS == 200) {
            // const creatorData = await Read_From_userdata_By_ID(getDB, event.DATA[0].USER_ID);
            setEventData(event.DATA[0]);
            // setEventCreatorData(creatorData.DATA[0]);

        } else {
            console.log("Error in reading event data:", event.DATA);
        }
    }

    useEffect(() => {
        setPageData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {getEventData && (
                <>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                        {/* Banner Image with Overlays */}
                        <View style={styles.bannerContainer}>
                            <Image 
                                source={{ uri: `${decryptData(getEventData.EVENT_BANNER)}` }} 
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                            {/* Floating Back Button */}
                            <TouchableOpacity 
                                style={styles.backBtn}
                                onPress={() => setPageStack(prev => prev.slice(0, -1))}
                            >
                                <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>

                            {/* Type Badge */}
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeText}>{decryptData(getEventData.EVENT_TYPE)}</Text>
                            </View>
                        </View>

                        <View style={styles.content}>
                            {/* Title and Badge */}
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>{decryptData(getEventData.EVENT_NAME)}</Text>
                                <View style={styles.priceTag}>
                                    <FontAwesome5 name="rupee-sign" size={14} color="#fff" />
                                    <Text style={styles.priceText}>
                                        {decryptData(getEventData.EVENT_AMOUNT) === '0' ? "Free" : decryptData(getEventData.EVENT_AMOUNT)}
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.creatorInfo}>Created by {getEventData.EVENT_CODE}</Text>

                            {/* Detail Cards Row */}
                            <View style={styles.infoGrid}>
                                <View style={styles.infoCard}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                                        <FontAwesome name="calendar" size={18} color="#4f46e5" />
                                    </View>
                                    <View>
                                        <Text style={styles.infoLabel}>Date</Text>
                                        <Text style={styles.infoValue}>{decryptData(getEventData.EVENT_DATE)}</Text>
                                    </View>
                                </View>

                                <View style={styles.infoCard}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#fff7ed' }]}>
                                        <AntDesign name="field-time" size={18} color="#f97316" />
                                    </View>
                                    <View>
                                        <Text style={styles.infoLabel}>Time</Text>
                                        <Text style={styles.infoValue}>{decryptData(getEventData.EVENT_TIME)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.infoCardWide}>
                                <View style={[styles.iconCircle, { backgroundColor: '#f0fdf4' }]}>
                                    <Entypo name="location" size={18} color="#22c55e" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.infoLabel}>Location</Text>
                                    <Text style={styles.infoValue} numberOfLines={2}>{decryptData(getEventData.EVENT_LOCATION)}</Text>
                                </View>
                            </View>

                            {/* About Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>About Event</Text>
                                <Text style={styles.aboutText}>{decryptData(getEventData.EVENT_ABOUT)}</Text>
                            </View>

                            {/* Highlights Section */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Highlights</Text>
                                <View style={styles.highlightWrapper}>
                                    {getHighLights.map((highlight, i) => (
                                        <View key={i} style={styles.highlightChip}>
                                            <FontAwesome name="check-circle" size={14} color={COLORS.primary} />
                                            <Text style={styles.highlightText}>{highlight.trim()}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Spacer for bottom button */}
                            <View style={{ height: 120 }} />
                        </View>
                    </ScrollView>

                    {/* Bottom Action Area */}
                    <View style={styles.bottomBar}>
                        {getEventData.EVENT_TYPE.toLowerCase() !== 'private' ? (
                            <TouchableOpacity style={styles.joinBtn}>
                                <Text style={styles.joinBtnText}>Join Event Now</Text>
                                <AntDesign name="arrowright" size={20} color="#fff" style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        ) : (
                            <View style={[styles.joinBtn, { backgroundColor: '#94a3b8' }]}>
                                <Feather name="lock" size={18} color="#fff" />
                                <Text style={[styles.joinBtnText, { marginLeft: 10 }]}>Private Event</Text>
                            </View>
                        )}
                    </View>
                </>
            )}
            
            <FootBar setPageStack={setPageStack} getPageStack={getPageStack} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        flex: 1,
    },
    bannerContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    backBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 10 : 20,
        left: 20,
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    typeBadge: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    typeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 25,
        paddingTop: 30,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#1e293b',
        flex: 1,
        marginRight: 15,
    },
    priceTag: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 15,
        elevation: 3,
    },
    priceText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    creatorInfo: {
        color: '#64748b',
        fontSize: 13,
        marginTop: 5,
        marginBottom: 25,
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoCard: {
        width: '48%',
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    infoCardWide: {
        width: '100%',
        backgroundColor: '#f8fafc',
        padding: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 25,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 12,
    },
    aboutText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#64748b',
    },
    highlightWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    highlightChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    highlightText: {
        marginLeft: 8,
        color: '#0369a1',
        fontWeight: '600',
        fontSize: 13,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 70, // above footer
        left: 0,
        right: 0,
        paddingHorizontal: 25,
        paddingBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
    },
    joinBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    joinBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export { Event_Details };