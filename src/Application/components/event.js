import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    const [getFilter, setFilter] = useState('');

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


    // ✅ Automatic search when typing
    useEffect(() => {

        if (!getSearchValue || getSearchValue.trim() === "") {

            setFilteredEvents(getEvents);

        } else {

            const filtered = getEvents.filter(event =>
                event.EVENT_NAME.toLowerCase().includes(getSearchValue.toLowerCase())
            );

            setFilteredEvents(filtered);
        }

    }, [getSearchValue, getEvents]);


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

                <ScrollView>

                    {/* Filter UI */}
                    <View style={styles.filterRow}>

                        <TouchableOpacity style={styles.filterBtn}>
                            <MaterialCommunityIcons
                                name="filter-plus-outline"
                                size={24}
                                color="#686666ff"
                            />

                            <Text style={styles.filterText}>
                                filter /
                            </Text>

                        </TouchableOpacity>

                        <View style={{ width: '50%' }}>

                            <Text
                                style={{ color: '#686666ab' }}
                                numberOfLines={1}
                            >
                                {getFilter.length <= 0 ? 'No filter' : getFilter}
                            </Text>

                        </View>

                    </View>


                    {/* Event Cards */}
                    <View style={styles.cardContainer}>

                        {getFilteredEvent && getFilteredEvent.length > 0
                            ? (
                                getFilteredEvent.map((event, index) => (
                                    <EventCard
                                        getPageStack={getPageStack}
                                        setPageStack={setPageStack}
                                        key={event.ID || index}
                                        DATA={event}
                                        color={'#686666ff'}
                                    />
                                ))
                            )
                            : (
                                <View>
                                    <Text>No Event Found!</Text>
                                </View>
                            )}

                    </View>

                </ScrollView>

            </SafeAreaView>
        </>
    )
}

export { EventPage };


const styles = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
    },

    filterRow: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },

    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    filterText: {
        marginHorizontal: 10,
        width: 60,
        fontSize: 20,
        color: '#686666ff'
    },

    cardContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    }

});
