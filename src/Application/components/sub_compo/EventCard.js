// React component and screen logic for the app.
import { View, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { encryptData, decryptData } from "../../../../utils/Hash";
import { useTheme } from "../../../../context/ThemeContext";

/**
 * Event Card.
 */
const EventCard = ({ DATA, color, getPageStack, setPageStack }) => {
    const { colors: theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={() => setPageStack([...getPageStack, `eventDetails.${DATA.EVENT_ID}`])}
            style={[Style.Card, { backgroundColor: theme.card, borderColor: theme.border }]}>

            <View style={Style.ImageContainer}>
                <Image
                    source={{ uri: `${decryptData(DATA.EVENT_BANNER)}` }}
                    style={Style.CardImage}
                    resizeMode="cover"
                />
                <View style={[Style.PriceBadge, { backgroundColor: theme.primary }]}>
                    <FontAwesome5 name="rupee-sign" size={10} color="#ffffff" />
                    <Text style={Style.PriceText}>
                        {decryptData(DATA.EVENT_AMOUNT) === '0' ? "Free" : decryptData(DATA.EVENT_AMOUNT)}
                    </Text>
                </View>
            </View>

            <View style={Style.Content}>
                <Text style={[Style.Title, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">
                    {decryptData(DATA.EVENT_NAME)}
                </Text>

                <View style={Style.DetailRow}>
                    <View style={Style.DetailItem}>
                        <EvilIcons name="calendar" size={20} color={theme.subtext} />
                        <Text style={[Style.DetailText, { color: theme.subtext }]} numberOfLines={1}>{decryptData(DATA.EVENT_DATE)}</Text>
                    </View>
                    <View style={Style.DetailItem}>
                        <Feather name="clock" size={14} color={theme.subtext} />
                        <Text style={[Style.DetailText, { color: theme.subtext }]} numberOfLines={1}>{decryptData(DATA.EVENT_TIME)}</Text>
                    </View>
                </View>

                <View style={Style.LocationRow}>
                    <EvilIcons name="location" size={20} color={theme.subtext} />
                    <Text style={[Style.DetailText, { color: theme.subtext }]} numberOfLines={1} ellipsizeMode="tail">{decryptData(DATA.EVENT_LOCATION)}</Text>
                </View>

                <View style={[Style.Footer, { borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        onPress={() => typeof saveToBookMark === 'function' && saveToBookMark(DATA.id, DATA.UserId)}
                        style={Style.BookmarkBtn}
                    >
                        <FontAwesome5 name="bookmark" size={16} color={color || theme.primary} />
                    </TouchableOpacity>

                    <View style={[Style.CategoryBadge, { backgroundColor: theme.primary + '20' }]}>
                        <Text style={[Style.CategoryText, { color: theme.primary }]}>{decryptData(DATA.EVENT_HIGHLIGHT)}</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    )
}

export { EventCard };

// Style definitions for the style component.
const Style = StyleSheet.create({
    Card: {
        width: 250,
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
    },
    ImageContainer: {
        width: '100%',
        height: 120,
        position: 'relative',
    },
    CardImage: {
        height: '100%',
        width: '100%',
    },
    PriceBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    PriceText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 3,
    },
    Content: {
        padding: 12,
    },
    Title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },
    DetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    DetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    LocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    DetailText: {
        fontSize: 11,
        marginLeft: 2,
    },
    Footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
        borderTopWidth: 1,
        paddingTop: 8,
    },
    BookmarkBtn: {
        padding: 4,
    },
    CategoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    CategoryText: {
        fontSize: 10,
        fontWeight: '600',
    }
});
