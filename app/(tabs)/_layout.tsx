import { StyleSheet, Text, View } from "react-native";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";

import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const _layout = () => {
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
        name="questionAnswer"
        options={{
          title: "Question/Answer",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="head-question"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="winLeaderboard"
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

const styles = StyleSheet.create({});
