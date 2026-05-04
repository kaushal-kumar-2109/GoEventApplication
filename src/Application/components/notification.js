// React component and screen logic for the app.
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { NavBar } from '../comman_component/navBar';
import { Read_Notifications_By_UserID } from '../../../private/database/offline/oprations/read';

import { useTheme } from "../../../context/ThemeContext";

/**
 * Notification Page.
 */
const NotificationPage = ({ getDB, getUserData, setPageStack }) => {
    
    const { isDarkMode, colors: theme } = useTheme();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetch Notifications.
     */
    const fetchNotifications = async () => {
        setLoading(true);
        const res = await Read_Notifications_By_UserID(getDB, getUserData[0].USER_ID);
        if (res.STATUS === 200) {
            setNotifications(res.DATA);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    /**
     * Render Item.
     */
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            activeOpacity={0.8} 
            style={[styles.notificationCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? theme.background : '#EFF6FF' }]}>
                <Ionicons 
                    name={item.TITLE.includes('Booking') ? "ticket-outline" : "calendar-outline"} 
                    size={24} 
                    color={theme.primary} 
                />
            </View>
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: theme.text }]}>{item.TITLE}</Text>
                    {item.STATUS === 'UNREAD' && <View style={styles.unreadDot} />}
                </View>
                <Text style={[styles.message, { color: theme.subtext }]} numberOfLines={2}>{item.MESSAGE}</Text>
                <Text style={[styles.time, { color: theme.subtext }]}>
                    {new Date(item.TIME).toLocaleDateString()} • {new Date(item.TIME).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <NavBar setPageStack={setPageStack} title="Notifications" isDarkMode={isDarkMode} />
            
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Recent Updates</Text>
                <TouchableOpacity onPress={fetchNotifications}>
                    <Ionicons name="refresh-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.NOTIFICATION_ID}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.center}>
                    <MaterialCommunityIcons name="bell-off-outline" size={80} color={theme.subtext} />
                    <Text style={[styles.emptyText, { color: theme.subtext }]}>No notifications yet.</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export { NotificationPage };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    notificationCard: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '800',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#3B82F6',
    },
    message: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 6,
    },
    time: {
        fontSize: 11,
        fontWeight: '600',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: '600',
    }
});
