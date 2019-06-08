import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ChatScreen from '../screens/ChatScreen';
import HistoricScreen from '../screens/HistoricScreen';

export default createAppContainer(
  createSwitchNavigator({
    Home: HomeScreen,
    Chat: ChatScreen,
    Login: LoginScreen,
    Historic: HistoricScreen
  })
);
