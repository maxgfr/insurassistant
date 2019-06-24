import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import HistoricScreen from '../screens/HistoricScreen';
import PersonnalInfoScreen from '../screens/PersonnalInfoScreen';

export default createAppContainer(
  createStackNavigator({
    Home: HomeScreen,
    Chat: ChatScreen,
    Historic: HistoricScreen,
    Perso: PersonnalInfoScreen
  })
);
