import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// importing user-build components
import { NavBar } from '../comman_component/navBar';
import { SideBar } from '../comman_component/sideBar';
import { VendorCard } from './sub_compo/VendorCard';

// database
import { Read_From_venderdata } from '../../../private/database/offline/oprations/read';


const VendorPage = ({
    getDB,
    getUserData,
    setUserData,
    setPageStack,
    getPageStack
}) => {

    const [getSideBar, setSideBar] = useState(false);

    // SAME STATES AS EVENT PAGE
    const [getSearchValue, setSearchValue] = useState('');
    const [vendorData, setVendorData] = useState([]);
    const [getFilteredEvent, setFilteredEvents] = useState([]);
    const [getFilter, setFilter] = useState('');


    // LOAD vendors from DB
    const loadVendors = async () => {

        const res = await Read_From_venderdata(getDB);

        if (res.STATUS === 200) {

            setVendorData(res.DATA);
            setFilteredEvents(res.DATA);

        } else {

            console.log("Error in fetching vendors");

        }
    }


    // LOAD ONCE
    useEffect(() => {
        loadVendors();
    }, []);



    // SEARCH AUTO FILTER (same as EventPage)
    useEffect(() => {

        if (!getSearchValue || getSearchValue.trim() === "") {

            setFilteredEvents(vendorData);

        } else {

            const filtered = vendorData.filter(vendor =>
                vendor.VENDORNAME
                    .toLowerCase()
                    .includes(getSearchValue.toLowerCase())
            );

            setFilteredEvents(filtered);

        }

    }, [getSearchValue, vendorData]);

    return (<>
        <SafeAreaView style={[{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }]}>
            <View style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[{ fontSize: 20, fontWeight: 'bold', color: '#597ef7ff' }]}>COMMING SOON...</Text>
            </View>
        </SafeAreaView>
    </>)


}

export { VendorPage };



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












// return (
//         <>
//             <SafeAreaView style={styles.container}>


//                 {/* NAVBAR */}
//                 <NavBar
//                     setPageStack={setPageStack}
//                     setSearchValue={setSearchValue}
//                     getSearchValue={getSearchValue}
//                     setSideBar={setSideBar}
//                     title={'Vendors'}
//                 />


//                 {/* SIDEBAR */}
//                 {getSideBar &&

//                     <SideBar
//                         setSideBar={setSideBar}
//                         getUserData={getUserData}
//                         getPageStack={getPageStack}
//                         setPageStack={setPageStack}
//                     />

//                 }



//                 <ScrollView>


//                     {/* FILTER ROW */}
//                     <View style={styles.filterRow}>

//                         <TouchableOpacity style={styles.filterBtn}>

//                             <MaterialCommunityIcons
//                                 name="filter-plus-outline"
//                                 size={24}
//                                 color="#686666ff"
//                             />

//                             <Text style={styles.filterText}>
//                                 filter /
//                             </Text>

//                         </TouchableOpacity>


//                         <View style={{ width: '50%' }}>

//                             <Text
//                                 style={{ color: '#686666ab' }}
//                                 numberOfLines={1}
//                             >

//                                 {(getFilter.length <= 0)
//                                     ? 'No filter'
//                                     : getFilter}

//                             </Text>

//                         </View>

//                     </View>



//                     {/* VENDOR CARDS */}
//                     <View style={styles.cardContainer}>


//                         {getFilteredEvent && getFilteredEvent.length > 0
//                             ? (

//                                 getFilteredEvent.map((vendor, index) => (

//                                     <VendorCard
//                                         getPageStack={getPageStack}
//                                         setPageStack={setPageStack}
//                                         key={vendor.Id || index}
//                                         DATA={vendor}
//                                         color={'#686666ff'}
//                                     />

//                                 ))

//                             )
//                             : (
//                                 <View>
//                                     <Text>No Vendor Found!</Text>
//                                 </View>
//                             )}


//                     </View>


//                 </ScrollView>



//             </SafeAreaView>
//         </>
//     )