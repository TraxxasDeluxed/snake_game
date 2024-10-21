// components/Score.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const Score = ({ score }) => {
  return (
    <Text style={styles.score}>
      Score: {score}
    </Text>
  );
};

const styles = StyleSheet.create({
  score: {
    color: 'white',
    fontSize: 24,
    position: 'absolute',
    top: 40,
  },
});

export default Score;
