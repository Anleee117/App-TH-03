import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider, useAppData } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';
import colors from './src/theme/colors';

function Main() {
  const { loadAll } = useAppData();
  return (
    <SyncProvider onSynced={loadAll}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SyncProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <AppDataProvider>
        <Main />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
