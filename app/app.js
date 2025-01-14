import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { ClerkProvider, SignedIn, SignedOut, useClerk } from '@clerk/clerk-expo';
import SignIn from './(auth)/sign-in';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Navigations/TabNavigation';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log('No values stored under key: ' + key);
      }
      return item;
    } catch (error) {
      console.error('SecureStore get item error: ', error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

const ExpoSecureStore = {
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  getItem: (key) => SecureStore.getItemAsync(key),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export default function App() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <View style={styles.container}>
        <SignedIn>
          <NavigationContainer independent={true}>
            <TabNavigation />
            <LogOutButton />
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

const LogOutButton = () => {
  const { signOut } = useClerk();  // Use the Clerk hook to access signOut method
  const handleLogOut = () => {
    signOut();
  };

  return (
    <View style={styles.logoutButtonContainer}>
      <Button title="Log Out" onPress={handleLogOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButtonContainer: {
    marginTop: 20,
    padding: 10,
  },
});
