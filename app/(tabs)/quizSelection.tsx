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
  {
    id: "1",
    name: "General Knowledge",
    icon: "book",
    color: "#00A8E8",
    dataFile: require("../../generalKnowledge.json"),
  },
  {
    id: "2",
    name: "Science",
    icon: "flask",
    color: "#8A2BE2",
    dataFile: require("../../science.json"),
  },
  {
    id: "3",
    name: "History",
    icon: "calendar-o",
    color: "#FF4500",
    dataFile: require("../../history.json"),
  },
  {
    id: "4",
    name: "Entertainment",
    icon: "music",
    color: "#FF007F",
    dataFile: require("../../entertainment.json"),
  },
  {
    id: "5",
    name: "Sports",
    icon: "futbol-o",
    color: "#FFD700",
    dataFile: require("../../sports.json"),
  },
  {
    id: "6",
    name: "Geography",
    icon: "globe",
    color: "#39FF14",
    dataFile: require("../../geography.json"),
  },
];

const QuizSelection = () => {
  const handleQuizSelect = (quizType: (typeof quizTypes)[0]) => {
    router.push({
      pathname: "/QuestionAnswer",
      params: {
        quizName: quizType.name,
        quizIcon: quizType.icon,
        quizColor: quizType.color,
        quizData: JSON.stringify(quizType.dataFile),
        timeStamp: Date.now(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Quiz Type</Text>
      <FlatList
        data={quizTypes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: item.color }]}
            onPress={() => handleQuizSelect(item)}
          >
            <Text style={styles.buttonText}>
              {item.name}
              {"  "}
              <FontAwesome
                name={item.icon as keyof typeof FontAwesome.glyphMap}
                size={20}
                color="#fff"
              />
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
  },
  title: {
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

export default QuizSelection;
