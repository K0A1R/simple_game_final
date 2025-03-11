import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

const questionAnswer = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Question+Answer Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default questionAnswer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
