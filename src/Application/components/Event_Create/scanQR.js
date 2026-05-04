// React component and screen logic for the app.
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Dimensions, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Modal } from 'react-native';

import { InviteCard } from './invitationCard';
import { Read_All_Guests_By_EventID, Read_From_evetndata_By_ID } from '../../../../private/database/offline/oprations/read';
import { UPDATE_INVITE_OF_CUSTOMER, UPDATE_BOOKING_STATUS_OFFLINE } from '../../../../private/database/offline/oprations/update';
import { decryptData } from '../../../../utils/Hash';
import { useTheme } from '../../../../context/ThemeContext';
import { NavBar } from '../../comman_component/navBar';
import { Sync_Offline_Data_Changes, Load_Event_Invitation, Load_Bookings } from '../../../../private/sync/read_online';
import { CheckInternet } from '../../../../utils/checkNetwork';
import { SUP_BASE } from '../../../../private/database/online/connect';

const screenWidth = Dimensions.get('window').width;
const scannerSize = screenWidth * 0.8;

/**
 * QR Scanner.
 */
const QR_Scanner = ({ getDB, getPageStack, setPageStack }) => {
  const { colors: theme, isDarkMode } = useTheme();

  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [QrData, setQrData] = useState(null);
  const [allList, setAllList] = useState([]);
  const [temList, setTempList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [getEventData, setEventData] = useState();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation States
  const [showStatus, setShowStatus] = useState(false);
  const [statusType, setStatusType] = useState('success'); // 'success' or 'error'
  const animValue = useState(new Animated.Value(0))[0];

  /**
 * Sync_All_User_Data_On_Login:
 * This orchestrator function is called immediately after a user logs in 
 * or signs up. It pulls all historical data (Events, Invitations, Bookings, 
 * Notifications) from the cloud to ensure the offline-first app is ready.
 */
const Sync_All_User_Data_On_Login = async (DB, USER_ID) => {
    setStatusType(type);
    setShowStatus(true);
    Animated.spring(animValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    setTimeout(() => {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowStatus(false));
    }, 2000);
  };

  /**
 * Load_Event_Invitation:
 * Fetches all invitations sent by this host from Supabase and writes them 
 * to the local SQLite database.
 */
const Load_Event_Invitation = async (DB, USER_ID) => {
    setSearchText(text);
    if (text.trim() === "") {
      setTempList(allList);
      return;
    }
    const filtered = allList.filter(item =>
      item.MEMBER_EMAIL.toLowerCase().includes(text.toLowerCase())
    );
    setTempList(filtered);
  };

  /**
   * isScannedCheck: 
   * This is the core logic for validating a scanned QR code.
   * It performs a hybrid check:
   * 1. First, it tries to fetch the most recent status directly from Supabase (Online) 
   *    if internet is available. This ensures real-time security across multiple devices.
   * 2. If offline, it uses the local SQLite data.
   * 3. If the ticket is 'PENDING', it marks it as 'ACCEPTED' both locally and logs it 
   *    for background synchronization/**
 * Write_Offline_Bookings:
 * Writes booking data to SQLite. Uses 'INSERT OR REPLACE' to handle 
 * status updates and prevent duplicate key errors.
 */
const Write_Offline_Bookings = async (db, data) => {
    setIsProcessing(true);
    let found = false;
    for (let i = 0; i < allList.length; i++) {
      if (allList[i].MEMBER_EMAIL === data.email && allList[i].EVENT_ID === data.eventid) {
        found = true;
        
        // 1. Check current status online if internet is available for maximum security
        const isOnline = await CheckInternet();
        if (isOnline) {
          console.log("Checking status online...");
          try {
            let onlineStatus = null;
            if (allList[i].TYPE === 'INVITATION') {
              const { data: invData } = await SUP_BASE
                .from("EVENT_INVITATION")
                .select("STATUS")
                .eq("INVITATION_ID", allList[i].INVITATION_ID)
                .single();
              if (invData) onlineStatus = invData.STATUS;
            } else {
              const { data: bookData } = await SUP_BASE
                .from("BOOKINGS")
                .select("STATUS")
                .eq("BOOKING_ID", allList[i].BOOKING_ID)
                .single();
              if (bookData) onlineStatus = bookData.STATUS;
            }
            
            if (onlineStatus) {
              console.log(`Online status for ${data.email}: ${onlineStatus}`);
              allList[i].STATUS = onlineStatus; // Sync local list item with online truth
            }
          } catch (onlineErr) {
            console.log("Failed to fetch online status, falling back to local data:", onlineErr);
          }
        }

        // 2. Evaluate status
        if (allList[i].STATUS === 'PENDING') {
          try {
            let res;
            if (allList[i].TYPE === 'INVITATION') {
              res = await UPDATE_INVITE_OF_CUSTOMER(
                getDB,
                getEventData?.USER_ID || "SYSTEM",
                data.email,
                data.eventid,
                'ACCEPTED',
                allList[i].INVITATION_ID
              );
            } else if (allList[i].TYPE === 'BOOKING') {
              res = await UPDATE_BOOKING_STATUS_OFFLINE(
                getDB,
                getEventData?.USER_ID || "SYSTEM",
                allList[i].BOOKING_ID,
                'ACCEPTED'
              );
            }

            if (res.STATUS == 200) {
              triggerStatusAnimation('success');
              allList[i].STATUS = 'ACCEPTED';
              setTempList([...allList]);
              
              // Immediately sync the change to the online database
              Sync_Offline_Data_Changes(getDB).catch(e => console.log("Immediate sync failed:", e));
            } else {
              triggerStatusAnimation('error');
            }
          } catch (err) {
            console.log("Failed to update status in DB. error: ", err);
            triggerStatusAnimation('error');
          }
        } else {
          triggerStatusAnimation('error');
          alert("Entry Already Granted ❌");
        }
        break;
      }
    }
    if (!found) {
      triggerStatusAnimation('error');
      alert("Invalid QR Code ❌ No Match Found");
    }
    setIsProcessing(false);
  };

  /**
   * Get List.
   */
  const getList = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    let eventID = getPageStack[getPageStack.length - 1].split('.')[1];
    let List = await Read_All_Guests_By_EventID(getDB, eventID);
    if (List.STATUS == 200) {
      let eventData = await Read_From_evetndata_By_ID(getDB, eventID);
      if (eventData.STATUS == 200) {
        setEventData(eventData.DATA[0]);
      }
      setAllList(List.DATA);
      setTempList(List.DATA);
    }
    if (showLoader) setLoading(false);
  };

  /**
   * Refresh Data from Online.
   */
  /**
   * refreshData:
   * This function pulls the latest Invitation and Booking data from Supabase 
   * into the local SQLite database. It is called periodically while the scanner 
   * is open to ensure that scans performed on other devices are reflected here.
   */
  const refreshData = async () => {
    if (!getEventData?.USER_ID) return;
    
    // Pull latest data from online to handle other devices scanning
    try {
      await Load_Event_Invitation(getDB, getEventData.USER_ID);
      await Load_Bookings(getDB, getEventData.USER_ID);
      // After pulling, update the local list
      await getList(false);
    } catch (err) {
      console.log("Auto-refresh failed:", err);
    }
  };

  useEffect(() => {
    getList();
    
    // Set up periodic refresh every 10 seconds to catch scans from other devices
    const interval = setInterval(() => {
      refreshData();
    }, 10000);

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission(status === 'granted');
    })();

    return () => clearInterval(interval);
  }, [getEventData?.USER_ID]); // Re-run if user ID becomes available to start refreshing

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <NavBar setPageStack={setPageStack} title={'Check-in Scanner'} />
      
      {/* Animation Overlay */}
      <Modal transparent visible={showStatus} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.statusContent,
            { transform: [{ scale: animValue }], backgroundColor: theme.card }
          ]}>
            <View style={[styles.statusIconCircle, { backgroundColor: statusType === 'success' ? '#10B981' : '#EF4444' }]}>
              <Ionicons 
                name={statusType === 'success' ? "checkmark-sharp" : "close-sharp"} 
                size={80} 
                color="white" 
              />
            </View>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {statusType === 'success' ? "ACCESS GRANTED" : "ACCESS DENIED"}
            </Text>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Processing Loader Overlay */}
      <Modal transparent visible={isProcessing}>
        <View style={styles.loaderOverlay}>
          <View style={[styles.loaderContent, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loaderText, { color: theme.text }]}>Verifying Guest...</Text>
          </View>
        </View>
      </Modal>
      
      <View style={styles.content}>
        {/* Header Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{allList.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>
              {allList.filter(i => i.STATUS === 'ACCEPTED').length}
            </Text>
            <Text style={styles.statLabel}>Checked-in</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
              {allList.filter(i => i.STATUS === 'PENDING').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.subtext} style={styles.searchIcon} />
          <TextInput
            placeholder="Search guest by email..."
            value={searchText}
            onChangeText={handleSearch}
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.subtext}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
          
          {/* Camera Section */}
          <View style={styles.scannerSection}>
            {!isCameraOpen ? (
              <TouchableOpacity activeOpacity={0.8} style={styles.scanTrigger} onPress={() => setIsCameraOpen(true)}>
                <LinearGradient
                  colors={[theme.primary, isDarkMode ? '#1E3A8A' : '#4F46E5']}
                  style={styles.scanGradient}
                >
                  <MaterialCommunityIcons name="qrcode-scan" size={40} color="white" />
                  <Text style={styles.scanBtnText}>Open QR Scanner</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.cameraWrapper}>
                <CameraView
                  facing="back"
                  style={styles.camera}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={({ data }) => {
                    if (scanned) return;
                    setScanned(true);
                    setIsCameraOpen(false);
                    try {
                      const parsed = JSON.parse(data);
                      setQrData(parsed);
                      isScannedCheck(parsed);
                    } catch {
                      alert("Invalid QR Format ❌");
                    }
                    setTimeout(() => setScanned(false), 2000);
                  }}
                />
                <View style={[styles.scannerOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                   <View style={[styles.scannerFrame, { borderColor: theme.primary }]} />
                </View>
                <TouchableOpacity style={styles.closeCamera} onPress={() => setIsCameraOpen(false)}>
                  <Ionicons name="close-circle" size={50} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Scanned Result Card */}
          {QrData && (
            <View style={[styles.resultCard, { backgroundColor: theme.card, borderLeftColor: theme.primary }]}>
              <View style={styles.resultHeader}>
                <Ionicons name="id-card-outline" size={20} color={theme.primary} />
                <Text style={[styles.resultTitle, { color: theme.text }]}>Last Scanned Guest</Text>
              </View>
              <View style={styles.resultBody}>
                <Text style={[styles.resultLabel, { color: theme.subtext }]}>Name: <Text style={[styles.resultValue, { color: theme.text }]}>{QrData.name}</Text></Text>
                <Text style={[styles.resultLabel, { color: theme.subtext }]}>Email: <Text style={[styles.resultValue, { color: theme.text }]}>{QrData.email}</Text></Text>
              </View>
            </View>
          )}

          {/* Guest List */}
          <View style={styles.listSection}>
            <View style={styles.listHeader}>
              <Text style={[styles.listTitle, { color: theme.text }]}>Guest List</Text>
              <Text style={[styles.listCount, { color: theme.primary }]}>{temList.length} Guests</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
            ) : temList.length > 0 ? (
              temList.map((data, index) => (
                <InviteCard key={index} DATA={data} EVENT={getEventData} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="person-off" size={50} color={theme.subtext} />
                <Text style={[styles.emptyText, { color: theme.subtext }]}>No guests found matching your search.</Text>
              </View>
            )}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export { QR_Scanner };

// Style definitions for the styles component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  statBox: {
    padding: 15,
    borderRadius: 16,
    width: '31%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  scannerSection: {
    width: '100%',
    marginBottom: 20,
  },
  scanTrigger: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  scanGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  cameraWrapper: {
    width: '100%',
    height: scannerSize,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scannerFrame: {
    width: scannerSize * 0.7,
    height: scannerSize * 0.7,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  closeCamera: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  resultCard: {
    padding: 15,
    borderRadius: 16,
    borderLeftWidth: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultBody: {
    gap: 4,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultValue: {
    fontWeight: '700',
  },
  listSection: {
    marginTop: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  listCount: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContent: {
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  statusIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContent: {
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    gap: 15,
  },
  loaderText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
