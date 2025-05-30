import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface GreetingScreenProps {
  userName: string;
  navigateToScreen: (screen: ScreenType) => void;
}

const GreetingScreen: React.FC<GreetingScreenProps> = ({
  userName,
  navigateToScreen,
}) => {
  const handleContinue = () => {
    navigateToScreen('birthday-question');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS.greeting} />
      
      <Text style={styles.greeting}>Ohh, {userName}! 👋</Text>
      
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 32,
  },
  button: {
    width: '100%',
  },
});

export default GreetingScreen;