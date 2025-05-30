import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface ForceThankYouScreenProps {
  userName: string;
  navigateToScreen: (screen: ScreenType) => void;
}

const ForceThankYouScreen: React.FC<ForceThankYouScreenProps> = ({
  userName,
  navigateToScreen,
}) => {
  const handleThankYou = () => {
    navigateToScreen('final-jai-hind');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['force-thank-you']} />
      
      <Text style={styles.message}>
        Na, {userName} thank you to kevu pade! 😤
      </Text>
      
      <CustomButton
        title="Thank You"
        onPress={handleThankYou}
        variant="success"
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
  message: {
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

export default ForceThankYouScreen;