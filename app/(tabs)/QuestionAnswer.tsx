import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { saveUserScore } from "../scoresServices";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const QuestionAnswer = () => {
  const params = useLocalSearchParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userId] = useState("user1");

  useEffect(() => {
    setQuestion(null);
    setSelectedAnswer("");
    setHasAnswered(false);
    setIsCorrect(false);

    if (params.quizData) {
      try {
        const parsedData = JSON.parse(params.quizData as string);
        setQuestion(parsedData);
      } catch (error) {
        console.error("Error parsing quiz data:", error);
      }
    }
  }, [params.quizData]);

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered) return;

    setSelectedAnswer(answer);
    const correct = answer === question?.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    try {
      await saveUserScore(
          userId,
          params.quizName as string,
          correct ? 1 : 0,
          1
      );
    } catch (error) {
      console.error("Failed to save score:", error);
    }
  };

  const handleBackToCategories = () => {

    setSelectedAnswer("");
    setHasAnswered(false);
    setIsCorrect(false);
    router.navigate('/quizSelection');
  };

  if (!question) {
    return (
        <SafeAreaView style={styles.container}>
          <Text>Loading question...</Text>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View>
          {/* Header */}
          <Text style={styles.headerText}>
            {params.quizName} <FontAwesome name={params.quizIcon as any} size={24}/>
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
                    hasAnswered && option === selectedAnswer && {
                      backgroundColor: isCorrect ? "green" : "red",
                    },
                    hasAnswered && option === question.correctAnswer && {
                      backgroundColor: "green",
                    },
                  ]}
                  disabled={hasAnswered}
              >
                <Text style={styles.answerButtonText}>{option}</Text>
              </TouchableOpacity>
          ))}

          {/* Feedback */}
          {hasAnswered && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  {isCorrect ? "Correct! ✔" : "Incorrect! ❌"}
                </Text>
                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: params.quizColor as string }]}
                    onPress={handleBackToCategories}
                >
                  <Text style={styles.navButtonText}>Back to Categories</Text>
                </TouchableOpacity>
              </View>
          )}
        </View>
      </SafeAreaView>
  );
};
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
    padding: 15,
    margin: 10,
    borderRadius: 10,
    borderColor: "#000",
    borderWidth: 1,
    alignItems: "center",
  },
  answerButtonText: {
    fontSize: 18,
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  navButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200,
    alignItems: "center",
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuestionAnswer;