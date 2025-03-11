import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const questionAnswer = () => {
  const [question, setQuestion] = useState({
    question: "What is the capital of Canada?",
    options: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
    correctAnswer: "Ottawa",
  });

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const correctAnswer = selectedAnswer === question.correctAnswer;

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {/* Header */}
        <Text style={styles.headerText}>
          Geography <FontAwesome name="globe" size={24} color="#0077BE" />
        </Text>
        {/* Question */}
        <Text style={styles.questionText}>{question.question}</Text>
        {/* Options */}
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelect(option)}
            style={[
              styles.answerButton,
              selectedAnswer === option && {
                backgroundColor: correctAnswer ? "green" : "red",
              },
            ]}
          >
            <Text style={styles.answerButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {/* Feedback */}
        {selectedAnswer !== "" && (
          <Text style={styles.feedbackText}>
            {correctAnswer ? "Correct! ✔" : "Incorrect! ❌"}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default questionAnswer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30,
    textAlign: "center",
  },
  questionText: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 1,
    alignItems: "center",
  },
  answerButtonText: {
    fontSize: 18,
  },
  feedbackText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
