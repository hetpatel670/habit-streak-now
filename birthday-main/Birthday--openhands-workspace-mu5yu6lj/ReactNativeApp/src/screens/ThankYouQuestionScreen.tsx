import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface ThankYouQuestionScreenProps {
  navigateToScreen: (screen: ScreenType) => void;
}

const ThankYouQuestionScreen: React.FC<ThankYouQuestionScreenProps> = ({
  navigateToScreen,
}) => {
  const handleThankYou = () => {
    navigateToScreen('final-jai-hind');
  };

  const handleNoThankYou = () => {
    navigateToScreen('force-thank-you');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['thank-you-question']} />
      
      <Text style={styles.question}>
        Pan me tane gift nu puchyu etle thank you toh ke?
      </Text>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Thank You"
          onPress={handleThankYou}
          variant="success"
          style={styles.button}
        />
        
        <CustomButton
          title="No Thank You"
          onPress={handleNoThankYou}
          variant="error"
          style={styles.button}
        />
      </View>
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
  question: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    width: '100%',
  },
});

export default ThankYouQuestionScreen;