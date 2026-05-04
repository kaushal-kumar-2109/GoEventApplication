// React component and screen logic for the app.
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { MessageCard } from './sub_compo/messageCard';
import { Read_All_Offline_Data, Read_Bookings_By_UserID } from '../../../private/database/offline/oprations/read';
import { EventCard } from './Event_Create/EventCard';
import { UPDATE_USER_DATA_FIELD } from '../../../private/database/offline/oprations/update';

import { encryptData, decryptData } from '../../../utils/Hash';

const { width } = Dimensions.get('window');

import { useTheme } from '../../../context/ThemeContext';

/**
 * User Page.
 */
const UserPage = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {
    const { colors: theme, isDarkMode } = useTheme();

    const [getSideBar, setSideBar] = useState(false);
    const [getUData, setUData] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [bookings, setBookings] = useState([]);
    const user = getUserData[0];

    /**
     * Field Data.
     */
    const FieldData = async () => {
        let uData = await Read_All_Offline_Data(getDB, user.USER_ID);
        if (uData.STATUS == 200) {
            setUData(uData);
        }
        
        let bData = await Read_Bookings_By_UserID(getDB, user.USER_ID);
        if (bData.STATUS === 200) {
            setBookings(bData.DATA);
        }
    }

    useEffect(() => {
        FieldData();
        if (user.USER_PIC && user.USER_PIC !== 'null') {
            setProfileImage(decryptData(user.USER_PIC));
        }
    }, [getUserData]);

    /**
     * Pick Image.
     */
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const sourceUri = result.assets[0].uri;
            saveImageLocally(sourceUri);
        }
    };

    /**
     * Save Image Locally.
     */
    const saveImageLocally = async (uri) => {
        try {
            const fileName = `profile_${user.USER_ID}_${Date.now()}.jpg`;
            const destDir = `${FileSystem.documentDirectory}profile_pics/`;
            
            const dirInfo = await FileSystem.getInfoAsync(destDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
            }

            const destPath = `${destDir}${fileName}`;
            await FileSystem.copyAsync({
                from: uri,
                to: destPath
            });

            const encryptedPath = encryptData(destPath);
            const res = await UPDATE_USER_DATA_FIELD(getDB, user.USER_ID, 'USER_PIC', encryptedPath);

            if (res.STATUS === 200) {
                setProfileImage(destPath);
                const updatedUserData = [...getUserData];
                updatedUserData[0].USER_PIC = encryptedPath;
                setUserData(updatedUserData);
                Alert.alert("Success", "Profile image updated successfully!");
            }
        } catch (error) {
            console.error("Error saving image:", error);
            Alert.alert("Error", "An error occurred while saving the image.");
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Profile'} setSideBar={setSideBar} isDarkMode={isDarkMode} />
            
            {getSideBar &&
                <SideBar getDB={getDB} setSideBar={setSideBar} getUserData={getUserData} getPageStack={getPageStack} setPageStack={setPageStack} setUserData={setUserData} isDarkMode={isDarkMode} />
            }

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} style={{ backgroundColor: theme.background }}>
                {/* Profile Header Section */}
                <View style={[styles.headerContainer, { backgroundColor: theme.card }]}>
                    <LinearGradient
                        colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#1E40AF']}
                        style={styles.headerGradient}
                    />
                    
                    <View style={styles.profileInfoContainer}>
                        <View style={[styles.imageWrapper, { backgroundColor: theme.card }]}>
                            <Image
                                source={profileImage ? { uri: profileImage } : require('../../../assets/user.png')}
                                style={styles.profileImage}
                                resizeMode="cover"
                            />
                            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary }]} onPress={pickImage}>
                                <MaterialIcons name="photo-camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        
                        <Text style={[styles.userName, { color: theme.text }]}>{decryptData(user.USER_NAME)}</Text>
                        <Text style={[styles.userEmail, { color: theme.subtext }]}>{decryptData(user.USER_EMAIL)}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <MessageCard 
                            setPageStack={setPageStack} 
                            count={""} 
                            title={'Create Event'} 
                            dis={'Host a new event'} 
                            color={['#4F46E5', '#7C3AED']} 
                        />
                        <TouchableOpacity 
                            style={styles.actionCard}
                            onPress={() => setPageStack(prev => [...prev, 'home'])}
                        >
                            <LinearGradient
                                colors={['#F59E0B', '#D97706']}
                                style={styles.actionGradient}
                            >
                                <Ionicons name="search" size={24} color="white" />
                                <Text style={styles.actionText}>Explore Events</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Account Settings */}
                <View style={styles.sectionContainer}>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Account Overview</Text>
                        
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.subtext }]}>Full Name</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                                <Feather name="user" size={18} color={theme.subtext} style={styles.inputIcon} />
                                <Text style={[styles.staticText, { color: theme.text }]}>{decryptData(user.USER_NAME)}</Text>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.subtext }]}>Phone Number</Text>
                            <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                                <Feather name="phone" size={18} color={theme.subtext} style={styles.inputIcon} />
                                <Text style={[styles.staticText, { color: theme.text }]}>{decryptData(user.USER_NUMBER)}</Text>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.updateBtn, { backgroundColor: theme.primary }]}
                            onPress={() => setPageStack(prev => [...prev, 'setting'])}
                        >
                            <Text style={styles.updateBtnText}>Manage Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Events Sections */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>My Created Events</Text>
                        <TouchableOpacity onPress={() => setPageStack(prev => [...prev, 'event'])}>
                            <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {getUData && getUData.EVENTS && getUData.EVENTS.length > 0 ? (
                            getUData.EVENTS.map((event, index) => (
                                <EventCard 
                                    getDB={getDB} 
                                    getPageStack={getPageStack} 
                                    setPageStack={setPageStack} 
                                    key={event.EVENT_ID || index} 
                                    DATA={event} 
                                    isDarkMode={isDarkMode}
                                />
                            ))
                        ) : (
                            <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                                <Ionicons name="calendar-outline" size={48} color={theme.subtext} />
                                <Text style={[styles.emptyStateText, { color: theme.subtext }]}>No events created yet.</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {/* Booked Events Section */}
                <View style={[styles.sectionContainer, { marginBottom: 20 }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Booked Events</Text>
                    {bookings.length > 0 ? (
                        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                             {bookings.map((booking, i) => (
                                <View key={i} style={[styles.bookingItem, i < bookings.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                                    <View style={[styles.bookingIcon, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF' }]}>
                                        <Ionicons name="ticket" size={20} color={theme.primary} />
                                    </View>
                                    <View>
                                        <Text style={[styles.bookingID, { color: theme.text }]}>Event ID: {booking.EVENT_ID.substring(0, 8)}...</Text>
                                        <Text style={[styles.bookingTime, { color: theme.subtext }]}>{new Date(booking.BOOKING_TIME).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>{booking.STATUS}</Text>
                                    </View>
                                </View>
                             ))}
                        </View>
                    ) : (
                        <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <MaterialIcons name="event-available" size={40} color={theme.subtext} />
                            <Text style={[styles.emptyStateText, { color: theme.subtext }]}>You haven't booked any events yet.</Text>
                            <TouchableOpacity 
                                style={[styles.browseBtn, { backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF' }]}
                                onPress={() => setPageStack(prev => [...prev, 'home'])}
                            >
                                <Text style={[styles.browseBtnText, { color: theme.primary }]}>Browse Events</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

            </ScrollView>

            <FootBar getPageStack={getPageStack} setPageStack={setPageStack} />
        </SafeAreaView>
    );
};

export { UserPage };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 280,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
    },
    headerGradient: {
        height: 150,
        width: '100%',
        position: 'absolute',
    },
    profileInfoContainer: {
        alignItems: 'center',
        marginTop: 70,
    },
    imageWrapper: {
        position: 'relative',
        padding: 4,
        borderRadius: 75,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 8,
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 65,
    },
    editButton: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 15,
    },
    userEmail: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginTop: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 15,
    },
    horizontalScroll: {
        marginLeft: -10,
    },
    card: {
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    staticText: {
        fontSize: 15,
        fontWeight: '600',
    },
    inputIcon: {
        marginRight: 10,
    },
    updateBtn: {
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    updateBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
    actionCard: {
        width: 200,
        height: 100,
        borderRadius: 15,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16,
        marginTop: 8,
    },
    emptyState: {
        width: width - 40,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginVertical: 10,
    },
    emptyStateText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
    },
    emptyCard: {
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    seeAllText: {
        fontWeight: '800',
        fontSize: 14,
    },
    browseBtn: {
        marginTop: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    browseBtnText: {
        fontWeight: '800',
        fontSize: 14,
    },
    bookingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    bookingIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bookingID: {
        fontSize: 14,
        fontWeight: '700',
    },
    bookingTime: {
        fontSize: 12,
    },
    statusBadge: {
        marginLeft: 'auto',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#166534',
        fontSize: 10,
        fontWeight: '800',
    }
});