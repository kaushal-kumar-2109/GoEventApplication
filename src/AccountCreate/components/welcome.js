// React component and screen logic for the app.
import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-asset";
import { encryptData, decryptData } from "../../../utils/Hash";

// statically referenced assets for easier caching
const IMAGE_SOURCES = [
  require("../../../assets/w1.jpg"),
  require("../../../assets/w2.jpg"),
  require("../../../assets/w3.jpg"),
  require("../../../assets/w4.jpg"),
  require("../../../assets/w5.jpg"),
];

/**
 * Renders the welcome screen UI screen.
 */
const WelcomeScreen = ({ setPageStack }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // preload images into Expo asset cache
    async function cacheImages() {
      const cachePromises = IMAGE_SOURCES.map((src) => Asset.fromModule(src).downloadAsync());
      try {
        await Promise.all(cachePromises);
      } catch (e) {
        // ignore errors, images will still load later
        console.warn("Image caching failed", e);
      }
      setReady(true);
    }
    cacheImages();
  }, []);

  if (!ready) {
    // simple loader while images are being cached
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={require("../../../assets/icon.jpg")} style={styles.logo} />
            <Text style={styles.appName}>GoEvent</Text>
          </View>

          {/* Event Images Grid */}
          <View style={styles.imageGrid}>
            {IMAGE_SOURCES.map((src, idx) => (
              <Image key={idx} source={src} style={styles.image} resizeMode="cover" />
            ))}
          </View>

          {/* Title + Subtitle */}
          <Text style={styles.title}>See what's happening in your area</Text>
          <Text style={styles.subtitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
            dapibus.
          </Text>

          {/* Get Started Button */}
          <View style={[{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 40 }]}>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#003366", }]} onPress={() => { setPageStack(prevStack => [...prevStack, "login"]); }}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#90bfefff", }]} onPress={() => { setPageStack(prevStack => [...prevStack, "signup"]); }}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

export { WelcomeScreen };

// Style definitions for the styles component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 30,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
    margin: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#003366",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    padding: 14,
    width: 100,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  }
});
