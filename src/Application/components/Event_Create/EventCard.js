// React component and screen logic for the app.
import { View, Image, StyleSheet, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Dimensions } from "react-native";
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Alert } from "react-native";
import { useState } from "react";

import { Delete_EventData } from "../../../../private/database/offline/oprations/delete";
import { COLORS } from "../../../../public/global";
import { decryptData } from "../../../../utils/Hash";

const { width } = Dimensions.get('window');

/**
 * Event Card.
 */
const EventCard = ({ getDB, DATA, color, getPageStack, setPageStack }) => {

    const [getMenu, setMenu] = useState(false);

    /**
     * Toggles  menu in application state.
     */
    const toggleMenu = () => setMenu(!getMenu);

    /**
     * Handles  delete logic for the application.
     */
    const handleDelete = () => {
        setMenu(false);
        Alert.alert(
            "Delete Event",
            "Are you sure you want to delete this event? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive",
                    onPress: async () => {
                        const res = await Delete_EventData(getDB, DATA.USER_ID, DATA.EVENT_ID);
                        // Optional: trigger a refresh in parent if needed
                    }
                }
            ]
        );
    };

    /**
     * Navigate To.
     */
    const navigateTo = (route) => {
        setMenu(false);
        setPageStack(prev => [...prev, `${route}.${DATA.EVENT_ID}`]);
    };

    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity 
                activeOpacity={0.9} 
                style={styles.card}
                onPress={() => navigateTo('eventDetails')}
            >
                {/* Banner Image */}
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: `${decryptData(DATA.EVENT_BANNER)}` }} 
                        style={styles.cardImage}
                        resizeMode="cover"
                    />
                    <View style={styles.priceBadge}>
                        <FontAwesome5 name="rupee-sign" size={10} color="#ffffff" />
                        <Text style={styles.priceText}>
                            {decryptData(DATA.EVENT_AMOUNT) === '0' ? "Free" : decryptData(DATA.EVENT_AMOUNT)}
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.eventName} numberOfLines={1}>
                            {decryptData(DATA.EVENT_NAME)}
                        </Text>
                        <TouchableOpacity onPress={toggleMenu} style={styles.menuTrigger}>
                            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.subtext} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.detailText}>{decryptData(DATA.EVENT_DATE)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Feather name="clock" size={14} color={COLORS.primary} />
                        <Text style={styles.detailText}>{decryptData(DATA.EVENT_TIME)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.detailText} numberOfLines={1}>{decryptData(DATA.EVENT_LOCATION)}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Professional Options Menu */}
            {getMenu && (
                <>
                    <TouchableWithoutFeedback onPress={() => setMenu(false)}>
                        <View style={styles.menuOverlay} />
                    </TouchableWithoutFeedback>
                    <View style={styles.menuPopup}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('scan')}>
                            <MaterialCommunityIcons name="qrcode-scan" size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>Scan QR</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('invite')}>
                            <Ionicons name="person-add-outline" size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>Invite Members</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('eventDetails')}>
                            <Ionicons name="information-circle-outline" size={20} color={COLORS.text} />
                            <Text style={styles.menuItemText}>View Details</Text>
                        </TouchableOpacity>

                        <View style={styles.menuDivider} />

                        <TouchableOpacity style={[styles.menuItem]} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                            <Text style={[styles.menuItemText, { color: COLORS.error }]}>Delete Event</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

export { EventCard };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    cardContainer: {
        marginHorizontal: 12,
        marginVertical: 10,
        position: 'relative',
    },
    card: {
        width: 260,
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    priceBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    priceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    contentContainer: {
        padding: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    eventName: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        flex: 1,
    },
    menuTrigger: {
        padding: 4,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    detailText: {
        fontSize: 13,
        color: COLORS.subtext,
        marginLeft: 8,
        fontWeight: '500',
    },
    menuOverlay: {
        position: 'absolute',
        top: -500,
        left: -500,
        right: -500,
        bottom: -500,
        zIndex: 9,
    },
    menuPopup: {
        position: 'absolute',
        top: 40,
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        width: 180,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 12,
    },
    menuDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 4,
    }
});