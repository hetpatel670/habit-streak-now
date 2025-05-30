import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ScreenType } from '../types';
import { COLORS } from '../constants';

// Import all screen components
import WelcomeScreen from '../screens/WelcomeScreen';
import GreetingScreen from '../screens/GreetingScreen';
import BirthdayQuestionScreen from '../screens/BirthdayQuestionScreen';
import HappyBirthdayScreen from '../screens/HappyBirthdayScreen';
import GiftRequestScreen from '../screens/GiftRequestScreen';
import NoMoneyScreen from '../screens/NoMoneyScreen';
import ThankYouQuestionScreen from '../screens/ThankYouQuestionScreen';
import ForceThankYouScreen from '../screens/ForceThankYouScreen';
import FinalJaiHindScreen from '../screens/FinalJaiHindScreen';
import NotBirthdayScreen from '../screens/NotBirthdayScreen';
import DateResultScreen from '../screens/DateResultScreen';
import ChatScreen from '../screens/ChatScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import UserAlbumsScreen from '../screens/UserAlbumsScreen';
import AlbumViewScreen from '../screens/AlbumViewScreen';

const { width, height } = Dimensions.get('window');

interface MainContainerProps {
  currentScreen: ScreenType;
  userName: string;
  setUserName: (name: string) => void;
  currentUserUID: string | null;
  setCurrentUserUID: (uid: string | null) => void;
  loggedInAsHet: boolean;
  setLoggedInAsHet: (status: boolean) => void;
  navigateToScreen: (screen: ScreenType) => void;
  goBackToPreviousScreen: () => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
}

const MainContainer: React.FC<MainContainerProps> = ({
  currentScreen,
  userName,
  setUserName,
  currentUserUID,
  setCurrentUserUID,
  loggedInAsHet,
  setLoggedInAsHet,
  navigateToScreen,
  goBackToPreviousScreen,
  notificationCount,
  setNotificationCount,
}) => {
  const renderScreen = () => {
    const commonProps = {
      userName,
      setUserName,
      currentUserUID,
      setCurrentUserUID,
      loggedInAsHet,
      setLoggedInAsHet,
      navigateToScreen,
      goBackToPreviousScreen,
      notificationCount,
      setNotificationCount,
    };

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen {...commonProps} />;
      case 'greeting':
        return <GreetingScreen {...commonProps} />;
      case 'birthday-question':
        return <BirthdayQuestionScreen {...commonProps} />;
      case 'happy-birthday':
        return <HappyBirthdayScreen {...commonProps} />;
      case 'gift-request':
        return <GiftRequestScreen {...commonProps} />;
      case 'no-money':
        return <NoMoneyScreen {...commonProps} />;
      case 'thank-you-question':
        return <ThankYouQuestionScreen {...commonProps} />;
      case 'force-thank-you':
        return <ForceThankYouScreen {...commonProps} />;
      case 'final-jai-hind':
        return <FinalJaiHindScreen {...commonProps} />;
      case 'not-birthday':
        return <NotBirthdayScreen {...commonProps} />;
      case 'date-result':
        return <DateResultScreen {...commonProps} />;
      case 'chat':
        return <ChatScreen {...commonProps} />;
      case 'admin-panel':
        return <AdminPanelScreen {...commonProps} />;
      case 'user-albums':
        return <UserAlbumsScreen {...commonProps} />;
      case 'album-view':
        return <AlbumViewScreen {...commonProps} />;
      default:
        return <WelcomeScreen {...commonProps} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Math.min(420, width * 0.95),
    height: Math.min(700, height * 0.85),
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    alignSelf: 'center',
    marginTop: height * 0.1,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 20,
    overflow: 'hidden',
  },
});

export default MainContainer;