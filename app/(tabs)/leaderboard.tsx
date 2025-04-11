"use client";

import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type Score = {
  id: string;
  userId: string;
  quizName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timestamp: any;
};

const Leaderboard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoading(true);
    // Create a query that orders scores by the raw score in descending order
    const scoresQuery = query(
      collection(db, "scores"),
      orderBy("score", "desc")
    );

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(
      scoresQuery,
      (snapshot) => {
        const updatedScores: Score[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Score[];
        setScores(updatedScores);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Error fetching scores:", error);
        Alert.alert(
          "Error",
          "Failed to load leaderboard data. Please try again later."
        );
        setLoading(false);
        setRefreshing(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // onSnapshot already listens for live changes,
    // but you could force a refresh with additional logic if needed.
  };

  const renderItem = ({ item, index }: { item: Score; index: number }) => {
    // Check if this score belongs to the current user
    const isCurrentUser = currentUser && item.userId === currentUser.uid;

    return (
      <View
        style={[
          styles.scoreItem,
          index % 2 === 0 ? styles.even : styles.odd,
          isCurrentUser ? styles.currentUserScore : null,
        ]}
      >
        <ThemedText style={styles.rank}>{index + 1}</ThemedText>
        <View style={styles.details}>
          <ThemedText style={styles.quizName}>{item.quizName}</ThemedText>
          <ThemedText style={styles.scoreText}>
            {item.score} correct answers
          </ThemedText>
        </View>
        <ThemedText
          style={[
            styles.userHighlight,
            isCurrentUser ? styles.currentUser : null,
          ]}
        >
          {isCurrentUser ? "You" : "User " + item.userId.slice(0, 6)}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Leaderboard
      </ThemedText>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={scores}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <ThemedText>
              No scores yet. Complete a quiz to be the first!
            </ThemedText>
          }
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  even: {
    backgroundColor: "#f0f0f0",
  },
  odd: {
    backgroundColor: "#e0e0e0",
  },
  currentUserScore: {
    borderWidth: 2,
    borderColor: "#4a80f0",
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    width: 30,
  },
  details: {
    flex: 1,
  },
  quizName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 14,
  },
  userHighlight: {
    fontWeight: "600",
    color: "#4a80f0",
  },
  currentUser: {
    color: "#4a80f0",
    fontWeight: "bold",
  },
});

export default Leaderboard;
