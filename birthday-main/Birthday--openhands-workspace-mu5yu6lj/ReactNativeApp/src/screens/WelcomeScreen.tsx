import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

interface WelcomeScreenProps {
  userName: string;
  setUserName: (name: string) => void;
  navigateToScreen: (screen: ScreenType) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  userName,
  setUserName,
  navigateToScreen,
}) => {
  const [inputValue, setInputValue] = useState(userName);
  const [hasError, setHasError] = useState(false);

  const handleNext = async () => {
    if (inputValue.trim() === '') {
      setHasError(true);
      Alert.alert('Input Required', 'Please enter your name to proceed.');
      return;
    }

    setHasError(false);
    const name = inputValue.trim();
    setUserName(name);
    
    try {
      await AsyncStorage.setItem('userName', name);
    } catch (error) {
      console.error('Error saving user name:', error);
    }

    navigateToScreen('greeting');
  };

  const showResumeModal = () => {
    Alert.prompt(
      'Resume Session',
      'Enter your name to resume:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Resume',
          onPress: (name) => {
            if (name && name.trim()) {
              setUserName(name.trim());
              setInputValue(name.trim());
              navigateToScreen('chat');
            } else {
              Alert.alert('Error', 'Please enter a valid name.');
            }
          },
        },
      ],
      'plain-text',
      userName
    );
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS.welcome} />
      
      <Text style={styles.title}>Welcome!</Text>
      
      <Text style={styles.subtitle}>Enter your name to continue:</Text>
      
      <CustomInput
        value={inputValue}
        onChangeText={(text) => {
          setInputValue(text);
          if (hasError) setHasError(false);
        }}
        placeholder="Your name..."
        hasError={hasError}
        style={styles.input}
      />
      
      <CustomButton
        title="Next"
        onPress={handleNext}
        style={styles.button}
      />
      
      <CustomButton
        title="Already Completed?"
        onPress={showResumeModal}
        variant="secondary"
        style={styles.secondaryButton}
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
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 30,
    textAlign: 'center',
    color: COLORS.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.gray[600],
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 24,
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 10,
  },
});

export default WelcomeScreen;