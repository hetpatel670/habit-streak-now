import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ref as dbRef, push } from 'firebase/database';
import { ScreenType } from '../types';
import { COLORS, SCREEN_EMOJIS } from '../constants';
import { realtimeDb } from '../services/firebase';
import EmojiCharacter from '../components/EmojiCharacter';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

interface GiftRequestScreenProps {
  userName: string;
  currentUserUID: string | null;
  navigateToScreen: (screen: ScreenType) => void;
}

const GiftRequestScreen: React.FC<GiftRequestScreenProps> = ({
  userName,
  currentUserUID,
  navigateToScreen,
}) => {
  const [giftMessage, setGiftMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (giftMessage.trim() === '') {
      setHasError(true);
      Alert.alert('Input Required', 'Please enter your gift message.');
      return;
    }

    setHasError(false);
    setIsSubmitting(true);

    try {
      // Save birthday message
      const birthdayMessagesRef = dbRef(realtimeDb, 'birthday-messages');
      await push(birthdayMessagesRef, {
        name: userName,
        gift: giftMessage.trim(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        uid: currentUserUID,
      });

      // Also post gift message to chat for Het to see
      const chatMessagesRef = dbRef(realtimeDb, 'chat-messages');
      await push(chatMessagesRef, {
        author: userName,
        message: `🎁 Gift wish from ${userName}: ${giftMessage.trim()}`,
        timestamp: new Date().toISOString(),
        isAdmin: false,
        uid: currentUserUID,
        isSystem: true,
      });

      navigateToScreen('no-money');
    } catch (error) {
      console.error('Error submitting gift:', error);
      Alert.alert(
        'Submission Error',
        'Failed to submit gift message. Please check your internet connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <EmojiCharacter emoji={SCREEN_EMOJIS['gift-request']} />
      
      <Text style={styles.title}>Bol tane su gift khaperu?</Text>
      
      <CustomInput
        value={giftMessage}
        onChangeText={(text) => {
          setGiftMessage(text);
          if (hasError) setHasError(false);
        }}
        placeholder="Type your gift message here..."
        multiline
        numberOfLines={4}
        hasError={hasError}
        style={styles.input}
      />
      
      <CustomButton
        title="Submit"
        onPress={handleSubmit}
        disabled={isSubmitting}
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
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.gray[700],
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 32,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});

export default GiftRequestScreen;