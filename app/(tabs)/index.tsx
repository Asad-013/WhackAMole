import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const SQUARE_SIZE = 80;

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetColor, setTargetColor] = useState<string>(generateRandomColor());
  const [squares, setSquares] = useState<{ color: string }[]>(generateSquares());
  const [fadeAnim] = useState(new Animated.Value(1));  // Initial opacity of 1

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
        setSquares(generateSquares());
      } else {
        clearInterval(interval);
      }
    }, 1500); // Increased time to 1.5 seconds
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleSquarePress = (color: string) => {
    if (timeLeft > 0) {
      if (color === targetColor) {
        const newScore = score + 1;
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
        animateSquarePress();
      }
      setTargetColor(generateRandomColor());
      setSquares(generateSquares());
    }
  };

  const animateSquarePress = () => {
    fadeAnim.setValue(0.8);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setTargetColor(generateRandomColor());
    setSquares(generateSquares());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Color Tap Challenge</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.highScore}>High Score: {highScore}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      <Text style={styles.instructions}>Tap the square of this color:</Text>
      <View style={[styles.targetSquare, { backgroundColor: targetColor }]} />
      <View style={styles.grid}>
        {squares.map((square, index) => (
          <TouchableOpacity key={index} onPress={() => handleSquarePress(square.color)}>
            <Animated.View style={[styles.square, { backgroundColor: square.color, opacity: fadeAnim }]} />
          </TouchableOpacity>
        ))}
      </View>
      {timeLeft === 0 && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOver}>Game Over!</Text>
          <TouchableOpacity onPress={restartGame} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const generateRandomColor = () => {
  const colors = ['#FF6347', '#1E90FF', '#32CD32', '#FFD700', '#FF69B4', '#8A2BE2', '#00CED1'];
  const randomColorCode = colors[Math.floor(Math.random() * colors.length)];
  return randomColorCode;
};

const generateSquares = () => {
  const squares = [];
  for (let i = 0; i < 9; i++) {
    squares.push({ color: generateRandomColor() });
  }
  return squares;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  score: {
    fontSize: 24,
    marginBottom: 10,
  },
  highScore: {
    fontSize: 20,
    marginBottom: 20,
  },
  timer: {
    fontSize: 20,
    marginBottom: 20,
  },
  instructions: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  targetSquare: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    marginBottom: 20,
    borderRadius: 10,
  },
  grid: {
    width: width * 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    margin: 5,
    borderRadius: 10,
  },
  gameOverContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  gameOver: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
