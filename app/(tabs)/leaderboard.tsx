import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  ListRenderItem,
} from "react-native";

import React from 'react';

// Define TypeScript type for leaderboard data

type LeaderboardItem = {
  id: string;
  name: string;
  score: number;
}

const leaderBoardData: LeaderboardItem[] = [
  { id: '1', name: 'TheRock', score: 2250},
  { id: '2', name: 'Dva.OW', score: 2100},
  { id: '3', name: 'Miku', score: 1900},
  { id: '4', name: 'Glados', score: 1600},
]

const borderColors = ['#FF00FF', '#D0021B','#4A90E2', '#9013FE']; // Magenta, Orange, Blue, Violet

const Leaderboard: React.FC = () => {
  const renderItem: ListRenderItem<LeaderboardItem> = ({ item, index }) => (
    <View style={styles.item}>
      <View style={[styles.circle, { borderColor: borderColors[index % borderColors.length] }]}>
        <Text style={styles.circleText}>{index + 1}</Text>
      </View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.score}>{item.score}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
      data={leaderBoardData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      />
    </View>
  );
};
 
export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', 
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFD700', //gold to match sports tab
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    color: '#000', //for contrast
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
