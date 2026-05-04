// React component and screen logic for the app.
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { FootBar } from '../comman_component/footer';
import { SideBar } from '../comman_component/sideBar';
import { Read_From_evetndata, Read_From_venderdata } from '../../../private/database/offline/oprations/read';
import { EventCard } from './sub_compo/EventCard';
import { VendorCard } from './sub_compo/VendorCard';
import { decryptData } from '../../../utils/Hash';

import { useTheme } from '../../../context/ThemeContext';

/**
 * Home Page.
 */
const HomePage = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {
    const { isDarkMode, colors: theme } = useTheme();

    const [getSideBar, setSideBar] = useState(false);
    const [getEvents, setEvents] = useState([]);
    const [getAllEvents, setAllEvents] = useState([]);
    const [getVendors, setVendors] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    /**
     * Load Data.
     */
    const loadData = async () => {
        // Fetch Events
        const eventRes = await Read_From_evetndata(getDB);
        if (eventRes.STATUS === 200) {
            const sortedEvents = [...eventRes.DATA].sort(
                (a, b) => new Date(b.EVENT_CREATED_AT) - new Date(a.EVENT_CREATED_AT)
            );
            setAllEvents(sortedEvents);
            setEvents(sortedEvents.slice(0, 4)); // Show only top 4 initialy
        }

        // Fetch Vendors
        const vendorRes = await Read_From_venderdata(getDB);
        if (vendorRes.STATUS === 200) {
            setVendors(vendorRes.DATA.slice(0, 4)); // Show top 4
        }
    }

    useEffect(() => {
        loadData();
    }, [])

    const categories = [
        { name: 'All', icon: 'apps' },
        { name: 'Music', icon: 'music' },
        { name: 'Sports', icon: 'trophy' },
        { name: 'Food', icon: 'food' },
        { name: 'Tech', icon: 'laptop' },
        { name: 'Art', icon: 'palette' },
    ];

    /**
     * Filter By Category.
     */
    const filterByCategory = (categoryName) => {
        setSelectedCategory(categoryName);
        if (categoryName === 'All') {
            setEvents(getAllEvents.slice(0, 8));
        } else {
            const filtered = getAllEvents.filter(event => {
                return decryptData(event.EVENT_HIGHLIGHT).toLowerCase().includes(categoryName.toLowerCase())
            });
            setEvents(filtered);
        }
    };

    return (
        <>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <NavBar setPageStack={setPageStack} getUserData={getUserData} title={'Home'} setSideBar={setSideBar} />

                {getSideBar &&
                    <SideBar getDB={getDB} setSideBar={setSideBar} getUserData={getUserData} getPageStack={getPageStack} setPageStack={setPageStack} setUserData={setUserData} />
                }

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Header */}
                    <View style={[styles.header, { backgroundColor: theme.primary }]}>
                        <View style={styles.headerContainer1}>
                            <Text style={[styles.heroTitle, { color: '#ffffff' }]}>Create Event And Send Ticket With Just One Click.</Text>
                            <TouchableOpacity
                                style={styles.createBtn}
                                onPress={() => setPageStack(preStack => [...preStack, "createEvent"])}
                            >
                                <Text style={[styles.createBtnText, { color: theme.primary }]}>Create Event</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.contentBody}>

                        {/* Categories Section */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Explore Categories</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                                {categories.map((cat, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.categoryItem,
                                            selectedCategory === cat.name && styles.categoryItemActive
                                        ]}
                                        onPress={() => filterByCategory(cat.name)}
                                    >
                                        <View style={[
                                            styles.categoryIconCircle,
                                            { backgroundColor: theme.card },
                                            selectedCategory === cat.name && { backgroundColor: theme.primary }
                                        ]}>
                                            <MaterialCommunityIcons
                                                name={cat.icon}
                                                size={28}
                                                color={selectedCategory === cat.name ? '#ffffff' : theme.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.categoryText,
                                            { color: theme.text },
                                            selectedCategory === cat.name && { color: theme.primary, fontWeight: '800' }
                                        ]}>{cat.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Upcoming Events Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Events</Text>
                                <TouchableOpacity onPress={() => setPageStack([...getPageStack, 'event'])}>
                                    <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardList}>
                                {getEvents.length > 0 ? (
                                    getEvents.map((event, index) => (
                                        <EventCard
                                            key={event.ID || index}
                                            DATA={event}
                                            getPageStack={getPageStack}
                                            setPageStack={setPageStack}
                                            color={theme.primary}
                                        />
                                    ))
                                ) : (
                                    <Text style={[styles.emptyText, { color: theme.subtext }]}>No upcoming events found</Text>
                                )}
                            </View>
                        </View>

                        {/* Featured Vendors Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Vendors</Text>
                                <TouchableOpacity onPress={() => setPageStack([...getPageStack, 'vendor'])}>
                                    <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                style={[{ display: 'flex', flexDirection: 'row', gap: 10 }]}
                                horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.vendorScroll}
                            >
                                {getVendors.length > 0 ? (
                                    getVendors.map((vendor, index) => (
                                        <VendorCard
                                            key={vendor.ID || index}
                                            DATA={vendor}
                                            getPageStack={getPageStack}
                                            setPageStack={setPageStack}
                                        />
                                    ))
                                ) : (
                                    <Text style={[styles.emptyText, { color: theme.subtext }]}>Soon top vendors will appear here</Text>
                                )}
                            </ScrollView>
                        </View>

                        {/* Why Choose Us info section */}
                        <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Text style={[styles.infoTitle, { color: theme.primary }]}>Experience Seamless Events</Text>
                            <Text style={[styles.infoDesc, { color: theme.subtext }]}>Managing events has never been easier. Secure ticketing, vendor management, and offline support - all in one app.</Text>
                        </View>

                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                <FootBar setPageStack={setPageStack} getPageStack={getPageStack} style={{ position: 'absolute', bottom: 0 }} />
            </SafeAreaView>
        </>
    )
}

export { HomePage };

// Style definitions for the styles component.
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: 240,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerContainer1: {
        alignItems: 'center',
    },
    heroTitle: {
        fontWeight: '900',
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 32,
    },
    createBtn: {
        marginTop: 25,
        paddingVertical: 12,
        paddingHorizontal: 28,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 5,
    },
    createBtnText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    contentBody: {
        paddingTop: 20,
    },
    section: {
        marginBottom: 25,
        paddingHorizontal: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingRight: 5,
    },
    sectionTitle: {
        fontWeight: '800',
        fontSize: 19,
    },
    viewAll: {
        fontWeight: '600',
    },
    categoryScroll: {
        paddingVertical: 10,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryIconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '600',
    },
    categoryItemActive: {
        transform: [{ scale: 1.05 }],
    },
    cardList: {
        width: '100%',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    vendorScroll: {
        paddingBottom: 20,
    },
    infoSection: {
        marginHorizontal: 15,
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    infoDesc: {
        textAlign: 'center',
        lineHeight: 20,
        fontSize: 14,
    },
    emptyContainer: {
        width: '100%',
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    }
});
