import { db } from "./firebase"
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore"

/**
 * Saves a quiz score for the current user.
 */
export const saveUserScore = async (
  userId: string,
  quizName: string,
  score: number,
  totalQuestions: number
): Promise<void> => {
  try {
    // Ensure we do not divide by zero.
    const percentage =
      totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100)
    await addDoc(collection(db, "scores"), {
      userId,
      quizName,
      score,
      totalQuestions,
      percentage,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error("Error saving score:", error)
    throw error
  }
}

/**
 * Retrieves all scores sorted by percentage in descending order.
 */
export const getAllScores = async (): Promise<any[]> => {
  try {
    const scoresQuery = query(
      collection(db, "scores"),
      orderBy("percentage", "desc")
    )
    const snapshot = await getDocs(scoresQuery)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error fetching scores:", error)
    throw error
  }
}