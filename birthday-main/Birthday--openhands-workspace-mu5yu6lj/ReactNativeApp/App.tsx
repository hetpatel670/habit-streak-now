import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScreenType } from './src/types';
import { COLORS } from './src/constants';
import MainContainer from './src/components/MainContainer';
import AdminButton from './src/components/AdminButton';
import ParticleBackground from './src/components/ParticleBackground';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [currentUserUID, setCurrentUserUID] = useState<string | null>(null);
  const [loggedInAsHet, setLoggedInAsHet] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    // Load saved user data on app start
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUserName = await AsyncStorage.getItem('userName');
      const savedUserUID = await AsyncStorage.getItem('currentUserUID');
      const savedAdminStatus = await AsyncStorage.getItem('loggedInAsHet');
      
      if (savedUserName) setUserName(savedUserName);
      if (savedUserUID) setCurrentUserUID(savedUserUID);
      if (savedAdminStatus === 'true') setLoggedInAsHet(true);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const navigateToScreen = (newScreen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(newScreen);
  };

  const goBackToPreviousScreen = () => {
    // Special handling for navigating back from album view
    if (currentScreen === 'album-view') {
      if (loggedInAsHet && previousScreen === 'admin-panel') {
        setCurrentScreen('admin-panel');
      } else {
        setCurrentScreen('user-albums');
      }
    } else if (currentScreen === 'user-albums') {
      setCurrentScreen('chat');
    } else {
      setCurrentScreen(previousScreen);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Admin Button */}
      <AdminButton
        onPress={() => {/* Handle admin login */}}
        notificationCount={notificationCount}
      />
      
      {/* Main Container */}
      <MainContainer
        currentScreen={currentScreen}
        userName={userName}
        setUserName={setUserName}
        currentUserUID={currentUserUID}
        setCurrentUserUID={setCurrentUserUID}
        loggedInAsHet={loggedInAsHet}
        setLoggedInAsHet={setLoggedInAsHet}
        navigateToScreen={navigateToScreen}
        goBackToPreviousScreen={goBackToPreviousScreen}
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
