import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface BirthdayQuestionScreenProps {
  userName: string;
  navigateToScreen: (screen: ScreenType) => void;
}

const BirthdayQuestionScreen: React.FC<BirthdayQuestionScreenProps> = ({
  userName,
  navigateToScreen,
}) => {
  const handleYes = () => {
    navigateToScreen('happy-birthday');
  };

  const handleNo = () => {
    navigateToScreen('not-birthday');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['birthday-question']} />
      
      <Text style={styles.question}>
        Ohh to taro birthday ajj he {userName}?
      </Text>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Yes"
          onPress={handleYes}
          variant="success"
          style={styles.button}
        />
        
        <CustomButton
          title="No"
          onPress={handleNo}
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

export default BirthdayQuestionScreen;