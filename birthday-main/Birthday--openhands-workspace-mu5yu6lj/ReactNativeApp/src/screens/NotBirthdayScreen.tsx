import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface NotBirthdayScreenProps {
  navigateToScreen: (screen: ScreenType) => void;
}

const NotBirthdayScreen: React.FC<NotBirthdayScreenProps> = ({
  navigateToScreen,
}) => {
  const handleCheckDate = () => {
    navigateToScreen('date-result');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['not-birthday']} />
      
      <Text style={styles.message}>kem taro birthday ajj nathi</Text>
      
      <CustomButton
        title="Check Date"
        onPress={handleCheckDate}
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

export default NotBirthdayScreen;