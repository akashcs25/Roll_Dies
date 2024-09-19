import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  Easing,
} from 'react-native';
import React, { useState, useRef } from 'react';
import type { PropsWithChildren } from 'react';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

// Optional configuration

// Trigger haptic feedback
// images import
import DiceOne from '../assets/DiceOne.png';
import DiceTwo from '../assets/DiceTwo.png';
import DiceThree from '../assets/DiceThree.png';
import DiceFour from '../assets/DiceFour.png';
import DiceFive from '../assets/DiceFive.png';
import DiceSix from '../assets/DiceSix.png';

type DiceProps = PropsWithChildren<{
  imageUrl: ImageSourcePropType;
  diceAnimation: Animated.Value;
}>;

const Dice = ({ imageUrl, diceAnimation }: DiceProps): JSX.Element => {
  // Interpolating the animation for 3D rotation on multiple axes
  const rotateX = diceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'], // Rotate along X-axis
  });

  const rotateY = diceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'], // Rotate along Y-axis
  });

  const rotateZ = diceAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Z-axis for randomness
  });

  const scale = diceAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.5, 1], // Simulating the dice bouncing by scaling
  });

  const opacity = diceAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1], // Opacity transition for realism
  });

  return (
    <Animated.View
      style={[
        styles.diceContainer,
        {
          transform: [
            { rotateX }, // 3D rotation on X-axis
            { rotateY }, // 3D rotation on Y-axis
            { rotateZ }, // Random Z-axis rotation
            { scale },   // Simulating a bounce effect using scale
            { perspective: 800 }, // Perspective to give a 3D look
          ],
          opacity,
        },
      ]}>
      <Image style={styles.diceImage} source={imageUrl} />
    </Animated.View>
  );
};

export default function App() {
  const [diceImage, setDiceImage] = useState<ImageSourcePropType>(DiceOne);
  const diceAnimation = useRef(new Animated.Value(0)).current;

  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };


  const rollDice = () => {
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    // Start the dice animation with realistic physics
    Animated.timing(diceAnimation, {
      toValue: 1,
      duration: 1500, // Slow the animation down for a more realistic roll
      easing: Easing.out(Easing.bounce), // Adding a bounce easing effect
      useNativeDriver: true,
    }).start(() => {
      // Reset the animation value after it finishes
      diceAnimation.setValue(0);

      // Switch to change the dice image after the animation completes
      switch (randomNumber) {
        case 1:
          setDiceImage(DiceOne);
          break;
        case 2:
          setDiceImage(DiceTwo);
          break;
        case 3:
          setDiceImage(DiceThree);
          break;
        case 4:
          setDiceImage(DiceFour);
          break;
        case 5:
          setDiceImage(DiceFive);
          break;
        case 6:
          setDiceImage(DiceSix);
          break;
        default:
          setDiceImage(DiceOne);
          break;
      }
    });
    ReactNativeHapticFeedback.trigger("impactLight", options);

  };

  return (
    <View style={styles.container}>
      <Dice imageUrl={diceImage} diceAnimation={diceAnimation} />
      <Pressable onPress={rollDice} style={styles.ButtonContainer}>
        <Text style={styles.buttonText}>Roll the dice</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F2',
  },
  diceContainer: {
    margin: 12,
    alignItems: 'center',
    justifyContent: 'center',

  },
  diceImage: {
    width: 200,
    height: 200,
    borderRadius: 10

  },
  ButtonContainer: {
    backgroundColor: 'green',
    padding: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
