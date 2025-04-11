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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  // Removed isSubmittingScore since we're not submitting on each question now.
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setHasAnswered(false);
    setIsCorrect(false);
    setScore(0);

    // Delay redirect slightly to ensure layout is mounted
    const timeout = setTimeout(() => {
      if (!params.quizData) {
        Alert.alert("Error", "No quiz data provided");
        router.replace("/quizSelection");
        return;
      }

      try {
        const parsedData = JSON.parse(params.quizData as string);

        if (!Array.isArray(parsedData) || !parsedData[0]?.question) {
          throw new Error("Invalid quiz format");
        }

        const shuffled = [...parsedData].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      } catch (error) {
        console.error("Quiz data error:", error);
        Alert.alert("Error", "Quiz data is invalid or corrupted.");
        router.replace("/quizSelection");
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [params.quizData, params.timeStamp]);

  const handleAnswerSelect = (answer: string) => {
    if (hasAnswered || !currentUser || !currentQuestion) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
    // Removed per-question score submission.
  };

  // Make handleNextQuestion asynchronous so we can await final score submission.
  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setHasAnswered(false);
      setIsCorrect(false);
    } else {
      // Final submission of the cumulative score.
      try {
        await saveUserScore(
          currentUser.uid,
          params.quizName as string,
          score,
          questions.length // Use total number of questions in this quiz.
        );
      } catch (error) {
        console.error("Failed to save final score:", error);
        Alert.alert("Error", "Failed to save your final score.");
      }
      Alert.alert("Quiz Complete", `Your final score is: ${score}`);
      router.replace("/quizSelection");
      // Reset state for next quiz if needed.
      setScore(0);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer("");
      setHasAnswered(false);
      setIsCorrect(false);
    }
  };

  const handleBackToCategories = () => {
    router.replace("/quizSelection");
  };

  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headerText}>
          {params.quizName}{" "}
          <FontAwesome name={params.quizIcon as any} size={24} />
        </Text>

        {/* Question */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Options */}
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerSelect(option)}
            style={[
              styles.answerButton,
              hasAnswered &&
                option === selectedAnswer && {
                  backgroundColor: isCorrect ? "green" : "red",
                },
              hasAnswered &&
                option === currentQuestion.correctAnswer && {
                  backgroundColor: "green",
                },
              // Disable button if user already answered or if user is not logged in
              (!currentUser || hasAnswered) && styles.disabledButton,
            ]}
            disabled={hasAnswered || !currentUser}
          >
            <Text
              style={[
                styles.answerButtonText,
                hasAnswered &&
                  (option === selectedAnswer ||
                    option === currentQuestion.correctAnswer) &&
                  styles.answerButtonTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Feedback and Navigation */}
        {hasAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {isCorrect ? "Correct! ✔" : "Incorrect! ❌"}
            </Text>
            <Text style={styles.scoreText}>Your Score: {score}</Text>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: params.quizColor as string },
              ]}
              onPress={handleNextQuestion}
            >
              <Text style={styles.navButtonText}>
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: params.quizColor as string },
              ]}
              onPress={handleBackToCategories}
            >
              <Text style={styles.navButtonText}>Back to Categories</Text>
            </TouchableOpacity>
          </View>
        )}

        {!currentUser && (
          <Text style={styles.authWarning}>
            You need to be signed in to save your scores{" "}
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
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
    width: "90%",
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
    justifyContent: "center",
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.6,
  },
  answerButtonText: {
    fontSize: 18,
  },
  answerButtonTextSelected: {
    color: "white",
    fontWeight: "bold",
  },
  feedbackContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  navButton: {
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 15,
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
    textAlign: "center",
    color: "red",
    marginTop: 20,
    fontSize: 16,
  },
  loginLink: {
    color: "blue",
    textDecorationLine: "underline",
    marginLeft: 10,
  },
  scoreText: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
});

export default QuestionAnswer;
