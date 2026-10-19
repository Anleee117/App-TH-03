import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import {AppProvider} from './src/context/AppContext';
import {colors} from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <AppProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
