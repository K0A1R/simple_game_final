import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";


const quizTypes = [
  { id: "1", name: "General Knowledge", icon: "book", color: "#00A8E8" },
  { id: "2", name: "Science", icon: "flask", color: "#8A2BE2" },
  { id: "3", name: "History", icon: "calendar-o", color: "#FF4500" },
  { id: "4", name: "Entertainment", icon: "music", color: "#FF007F" },
  { id: "5", name: "Sports", icon: "futbol-o", color: "#FFD700" },
  { id: "6", name: "Geography", icon: "globe", color: "#39FF14" },
];

const QuizSelection = () => {
  

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Quiz Type</Text>
      <FlatList
        data={quizTypes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.button, { backgroundColor: item.color}]} 
          onPress={() => router.push( '/questionAnswer')}>
            <Text style={styles.buttonText}>
              {item.name}{"  "}
              <FontAwesome name={item.icon as keyof typeof FontAwesome.glyphMap} size={20} color="#fff" />
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

export default QuizSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },
  title:{
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 30,
  },
  listContainer: {
    alignItems: "center",
  },
  button: {
    padding: 15,
    marginVertical: 15,
    width: 300,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
});
