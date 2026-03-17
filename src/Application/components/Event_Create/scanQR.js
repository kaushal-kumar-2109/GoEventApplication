import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput
} from 'react-native';

import { Camera, CameraView } from 'expo-camera';
import { InviteCard } from './invitationCard';

import { Read_From_InvitationList_By_EventID } from '../../../../private/database/offline/oprations/read';
import { Read_From_evetndata_By_ID } from '../../../../private/database/offline/oprations/read';
import { UPDATE_INVITE_OF_CUSTOMER } from '../../../../private/database/offline/oprations/update';
import { decryptData } from '../../../../utils/Hash';

const screenWidth = Dimensions.get('window').width;
const scannerSize = screenWidth * 0.85;

const QR_Scanner = ({ getDB, getPageStack, setPageStack }) => {

  const [permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const [QrData, setQrData] = useState(null);

  const [allList, setAllList] = useState([]);
  const [temList, setTempList] = useState([]);

  const [searchText, setSearchText] = useState("");

  const [getEventData, setEventData] = useState();

  // ✅ SEARCH FUNCTION
  const handleSearch = (text) => {

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


  // ✅ Check scanned QR
  const isScannedCheck = async (data) => {

    console.log("Scanned QR Data: ", data);

    let found = false;

    for (let i = 0; i < allList.length; i++) {

      if (
        allList[i].MEMBER_EMAIL === data.email &&
        allList[i].EVENT_ID === data.eventid
      ) {

        found = true;

        if (allList[i].STATUS === 'PENDING') {

          try {

            let res = await UPDATE_INVITE_OF_CUSTOMER(
              getDB,
              getEventData?.USER_ID || "SYSTEM",
              data.email,
              data.eventid,
              'ACCEPTED',
              allList[i].INVITATION_ID
            );

            if (res.STATUS == 200) {
              console.log("Status Updated in DB");
              setTempList([...allList]);
              alert("Entry Granted 🥳");
              allList[i].STATUS = 'ACCEPTED';
            }
            else {
              alert("Error in Updating data...");
            }

          } catch (err) {

            console.log("Failed to update status in DB. error: ", err);

          }

          setTempList([...allList]);

        }
        else {

          alert("Entry Already Granted ❌");

        }

      }
    }

    if (!found) {

      alert("Invalid QR Code ❌ No Match Found");

    }

  };


  // ✅ Get invitation list
  const getList = async () => {

    let eventID = getPageStack[getPageStack.length - 1].split('.')[1];

    let List = await Read_From_InvitationList_By_EventID(getDB, eventID);

    if (List.STATUS == 200) {

      let eventData = await Read_From_evetndata_By_ID(getDB, eventID);

      if (eventData.STATUS == 200) {

        setEventData(eventData.DATA[0]);

      }

      setAllList(List.DATA);
      setTempList(List.DATA);

    }

  };


  useEffect(() => {

    getList();

    (async () => {

      const { status } = await Camera.requestCameraPermissionsAsync();

      setPermission(status === 'granted');

    })();

  }, []);


  return (

    <View style={styles.container}>

      <ScrollView>

        {/* SEARCH BAR */}
        <View style={{ width: '100%', marginTop: 20 }}>

          <TextInput
            placeholder="Search by email..."
            value={searchText}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />

        </View>


        {/* CAMERA PERMISSION */}
        {!permission && (

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {

              const { status } = await Camera.requestCameraPermissionsAsync();

              setPermission(status === 'granted');

            }}
          >

            <Text style={{ color: 'white' }}>
              Request Camera Permission
            </Text>

          </TouchableOpacity>

        )}



        {/* SCAN BUTTON */}
        {permission && !isCameraOpen && (

          <TouchableOpacity
            style={styles.button}
            onPress={() => {

              setScanned(false);
              setIsCameraOpen(true);

            }}
          >

            <Text style={{ color: 'white' }}>
              Scan QR
            </Text>

          </TouchableOpacity>

        )}



        {/* CAMERA VIEW */}
        {permission && isCameraOpen && (

          <View style={styles.cameraContainer}>

            <CameraView
              facing="back"
              style={styles.camera}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}

              onBarcodeScanned={({ data }) => {

                if (scanned) return;

                setScanned(true);

                setIsCameraOpen(false);

                try {

                  const parsed = JSON.parse(data);

                  setQrData(parsed);

                  isScannedCheck(parsed);

                }
                catch {

                  alert("Invalid QR Format ❌");

                }

              }}

            />

            <TouchableOpacity
              style={[styles.button, { marginTop: 10 }]}
              onPress={() => setIsCameraOpen(false)}
            >

              <Text style={{ color: 'white' }}>
                Cancel
              </Text>

            </TouchableOpacity>

          </View>

        )}

        {/* SCANNED DATA */}
        {QrData && (

          <View style={styles.scanResult}>

            <Text style={styles.scanTitle}>
              Scanner Code Data
            </Text>

            <View style={styles.scanBox}>

              <Text style={{ color: 'blue' }}>
                Name : {QrData.name}
              </Text>

              <Text style={{ color: 'blue' }}>
                Email : {QrData.email}
              </Text>

            </View>

          </View>

        )}



        {/* LIST */}
        {temList.length > 0 && (

          <View style={styles.listContainer}>

            <Text style={styles.listTitle}>
              The List
            </Text>

            <ScrollView style={{ width: '100%' }}>

              {temList.map((data, index) => (

                <InviteCard
                  key={index}
                  DATA={data}
                  EVENT={getEventData}
                />

              ))}

            </ScrollView>

          </View>

        )}


      </ScrollView>

    </View>

  );

};

export { QR_Scanner };



const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  cameraContainer: {
    alignItems: 'center',
  },

  camera: {
    width: scannerSize,
    height: scannerSize,
    borderRadius: 15,
    marginVertical: 10
  },

  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6d79e8',
    alignItems: 'center',
    borderRadius: 4,
    width: '100%'
  },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff'
  },

  scanResult: {
    marginVertical: 20,
    alignItems: 'center'
  },

  scanTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },

  scanBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    width: '90%',
    marginTop: 10
  },

  listContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center'
  },

  listTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }

});
