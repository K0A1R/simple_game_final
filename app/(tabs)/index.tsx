import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const HomeScreen = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "#FF007F",
          "#00A8E8",
          "#39FF14",
          "#FFD700",
          "#FF4500",
          "#8A2BE2",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rainbowBorder}
      />

      <View style={styles.content}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.title}>Pop Quiz Pulse</Text>
        <Text style={styles.subtitle}>Test Your Knowledge!</Text>

        <TouchableOpacity onPress={() => router.push("/quizSelection")}>
          <LinearGradient
            colors={["#FF007F", "#00A8E8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.playButton}
          >
            <Icon name="play" size={30} color="#FFF" />
            <Text style={styles.playButtonText}>Play Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Login logout Button */}
      <View style={styles.authContainer}>
        {currentUser ? (
          <TouchableOpacity onPress={handleLogout} style={styles.authButton}>
            <Text style={styles.authButtonText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          // If the user is logged out, show Login button
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.authButton}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  rainbowBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 10,
    borderColor: "transparent",
    borderRadius: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2C2C2C",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    color: "#2C2C2C",
    marginTop: 10,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  playButtonText: {
    fontSize: 20,
    color: "#FFF",
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  authContainer: {
    position: "absolute",
    top: 50,
    right: 30,
  },
  authButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  authButtonText: {
    fontSize: 15,
    color: "#000",
  },
});

export default HomeScreen;
