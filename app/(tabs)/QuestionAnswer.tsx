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
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex(0); // Reset question index
    setSelectedAnswer(""); // Clear selected answer
    setHasAnswered(false); // Reset answered state
    setIsCorrect(false); // Reset correctness state
    setIsSubmittingScore(false); // Reset submitting state
    setScore(0); // Reset score

    // Check if quizData is passed in params
    // If not, navigate back to quiz selection
    if (!params.quizData) {
      Alert.alert("Error", "No quiz data provided");
      router.navigate("/quizSelection");
    }

    if (params.quizData) {
      try {
        const quizData = JSON.parse(params.quizData as string);

        const shuffledQuestions = [...quizData].sort(() => Math.random() - 0.5); // Shuffle the questions
        setQuestions(shuffledQuestions); // Set all shuffled questions

        setCurrentQuestionIndex(0); // Reset question index
      } catch (error) {
        console.error("Error parsing quiz data:", error);
        Alert.alert("Error", "Failed to load quiz question");
      }
    }
  }, [params.quizData, params.timeStamp]);

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered || !currentUser) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);

    {
      /* Update score */
    }
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
    setIsSubmittingScore(true);

    try {
      await saveUserScore(
        currentUser.uid,
        params.quizName as string,
        correct ? 1 : 0,
        questions[currentQuestionIndex].options.length || 0
      );
    } catch (error) {
      console.error("Failed to save score:", error);
      Alert.alert("Error", "Failed to save your score");
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setHasAnswered(false);
      setSelectedAnswer("");
      setIsCorrect(false);
    } else {
      Alert.alert("Quiz Complete", "Your final score is: " + score);
      router.navigate("/quizSelection");
      setScore(0); // Reset score for next quiz
      setQuestions([]); // Clear questions for next quiz
      setCurrentQuestionIndex(0); // Reset question index for next quiz
      setSelectedAnswer(""); // Clear selected answer for next quiz
      setHasAnswered(false); // Reset answered state for next quiz
      setIsCorrect(false); // Reset correctness state for next quiz
      setIsSubmittingScore(false); // Reset submitting state for next quiz
    }
  };

  const handleBackToCategories = () => {
    router.navigate("/quizSelection");
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
              (isSubmittingScore || !currentUser) && styles.disabledButton,
            ]}
            disabled={hasAnswered || isSubmittingScore || !currentUser}
          >
            {isSubmittingScore && option === selectedAnswer ? (
              <ActivityIndicator color="white" />
            ) : (
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
            )}
          </TouchableOpacity>
        ))}

        {/* Feedback and Navigation */}
        {hasAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {isCorrect ? "Correct! ✔" : "Incorrect! ❌"}
            </Text>

            {/*score display */}
            <Text style={styles.scoreText}>Your Score: {score}</Text>

            {/* Next Question Button */}
            <TouchableOpacity
              style={[
                styles.navButton,
                { backgroundColor: params.quizColor as string },
              ]}
              onPress={handleNextQuestion}
              disabled={isSubmittingScore}
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
              disabled={isSubmittingScore}
            >
              <Text style={styles.navButtonText}>Back to Categories</Text>
            </TouchableOpacity>
          </View>
        )}

        {!currentUser && (
          <Text style={styles.authWarning}>
            You need to be signed in to save your scores
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
