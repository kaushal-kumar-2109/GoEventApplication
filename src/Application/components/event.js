import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS, FONTS, SPACING } from '../../../public/global';
import { decryptData } from '../../../utils/Hash';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { SideBar } from '../comman_component/sideBar';
import { EventCard } from './sub_compo/EventCard';
import { Read_From_evetndata } from '../../../private/database/offline/oprations/read';

const EventPage = ({ getDB, getUserData, setUserData, setPageStack, getPageStack }) => {

    const [getSideBar, setSideBar] = useState(false);
    const [getSearchValue, setSearchValue] = useState('');
    const [getEvents, setEvents] = useState([]);
    const [getFilteredEvent, setFilteredEvents] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Filter Modal States
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [activeFilterCount, setActiveFilterCount] = useState(0);

    const categories = [
        { name: 'All', icon: 'apps' },
        { name: 'Music', icon: 'music' },
        { name: 'Sports', icon: 'trophy' },
        { name: 'Food', icon: 'food' },
        { name: 'Tech', icon: 'laptop' },
        { name: 'Art', icon: 'palette' },
    ];

    // Import events from database
    const importEvents = async () => {
        const res = await Read_From_evetndata(getDB);

        if (res.STATUS === 200) {
            const sortedEvents = [...res.DATA].sort(
                (a, b) => new Date(b.EVENT_CREATED_AT) - new Date(a.EVENT_CREATED_AT)
            );
            setEvents(sortedEvents);
            setFilteredEvents(sortedEvents);

        } else {
            console.log("Error in fetching events data");
        }
    }

    // Load events once
    useEffect(() => {
        importEvents();
    }, [])

    // ✅ Centralized filtering logic
    useEffect(() => {
        let filtered = [...getEvents];

        // 1. Filter by Search Text (Name)
        if (getSearchValue && getSearchValue.trim() !== "") {
            filtered = filtered.filter(event => {
                const name = decryptData(event.EVENT_NAME) || "";
                return name.toLowerCase().includes(getSearchValue.toLowerCase());
            });
        }

        // 2. Filter by Category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(event => {
                const highlight = decryptData(event.EVENT_HIGHLIGHT) || "";
                return highlight.toLowerCase().includes(selectedCategory.toLowerCase());
            });
        }

        // 3. Filter by Price Range
        let count = 0;
        if (minPrice !== "" || maxPrice !== "") {
            filtered = filtered.filter(event => {
                const amountStr = decryptData(event.EVENT_AMOUNT) || "0";
                const amount = parseFloat(amountStr) || 0;
                const min = minPrice === "" ? 0 : parseFloat(minPrice);
                const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
                return amount >= min && amount <= max;
            });
            count = (minPrice !== "" ? 1 : 0) + (maxPrice !== "" ? 1 : 0);
        }
        
        setActiveFilterCount(count);
        setFilteredEvents(filtered);

    }, [getSearchValue, getEvents, selectedCategory, minPrice, maxPrice]);


    return (
        <>
            <SafeAreaView style={styles.container}>

                <NavBar
                    setPageStack={setPageStack}
                    setSearchValue={setSearchValue}
                    getSearchValue={getSearchValue}
                    setSideBar={setSideBar}
                    title={'Events'}
                />

                {getSideBar &&
                    <SideBar
                        getDB={getDB}
                        setSideBar={setSideBar}
                        getUserData={getUserData}
                        getPageStack={getPageStack}
                        setPageStack={setPageStack}
                    />
                }

                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Horizontal Categories */}
                    <View style={styles.categorySection}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
                            {categories.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryItem,
                                        selectedCategory === cat.name && styles.categoryItemActive
                                    ]}
                                    onPress={() => setSelectedCategory(cat.name)}
                                >
                                    <View style={[
                                        styles.categoryIconCircle,
                                        selectedCategory === cat.name && { backgroundColor: COLORS.primary }
                                    ]}>
                                        <MaterialCommunityIcons
                                            name={cat.icon}
                                            size={22}
                                            color={selectedCategory === cat.name ? '#ffffff' : COLORS.primary}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.categoryText,
                                        selectedCategory === cat.name && { color: COLORS.primary, fontWeight: 'bold' }
                                    ]}>{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Filter Button Row */}
                    <View style={styles.filterRow}>
                        <TouchableOpacity 
                            style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                            onPress={() => setShowFilterModal(true)}
                        >
                            <MaterialCommunityIcons
                                name="tune-variant"
                                size={20}
                                color={activeFilterCount > 0 ? "#ffffff" : "#666"}
                            />
                            <Text style={[styles.filterBtnText, activeFilterCount > 0 && { color: "#ffffff" }]}>
                                Price Filter {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                            </Text>
                        </TouchableOpacity>

                        { (selectedCategory !== 'All' || activeFilterCount > 0 || getSearchValue !== '') && (
                            <TouchableOpacity 
                                style={styles.clearBtn}
                                onPress={() => {
                                    setSelectedCategory('All');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSearchValue('');
                                }}
                            >
                                <Text style={styles.clearBtnText}>Clear All</Text>
                            </TouchableOpacity>
                        )}
                    </View>


                    {/* Event Cards */}
                    <View style={styles.cardContainer}>

                        {getFilteredEvent && getFilteredEvent.length > 0
                            ? (
                                getFilteredEvent.map((event, index) => (
                                    <EventCard
                                        getPageStack={getPageStack}
                                        setPageStack={setPageStack}
                                        key={event.EVENT_ID || index}
                                        DATA={event}
                                        color={COLORS.primary}
                                    />
                                ))
                            )
                            : (
                                <View style={styles.noDataContainer}>
                                    <MaterialCommunityIcons name="calendar-search" size={60} color="#ccc" />
                                    <Text style={styles.noDataText}>No events found matching your criteria</Text>
                                    <TouchableOpacity 
                                        style={styles.resetBtn}
                                        onPress={() => {
                                            setSelectedCategory('All');
                                            setMinPrice('');
                                            setMaxPrice('');
                                            setSearchValue('');
                                        }}
                                    >
                                        <Text style={styles.resetBtnText}>Reset Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                    </View>

                </ScrollView>

                {/* Price Filter Modal */}
                <Modal
                    visible={showFilterModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowFilterModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Price Range</Text>
                                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                    <Ionicons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalBody}>
                                <View style={styles.priceRow}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Min Price</Text>
                                        <TextInput
                                            style={styles.priceInput}
                                            placeholder="₹ 0"
                                            keyboardType="numeric"
                                            value={minPrice}
                                            onChangeText={setMinPrice}
                                        />
                                    </View>
                                    <View style={styles.priceSeparator} />
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Max Price</Text>
                                        <TextInput
                                            style={styles.priceInput}
                                            placeholder="₹ Any"
                                            keyboardType="numeric"
                                            value={maxPrice}
                                            onChangeText={setMaxPrice}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.modalFooter}>
                                <TouchableOpacity 
                                    style={styles.applyBtn}
                                    onPress={() => setShowFilterModal(false)}
                                >
                                    <Text style={styles.applyBtnText}>Apply Filters</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </>
    )
}

export { EventPage };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    categorySection: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryScroll: {
        paddingHorizontal: 15,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 20,
        paddingBottom: 5,
    },
    categoryIconCircle: {
        width: 45,
        height: 45,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
    },
    categoryItemActive: {
        transform: [{ scale: 1.05 }],
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        elevation: 2,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterBtnText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    clearBtn: {
        padding: 5,
    },
    clearBtnText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    cardContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingBottom: 40,
    },
    noDataContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        paddingHorizontal: 40,
    },
    noDataText: {
        marginTop: 15,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        lineHeight: 24,
    },
    resetBtn: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
    },
    resetBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
        minHeight: 300,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    modalBody: {
        marginBottom: 40,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    inputGroup: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    priceSeparator: {
        width: 15,
        height: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 10,
        marginBottom: 25,
    },
    modalFooter: {
        marginTop: 'auto',
    },
    applyBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 3,
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
