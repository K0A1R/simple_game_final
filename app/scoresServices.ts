import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

/**
 * Saves a quiz score for the current user
 */
export const saveUserScore = async (
    userId: string,
    quizId: string,
    score: number,
    totalQuestions: number
): Promise<void> => {
    try {
        await addDoc(collection(db, "scores"), {
            userId,
            quizId,
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            timestamp: new Date(),
        });
    } catch (error) {
        console.error("Error saving score:", error);
        throw error;
    }
};

/**
 * Gets all scores
 */
export const getAllScores = async (): Promise<any[]> => {
    try {
        const snapshot = await getDocs(collection(db, "scores"));
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching scores:", error);
        throw error;
    }
};

/**
 * Gets scores for a specific user
 */
export const getUserScores = async (userId: string): Promise<any[]> => {
    const snapshot = await getDocs(collection(db, "scores"));
    return snapshot.docs
        .map((doc) => doc.data())
        .filter((score) => score.userId === userId);
};
