// React component and screen logic for the app.
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, SafeAreaView } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Invite_User_By_Email } from "../../../../mailer/InviteRoute";
import { Read_From_evetndata_By_ID } from "../../../../private/database/offline/oprations/read";
import { decryptData } from "../../../../utils/Hash";
import { useTheme } from "../../../../context/ThemeContext";
import { NavBar } from "../../comman_component/navBar";

/**
 * Invite User.
 */
const Invite_User = ({ getDB, getPageStack, setPageStack }) => {
  const { colors: theme, isDarkMode } = useTheme();
  const [data, setData] = useState([]);
  const [getUnsendData, setUnSendData] = useState(false);
  const [getSendData, setSendData] = useState(false);
  const [showList, setShowList] = useState(true);
  const [getAllData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Send Mail.
   */
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

  /**
   * Pick File.
   */
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

  /**
   * Render Item.
   */
  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.cardIcon, { backgroundColor: isDarkMode ? theme.background : '#F1F5F9' }]}>
        <Ionicons name="person" size={20} color={theme.primary} />
      </View>
      <View style={styles.cardContent}>
        {Object.keys(item).map((key) => (
          <View key={key} style={styles.row}>
            <Text style={[styles.keyText, { color: theme.subtext }]}>{key}: </Text>
            <Text style={[styles.valueText, { color: theme.text }]}>{item[key]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <NavBar setPageStack={setPageStack} title={'Invite Users'} />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <MaterialCommunityIcons name="email-send-outline" size={60} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Send Invitations</Text>
          <Text style={[styles.subtitle, { color: theme.subtext }]}>Upload a CSV file with member details to send automated email invitations.</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity activeOpacity={0.8} style={styles.uploadBtn} onPress={pickFile}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text style={styles.buttonText}>Upload CSV</Text>
            </LinearGradient>
          </TouchableOpacity>

          {data.length > 0 && (
            <TouchableOpacity activeOpacity={0.8} style={styles.sendBtn} onPress={sendMail}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              >
                <Ionicons name="paper-plane-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Send {data.length} Invites</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loaderText, { color: theme.subtext }]}>Processing...</Text>
          </View>
        )}

        <View style={styles.listSection}>
          {getUnsendData && (
            <View style={styles.statusSection}>
              <View style={[styles.statusHeader, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={[styles.statusTitle, { color: '#B91C1C' }]}>Failed to Send</Text>
              </View>
              <FlatList
                data={getUnsendData}
                keyExtractor={(item, index) => `unsend-${index}`}
                renderItem={renderItem}
                nestedScrollEnabled
              />
            </View>
          )}

          {getSendData && (
            <View style={styles.statusSection}>
              <View style={[styles.statusHeader, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={[styles.statusTitle, { color: '#047857' }]}>Sent Successfully</Text>
              </View>
              <FlatList
                data={getSendData}
                keyExtractor={(item, index) => `send-${index}`}
                renderItem={renderItem}
                nestedScrollEnabled
              />
            </View>
          )}

          {showList && data.length > 0 && (
            <View style={styles.statusSection}>
              <View style={[styles.statusHeader, { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' }]}>
                <Ionicons name="list" size={20} color={theme.subtext} />
                <Text style={[styles.statusTitle, { color: theme.text }]}>Member Preview</Text>
              </View>
              <FlatList
                data={data}
                keyExtractor={(item, index) => `data-${index}`}
                renderItem={renderItem}
                nestedScrollEnabled
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export { Invite_User };

// Style definitions for the styles component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 15,
    gap: 8,
    elevation: 2,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
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
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '800',
  },
  listContainer: {
    paddingBottom: 20,
  },
  guestCard: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  guestIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  guestInfo: {
    flex: 1,
  },
  guestEmail: {
    fontSize: 15,
    fontWeight: '700',
  },
  guestStatus: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  sendBtn: {
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
  },
  sendGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  sendBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  actionSection: {
    gap: 12,
    marginBottom: 20,
  },
  uploadBtn: {
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  loaderContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loaderText: {
    marginTop: 10,
    fontWeight: '600',
  },
  statusSection: {
    marginBottom: 20,
    maxHeight: 400,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  keyText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  valueText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
