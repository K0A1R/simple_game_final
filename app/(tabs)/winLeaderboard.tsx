import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

const winLeaderboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Win + Leaderboard Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default winLeaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
