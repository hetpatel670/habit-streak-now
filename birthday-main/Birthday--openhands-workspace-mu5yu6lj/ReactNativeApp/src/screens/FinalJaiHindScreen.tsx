import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';

interface FinalJaiHindScreenProps {
  navigateToScreen: (screen: ScreenType) => void;
}

const FinalJaiHindScreen: React.FC<FinalJaiHindScreenProps> = ({
  navigateToScreen,
}) => {
  const handleChatWithHet = () => {
    navigateToScreen('chat');
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['final-jai-hind']} />
      
      <Text style={styles.title}>Tara birthday na tane... 🎉</Text>
      
      <Text style={styles.subtitle}>JAI HIND!</Text>
      
      <CustomButton
        title="Chat with Het"
        onPress={handleChatWithHet}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
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

export default FinalJaiHindScreen;