import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { saveUserScore } from "../scoresServices";
import { useAuth } from "../AuthContext";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const QuestionAnswer = () => {
  const params = useLocalSearchParams();
  const { currentUser } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  useEffect(() => {
    // Reset all states when quiz data changes
    setQuestion(null);
    setSelectedAnswer("");
    setHasAnswered(false);
    setIsCorrect(false);
    setIsSubmittingScore(false);

    if (params.quizData) {
      try {
        const parsedData = JSON.parse(params.quizData as string);
        setQuestion(parsedData);
      } catch (error) {
        console.error("Error parsing quiz data:", error);
        Alert.alert("Error", "Failed to load quiz question");
      }
    }
  }, [params.quizData]);

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered || !currentUser) return;

    setSelectedAnswer(answer);
    const correct = answer === question?.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);
    setIsSubmittingScore(true);

    try {
      await saveUserScore(
          currentUser.uid,
          params.quizName as string,
          correct ? 1 : 0,
          1

      );
    } catch (error) {
      console.error("Failed to save score:", error);
      Alert.alert("Error", "Failed to save your score");
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleBackToCategories = () => {
    router.navigate('/quizSelection');
  };

  if (!question) {
    return (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading question...</Text>
        </SafeAreaView>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
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
                    (isSubmittingScore || !currentUser) && styles.disabledButton,
                  ]}
                  disabled={hasAnswered || isSubmittingScore || !currentUser}
              >
                {isSubmittingScore && option === selectedAnswer ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={[
                      styles.answerButtonText,
                      (hasAnswered && (option === selectedAnswer || option === question.correctAnswer)) &&
                      styles.answerButtonTextSelected
                    ]}>
                      {option}
                    </Text>
                )}
              </TouchableOpacity>
          ))}

          {/* Feedback and Navigation */}
          {hasAnswered && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  {isCorrect ? "Correct! ✔" : "Incorrect! ❌"}
                </Text>
                <TouchableOpacity
                    style={[styles.navButton, { backgroundColor: params.quizColor as string }]}
                    onPress={handleBackToCategories}
                    disabled={isSubmittingScore}
                >
                  <Text style={styles.navButtonText}>Back to Categories</Text>
                </TouchableOpacity>
              </View>
          )}

          {!currentUser && (
              <Text style={styles.authWarning}>
                You need to be signed in to save your scores
              </Text>
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
  content: {
    width: '90%',
    maxWidth: 400,
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
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.6,
  },
  answerButtonText: {
    fontSize: 18,
  },
  answerButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
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
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  authWarning: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});

export default QuestionAnswer;