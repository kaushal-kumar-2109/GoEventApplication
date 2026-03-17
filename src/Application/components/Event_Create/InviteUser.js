import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Invite_User_By_Email } from "../../../../mailer/InviteRoute";
import { Read_From_evetndata_By_ID } from "../../../../private/database/offline/oprations/read";
// import { GETEVENTSBYID } from "../../Database/Offline/oprations/Read";
import { decryptData } from "../../../../utils/Hash";

const Invite_User = ({ getDB, getPageStack, setPageStack }) => {
  const [data, setData] = useState([]);
  const [getUnsendData, setUnSendData] = useState(false);
  const [getSendData, setSendData] = useState(false);
  const [showList, setShowList] = useState(true);
  const [getAllData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    let result;
    try {
      setLoading(true);
      let eventData = await Read_From_evetndata_By_ID(getDB, getPageStack[getPageStack.length - 1].split('.')[1]);

      if (eventData.STATUS == 200) {
        const eve = {
          EVENT_ID: eventData.DATA[0].EVENT_ID,
          EVENT_NAME: decryptData(eventData.DATA[0].EVENT_NAME),
          EVENT_DATE: decryptData(eventData.DATA[0].EVENT_DATE),
          EVENT_TIME: decryptData(eventData.DATA[0].EVENT_TIME),
          EVENT_LOCATION: decryptData(eventData.DATA[0].EVENT_LOCATION),
          EVENT_ABOUT: decryptData(eventData.DATA[0].EVENT_ABOUT),
          EVENT_BANNER: decryptData(eventData.DATA[0].EVENT_BANNER),
          EVENT_TYPE: decryptData(eventData.DATA[0].EVENT_TYPE),
          USER_ID: eventData.DATA[0].USER_ID,
          EVENT_CODE: eventData.DATA[0].EVENT_CODE
        }

        result = await Invite_User_By_Email(getDB, getAllData, eve);
      } else {
        Alert.alert("Error", "Failed to fetch event data for sending invitations");
        setLoading(false);
        return;
      }

      if (result.STATUS) {
        Alert.alert("Success", "Invitations Sent Successfully ✅");
        setUnSendData(result.DATA.UNSEND);
        setSendData(result.DATA.SEND);
        setShowList(false);
      }
      else {
        Alert.alert("Error", "Failed to send invitations");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to send invitations. error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const pickFile = async () => {
    try {
      setLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const file = result.assets[0];

      if (!file.name.toLowerCase().endsWith(".csv")) {
        setLoading(false);
        Alert.alert("Invalid File", "Please select a CSV file.");
        return;
      }

      const fileInstance = new File(file.uri);
      const fileData = await fileInstance.text();

      if (!fileData) {
        setLoading(false);
        Alert.alert("Error", "File is empty.");
        return;
      }

      const rows = fileData
        .split("\n")
        .map(row => row.trim())
        .filter(row => row !== "");

      if (rows.length < 2) {
        setLoading(false);
        Alert.alert("Error", "CSV file has no data.");
        return;
      }

      const headers = rows[0].split(",");

      const jsonData = rows.slice(1).map(row => {
        const values = row.split(",");
        let obj = {};

        headers.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim() || "";
        });

        return obj;
      });

      setData(jsonData);
      setAllData(jsonData);

      Alert.alert("Success", "CSV Imported Successfully ✅");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while reading file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Upload CSV File</Text>
      </TouchableOpacity>

      {data.length > 0 && (
        <TouchableOpacity
          style={[styles.button, { marginVertical: 10 }]}
          onPress={sendMail}
        >
          <Text style={styles.buttonText}>Send Invitation</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {getUnsendData &&
        <>
          <Text style={[{ textAlign: "center", width: "100%", color: "red", marginTop: 10 }]}>=====  Invitation not send !  =====</Text>
          <FlatList
            data={getUnsendData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {Object.keys(item).map((key) => (
                  <Text key={key} style={[styles.text, { color: 'red' }]}>
                    {key}: {item[key]}
                  </Text>
                ))}
              </View>
            )}
          />
          <Text style={[{ textAlign: "center", width: "100%", color: "red", marginBottom: 10 }]}>===== ================  =====</Text>
        </>
      }

      {getSendData &&
        <>
          <Text style={[{ textAlign: "center", width: "100%", color: "green", marginTop: 10 }]}>=====  Invitation send successfully !  =====</Text>
          <FlatList
            data={getSendData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {Object.keys(item).map((key) => (
                  <Text key={key} style={[styles.text, { color: 'green' }]}>
                    {key}: {item[key]}
                  </Text>
                ))}
              </View>
            )}
          />
          <Text style={[{ textAlign: "center", width: "100%", color: "red", marginBottom: 10 }]}>===== ================  =====</Text>
        </>
      }

      {showList &&
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {Object.keys(item).map((key) => (
                <Text key={key} style={styles.text}>
                  {key}: {item[key]}
                </Text>
              ))}
            </View>
          )}
        />
      }
    </View>
  );
};

export { Invite_User };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
  },
});
