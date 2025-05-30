import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';

interface EmojiCharacterProps {
  emoji: string;
  size?: number;
}

const EmojiCharacter: React.FC<EmojiCharacterProps> = ({ emoji, size = 80 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatAnimation.start();

    return () => floatAnimation.stop();
  }, [floatAnim]);

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          width: size * 1.5,
          height: size * 1.5,
          transform: [{ translateY: floatAnim }] 
        }
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size }]}>{emoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 60,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 8,
  },
  emoji: {
    textAlign: 'center',
    lineHeight: undefined, // Let the system handle line height
  },
});

export default EmojiCharacter;