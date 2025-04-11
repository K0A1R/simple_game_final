"use client";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const _layout = () => {
  /*
  // Access the current user and loading state from AuthContext
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Redirect href="/(auth)/login" />;
  }
  */

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.light.tabBarColor,
          height: 60,
        },
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="quizSelection"
        options={{
          title: "Quizzes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="quiz" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="leaderboard" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
