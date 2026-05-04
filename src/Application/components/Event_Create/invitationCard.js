// React component and screen logic for the app.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { decryptData } from "../../../../utils/Hash";
import { useTheme } from "../../../../context/ThemeContext";

/**
 * Invite Card.
 */
const InviteCard = ({ DATA, EVENT, getPageStack, setPageStack }) => {
    const { colors: theme, isDarkMode } = useTheme();
    const isAccepted = DATA.STATUS === "ACCEPTED";

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: isAccepted ? '#10B981' : theme.border }]}>
            <View style={styles.header}>
                <View style={[styles.iconBox, { backgroundColor: isAccepted ? '#D1FAE5' : (isDarkMode ? '#334155' : '#DBEAFE') }]}>
                    <Ionicons 
                        name={isAccepted ? "checkmark-circle" : "mail-outline"} 
                        size={20} 
                        color={isAccepted ? '#10B981' : theme.primary} 
                    />
                </View>
                <View style={styles.titleArea}>
                    <Text style={[styles.emailText, { color: theme.text }]} numberOfLines={1}>{DATA.MEMBER_EMAIL}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: isAccepted ? '#10B981' : '#F59E0B' }]}>
                        <Text style={styles.statusText}>{DATA.STATUS}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={14} color={theme.subtext} />
                    <Text style={[styles.detailLabel, { color: theme.subtext }]}>{decryptData(EVENT.EVENT_DATE)}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="location-outline" size={14} color={theme.subtext} />
                    <Text style={[styles.detailLabel, { color: theme.subtext }]} numberOfLines={1}>{decryptData(EVENT.EVENT_LOCATION)}</Text>
                </View>
            </View>
        </View>
    );
}

export { InviteCard };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 15,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        borderWidth: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titleArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emailText: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailLabel: {
        fontSize: 12,
        fontWeight: '600',
    }
});