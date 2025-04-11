"use client"

import { useEffect, useState } from "react"
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native"
import { getAllScores } from "../scoresServices"
import { useAuth } from "../AuthContext"
import { ThemedView } from "@/components/ThemedView"
import { ThemedText } from "@/components/ThemedText"

type Score = {
  id: string
  userId: string
  quizName: string
  score: number
  totalQuestions: number
  percentage: number
  timestamp: any
}

export default function ScoresScreen() {
  const [scores, setScores] = useState<Score[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { currentUser } = useAuth()

  const fetchScores = async () => {
    try {
      setLoading(true)
      const allScores = await getAllScores()
      setScores(allScores)
    } catch (error) {
      console.error("Error fetching scores", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchScores()
  }

  const renderItem = ({ item, index }: { item: Score; index: number }) => {
    return (
      <View style={[styles.scoreItem, index % 2 === 0 ? styles.even : styles.odd]}>
        <ThemedText style={styles.rank}>{index + 1}</ThemedText>
        <View style={styles.details}>
          <ThemedText style={styles.quizName}>{item.quizName}</ThemedText>
          <ThemedText style={styles.scoreText}>
            {item.score}/{item.totalQuestions} ({item.percentage}%)
          </ThemedText>
        </View>
        {/* You can show a snippet of the userId or "You" if it matches the current user */}
        <ThemedText style={styles.userHighlight}>
          {currentUser && item.userId === currentUser.uid ? "You" : item.userId.slice(0, 6)}
        </ThemedText>
      </View>
    )
  }

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
            <ThemedText>No scores yet. Complete a quiz to be the first!</ThemedText>
          }
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  header: {
    fontSize: 24,
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
});