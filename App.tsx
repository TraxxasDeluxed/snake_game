// App.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Dimensions, PanResponder, Text, TouchableOpacity } from 'react-native';
import Snake from './components/Snake';
import Food from './components/Food';
import Score from './components/Score';
import { getRandomPosition, checkCollision } from './utils/gameLogic';

const { width, height } = Dimensions.get('window');
const boxSize = 20;

const App = () => {
  const [snake, setSnake] = useState([{ x: boxSize * 5, y: boxSize * 5 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [powerUp, setPowerUp] = useState(null);
  const [direction, setDirection] = useState({ x: boxSize, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(200);
  const [obstacles, setObstacles] = useState(createObstacles());

  useEffect(() => {
    if (!gameOver && !paused) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [snake, gameOver, paused, speed]);

  useEffect(() => {
    if (score % 5 === 0 && score > 0) {
      setLevel(prev => prev + 1);
      setSpeed(prev => Math.max(prev - 20, 50)); // Increase speed, minimum 50ms
    }
  }, [score]);

  const createObstacles = () => {
    // Create obstacles randomly
    return [
      { x: boxSize * 7, y: boxSize * 7 },
      { x: boxSize * 10, y: boxSize * 5 },
      { x: boxSize * 15, y: boxSize * 10 },
    ];
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (checkCollision(head, newSnake, width, height) || checkObstacleCollision(head)) {
      setGameOver(true);
      Alert.alert("Game Over", "You crashed! Press OK to restart.", [{
        text: "OK", onPress: restartGame
      }]);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomPosition());
      setScore(prev => prev + 1);
      if (Math.random() < 0.5) setPowerUp(getRandomPosition()); // 50% chance to spawn a power-up
    } else {
      newSnake.pop();
    }

    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
      setScore(prev => prev + 3); // Gain extra points
      setPowerUp(null); // Remove power-up after collection
    }

    setSnake(newSnake);
  };

  const checkObstacleCollision = (head) => {
    return obstacles.some(obstacle => head.x === obstacle.x && head.y === obstacle.y);
  };

  const restartGame = () => {
    setSnake([{ x: boxSize * 5, y: boxSize * 5 }]);
    setFood(getRandomPosition());
    setPowerUp(null);
    setDirection({ x: boxSize, y: 0 });
    setGameOver(false);
    setPaused(false);
    setScore(0);
    setLevel(1);
    setSpeed(200);
    setObstacles(createObstacles());
  };

  const handleSwipe = (gestureState) => {
    const { dx, dy } = gestureState;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection({ x: dx > 0 ? boxSize : -boxSize, y: 0 });
    } else {
      setDirection({ x: 0, y: dy > 0 ? boxSize : -boxSize });
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
    },
    onPanResponderRelease: (evt, gestureState) => {
      handleSwipe(gestureState);
    },
  });

  const togglePause = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Score score={score} />
      <Snake snake={snake} />
      <Food position={food} />
      {powerUp && <Food position={powerUp} color="blue" />} {/* Power-up appears in blue */}
      {obstacles.map((obstacle, index) => (
        <View key={index} style={[styles.obstacle, { left: obstacle.x, top: obstacle.y }]} />
      ))}
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
        <Text style={styles.pauseButtonText}>{paused ? "Resume" : "Pause"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacle: {
    position: 'absolute',
    width: boxSize,
    height: boxSize,
    backgroundColor: 'red',
  },
  gameOverContainer: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  gameOverText: {
    color: 'white',
    fontSize: 32,
    marginBottom: 10,
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
  },
  restartButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  restartButtonText: {
    color: 'white',
  },
  pauseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  pauseButtonText: {
    color: 'black',
  },
});

export default App;
