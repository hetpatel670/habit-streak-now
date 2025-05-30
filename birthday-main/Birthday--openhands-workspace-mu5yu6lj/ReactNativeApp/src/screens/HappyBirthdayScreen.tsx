import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS, CELEBRATION_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

interface CelebrationEmoji {
  id: number;
  emoji: string;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
}

interface HappyBirthdayScreenProps {
  userName: string;
  navigateToScreen: (screen: ScreenType) => void;
}

const HappyBirthdayScreen: React.FC<HappyBirthdayScreenProps> = ({
  userName,
  navigateToScreen,
}) => {
  const celebrationEmojis = useRef<CelebrationEmoji[]>([]);

  useEffect(() => {
    triggerCelebrationEffects();
  }, []);

  const triggerCelebrationEffects = () => {
    const emojis: CelebrationEmoji[] = [];
    
    for (let i = 0; i < 30; i++) {
      const emoji: CelebrationEmoji = {
        id: i,
        emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
        x: new Animated.Value(Math.random() * width * 0.8 + width * 0.1),
        y: new Animated.Value(Math.random() * height * 0.6 + height * 0.2),
        rotation: new Animated.Value(0),
        scale: new Animated.Value(0),
        opacity: new Animated.Value(1),
      };
      
      emojis.push(emoji);
      
      // Animate each emoji
      const delay = Math.random() * 800;
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 150;
        const endX = emoji.x._value + Math.cos(angle) * distance;
        const endY = emoji.y._value + Math.sin(angle) * distance - (70 + Math.random() * 80);
        
        Animated.parallel([
          Animated.timing(emoji.scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(emoji.x, {
            toValue: endX,
            duration: 1800,
            useNativeDriver: false,
          }),
          Animated.timing(emoji.y, {
            toValue: endY,
            duration: 1800,
            useNativeDriver: false,
          }),
          Animated.timing(emoji.rotation, {
            toValue: Math.random() * 720 - 360,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(1000),
            Animated.timing(emoji.opacity, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, delay);
    }
    
    celebrationEmojis.current = emojis;
  };

  const handleContinue = () => {
    navigateToScreen('gift-request');
  };

  return (
    <View style={styles.container}>
      {/* Celebration Effects */}
      <View style={styles.celebrationContainer} pointerEvents="none">
        {celebrationEmojis.current.map((emoji) => (
          <Animated.Text
            key={emoji.id}
            style={[
              styles.celebrationEmoji,
              {
                left: emoji.x,
                top: emoji.y,
                transform: [
                  { rotate: emoji.rotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }) },
                  { scale: emoji.scale },
                ],
                opacity: emoji.opacity,
              },
            ]}
          >
            {emoji.emoji}
          </Animated.Text>
        ))}
      </View>

      <EmojiCharacter emoji={SCREEN_EMOJIS['happy-birthday']} />
      
      <Text style={styles.title}>{userName}, Happy Birthday! 🎉</Text>
      
      <Text style={styles.subtitle}>🎂🎈🎁 Have a wonderful day! 🎁🎈🎂</Text>
      
      <CustomButton
        title="Continue"
        onPress={handleContinue}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  celebrationEmoji: {
    position: 'absolute',
    fontSize: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 36,
    zIndex: 2,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.gray[600],
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
    zIndex: 2,
  },
  button: {
    width: '100%',
    zIndex: 2,
  },
});

export default HappyBirthdayScreen;