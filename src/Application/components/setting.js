// React component and screen logic for the app.
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { NavBar } from '../comman_component/navBar';
import { useTheme } from "../../../context/ThemeContext";

/**
 * Setting Page.
 */
const SettingPage = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {
    
    const { isDarkMode, colors: theme, toggleTheme } = useTheme();

    /**
     * Setting Item.
     */
    const SettingItem = ({ icon, label, value, onPress, type = "link", IconComponent = Ionicons }) => (
        <TouchableOpacity 
            activeOpacity={0.7} 
            style={[styles.item, { borderBottomColor: theme.border }]} 
            onPress={onPress}
        >
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                <IconComponent name={icon} size={20} color={theme.primary} />
            </View>
            <View style={styles.itemContent}>
                <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
                {value && <Text style={[styles.value, { color: theme.subtext }]}>{value}</Text>}
            </View>
            {type === "link" && <Ionicons name="chevron-forward" size={20} color={theme.subtext} />}
            {type === "switch" && (
                <Switch 
                    value={isDarkMode} 
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#CBD5E1", true: theme.primary }}
                    thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <NavBar setPageStack={setPageStack} title="Settings" isDarkMode={isDarkMode} />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Appearance</Text>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <SettingItem 
                            icon={isDarkMode ? "moon-outline" : "sunny-outline"} 
                            label="Dark Mode" 
                            type="switch" 
                        />
                        <SettingItem 
                            icon="language-outline" 
                            label="Language" 
                            value="English (US)" 
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Account</Text>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <SettingItem 
                            icon="person-outline" 
                            label="Profile Information" 
                            onPress={() => setPageStack(prev => [...prev, 'user'])}
                        />
                        <SettingItem 
                            icon="shield-checkmark-outline" 
                            label="Security & Privacy" 
                        />
                        <SettingItem 
                            icon="notifications-outline" 
                            label="Push Notifications" 
                            onPress={() => setPageStack(prev => [...prev, 'notification'])}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>Data & Storage</Text>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <SettingItem 
                            icon="cloud-upload-outline" 
                            label="Offline Sync" 
                            value="Automatic" 
                        />
                        <SettingItem 
                            icon="trash-outline" 
                            label="Clear Cache" 
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.subtext }]}>About</Text>
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <SettingItem 
                            icon="information-circle-outline" 
                            label="Version" 
                            value="1.0.0" 
                        />
                        <SettingItem 
                            icon="document-text-outline" 
                            label="Terms of Service" 
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteBtnText}>Deactivate Account</Text>
                </TouchableOpacity>
                
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export { SettingPage };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 5,
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemContent: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    },
    value: {
        fontSize: 13,
        marginTop: 2,
    },
    deleteBtn: {
        marginTop: 10,
        padding: 15,
        alignItems: 'center',
    },
    deleteBtnText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 15,
    }
});
