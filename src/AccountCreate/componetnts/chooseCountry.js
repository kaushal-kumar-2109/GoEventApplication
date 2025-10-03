// importing pri-build components 
import React, { useState } from "react";
import { View,Text,FlatList,TouchableOpacity,TextInput,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// importing user build components
import { USERSETUPDATA } from "../../../utils/global";

const countries = ["Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Italy",];
const ChooseCountry = ({setPageStack}) => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState('India');

  const filteredCountries = countries.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => setSelectedCountry(item)}
    >
      <Text
        style={[
          styles.countryText,
          item === selectedCountry && styles.selectedText,
        ]}
      >
        {item}
      </Text>
      {item === selectedCountry && <Text style={styles.check}>✔</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Country</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Country"
        value={search}
        onChangeText={setSearch}
      />

      {/* Country List */}
      <FlatList
        data={filteredCountries}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />

      {/* Next Button */}
      <TouchableOpacity style={styles.nextButton} 
        onPress={()=>{
          USERSETUPDATA['Country']=selectedCountry;
          setPageStack(prevStack => [...prevStack, "welcome"]);
        }}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export {ChooseCountry};

const styles = StyleSheet.create({
  container: {
    width:'100%',
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  countryText: {
    fontSize: 16,
    color: "#333",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#003366",
  },
  check: {
    color: "#003366",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#003366",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 12,
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
