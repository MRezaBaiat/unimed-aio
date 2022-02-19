import React from 'react';
import { View, Text } from 'react-native';
import AuthService from '../../services/AuthService';
import AppNavigator from '../../navigation/AppNavigator';

function Exit() {
  AuthService.logOut();
  AppNavigator.resetStackTo('SplashScreen');
  return null;
}

export default React.memo(Exit);
