import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

const quizSelection = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Quiz Selection Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default quizSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
