// React component and screen logic for the app.
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { COLORS, getTheme, FONTS } from '../../../public/global';

import { useTheme } from '../../../context/ThemeContext';

const NavBar = ({
    setPageStack,
    title,
    setSideBar,
    getSearchValue,
    setSearchValue
}) => {
    const { colors: theme } = useTheme();
    const [getSearchBar, setSearchBar] = useState(false);

    /**
     * Handles  back logic for the application.
     */
    const handleBack = () => {
        setPageStack(prev => prev.slice(0, -1));
    };

    const isInternalPage = ['Settings', 'Notifications', 'Invite Users', 'Check-in Scanner', 'Event Details'].includes(title);

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            {getSearchBar ? (
                <View style={styles.searchContainer}>
                    <TouchableOpacity
                        onPress={() => setSearchBar(false)}
                        style={styles.searchBackBtn}
                    >
                        <Feather name="arrow-left" size={24} color={theme.text} />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Search events...'
                        placeholderTextColor={theme.subtext}
                        style={[styles.searchInput, { color: theme.text, borderBottomColor: theme.primary }]}
                        value={getSearchValue}
                        onChangeText={setSearchValue}
                        autoFocus={true}
                    />
                </View>
            ) : (
                <>
                    <View style={styles.leftContainer}>
                        {isInternalPage ? (
                            <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
                                <Ionicons name="arrow-back" size={24} color={theme.text} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setSideBar(true)} style={styles.iconBtn}>
                                <Ionicons name="menu-outline" size={28} color={theme.text} />
                            </TouchableOpacity>
                        )}
                        <Text style={[styles.title, { color: theme.text }]}>
                            {title}
                        </Text>
                    </View>

                    <View style={styles.rightContainer}>
                        {(title === "Events") && (
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => setSearchBar(true)}
                            >
                                <Ionicons name="search-outline" size={24} color={theme.text} />
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => setPageStack(prev => [...prev, 'notification'])}
                        >
                            <Ionicons name="notifications-outline" size={24} color={theme.text} />
                            {/* Potential Notification Badge */}
                            <View style={styles.badge} />
                        </TouchableOpacity>

                        {!isInternalPage && (
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => setPageStack(prev => [...prev, 'setting'])}
                            >
                                <Ionicons name="settings-outline" size={24} color={theme.text} />
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}
        </View>
    );
};

export { NavBar };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 10 : 20,
        paddingBottom: 15,
        paddingHorizontal: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        marginLeft: 10,
    },
    iconBtn: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    searchBackBtn: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        borderBottomWidth: 2,
        paddingVertical: 6,
        paddingHorizontal: 5,
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#fff',
    }
});
