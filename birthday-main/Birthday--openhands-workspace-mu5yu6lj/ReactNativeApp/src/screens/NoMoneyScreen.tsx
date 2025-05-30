import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface NoMoneyScreenProps {
  userName: string;
  navigateToScreen: (screen: ScreenType) => void;
}

const NoMoneyScreen: React.FC<NoMoneyScreenProps> = ({
  userName,
  navigateToScreen,
}) => {
  const handleNext = () => {
    navigateToScreen('thank-you-question');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['no-money']} />
      
      <Text style={styles.message}>
        Accha, pan mara kane paisa nathi etle sorry 💸
      </Text>
      
      <CustomButton
        title="Next"
        onPress={handleNext}
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

export default NoMoneyScreen;