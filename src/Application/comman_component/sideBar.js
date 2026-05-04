// React component and screen logic for the app.
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Animated, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import { Alert } from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from 'expo-linear-gradient';

import { FONTS, COLORS, getTheme } from '../../../public/global';
import { Delete_Userdata } from "../../../private/database/offline/oprations/delete";
import { decryptData } from "../../../utils/Hash";

import { useTheme } from "../../../context/ThemeContext";

const { width, height } = Dimensions.get('window');

/**
 * Side Bar.
 */
const SideBar = ({ getDB, getUserData, setSideBar, getPageStack, setPageStack, setUserData }) => {
    const { isDarkMode, colors: theme } = useTheme();
    const user = getUserData[0];
    const currentPage = getPageStack[getPageStack.length - 1];
    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, []);

    /**
     * Close Side Bar.
     */
    const closeSideBar = () => {
        Animated.timing(slideAnim, {
            toValue: -width,
            duration: 250,
            useNativeDriver: true,
        }).start(() => setSideBar(false));
    };

    /**
     * Navigate To.
     */
    const navigateTo = (page) => {
        if (currentPage !== page) {
            setPageStack(preStack => [...preStack, page]);
            closeSideBar();
        }
    };

    /**
     * Render Menu Item.
     */
    const renderMenuItem = (page, icon, label, IconComponent = Ionicons) => {
        const isActive = currentPage === page;
        return (
            <TouchableOpacity 
                activeOpacity={0.7}
                onPress={() => navigateTo(page)}
                style={[styles.menuItem, isActive && { backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF' }]}
            >
                <IconComponent 
                    name={icon} 
                    size={22} 
                    color={isActive ? theme.primary : theme.subtext} 
                />
                <Text style={[styles.menuText, { color: isActive ? theme.primary : theme.text }, isActive && { fontWeight: '800' }]}>
                    {label}
                </Text>
                {isActive && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.overlay}>
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1} 
                onPress={closeSideBar} 
            />
            
            <Animated.View style={[styles.drawer, { backgroundColor: theme.card, transform: [{ translateX: slideAnim }] }]}>
                {/* Header Profile Section */}
                <LinearGradient
                    colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#1E40AF']}
                    style={styles.header}
                >
                    <TouchableOpacity style={styles.closeIcon} onPress={closeSideBar}>
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>
                    
                    <View style={styles.profileContainer}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={user.USER_PIC && user.USER_PIC !== 'null' ? { uri: decryptData(user.USER_PIC) } : require('../../../assets/user.png')}
                                style={styles.profileImage}
                            />
                        </View>
                        <Text style={styles.userName}>{decryptData(user.USER_NAME)}</Text>
                        <Text style={styles.userEmail}>{decryptData(user.USER_EMAIL)}</Text>
                    </View>
                </LinearGradient>

                <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>General</Text>
                    {renderMenuItem('home', 'grid-outline', 'Dashboard')}
                    {renderMenuItem('event', 'calendar-outline', 'Events')}
                    {renderMenuItem('vendor', 'briefcase-outline', 'Vendors')}

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Account</Text>
                    {renderMenuItem('user', 'person-outline', 'My Profile')}
                    {renderMenuItem('notification', 'notifications-outline', 'Notifications')}
                    {renderMenuItem('setting', 'settings-outline', 'Settings')}
                    
                </ScrollView>

                {/* Footer / Logout */}
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                    <TouchableOpacity 
                        style={styles.logoutBtn}
                        onPress={() => {
                            Alert.alert(
                                "Logout",
                                "Are you sure you want to log out?",
                                [
                                    { text: "Cancel", style: "cancel" },
                                    {
                                        text: "Logout",
                                        style: "destructive",
                                        onPress: async () => {
                                            try {
                                                let res = await Delete_Userdata(getDB, user.USER_ID);
                                                if (res.STATUS == 200) {
                                                    setSideBar(false);
                                                    setUserData(false);
                                                }
                                            } catch (error) {
                                                Alert.alert("Error", "Logout failed.");
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                    >
                        <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                    <Text style={[styles.versionText, { color: theme.subtext }]}>GoEvent v1.0.0</Text>
                </View>
            </Animated.View>
        </View>
    );
};

export { SideBar };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        flexDirection: 'row',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        width: width * 0.8,
        height: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 15,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomRightRadius: 40,
    },
    closeIcon: {
        position: 'absolute',
        top: 45,
        right: 15,
        padding: 5,
    },
    profileContainer: {
        marginTop: 10,
    },
    imageWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 2,
        marginBottom: 15,
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
        backgroundColor: '#fff',
    },
    userName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#fff',
    },
    userEmail: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    menuContainer: {
        flex: 1,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '800',
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 12,
        marginVertical: 2,
    },
    activeIndicator: {
        position: 'absolute',
        right: 15,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 15,
    },
    divider: {
        height: 1,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        paddingBottom: 40,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#EF4444',
    },
    versionText: {
        fontSize: 10,
        marginTop: 15,
        textAlign: 'center',
        fontWeight: '700',
    }
});