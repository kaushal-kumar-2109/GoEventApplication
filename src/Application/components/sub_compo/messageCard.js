// React component and screen logic for the app.
import { useTheme } from "../../../../context/ThemeContext";
import { Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * Message Card.
 */
const MessageCard = ({ setPageStack, color, title, dis, count }) => {
    const { colors: theme, isDarkMode } = useTheme();
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPageStack(preStack => [...preStack, "createEvent"])}
        >
            <LinearGradient
                colors={color}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.createCard}
            >
                <View style={styles.iconContainer}>
                    <Ionicons name="add-circle-outline" size={28} color="white" />
                </View>
                
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.disText}>{dis}</Text>
                    {count !== "" && <Text style={styles.countText}>{count}</Text>}
                </View>

                <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export { MessageCard };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    createCard: {
        height: 120,
        width: 220,
        borderRadius: 20,
        padding: 15,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    iconContainer: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    titleText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
        marginBottom: 2,
    },
    disText: {
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '600',
        fontSize: 11,
    },
    countText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
        marginTop: 4,
    },
    arrowContainer: {
        marginLeft: 5,
    }
});