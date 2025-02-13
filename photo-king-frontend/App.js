import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import styles, { colors } from './src/styles/ComponentStyles.js';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

import LoginScreen from './src/screens/Login.js';
import RegisterScreen from './src/screens/Register.js';
import HomeScreen from './src/screens/Home.js';
import GroupScreen from './src/screens/Group.js';
import TitleButtons from './src/components/TitleButtons.js';
import { View } from 'react-native';
import DefaultText from './src/components/DefaultText.js';
import ProfileScreen from './src/screens/Profile.js';
import SettingsScreen from './src/screens/Settings.js';
import FriendsScreen from './src/screens/Friends.js';
import {ActionSheetProvider} from "@expo/react-native-action-sheet";

const Stack = createNativeStackNavigator();

export default function App() {
  // Tracks if fonts have loaded
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Runs when componentDidMount
  // Loads the fonts in before navigation/first page loads
  useEffect(() => {
    async function loadFonts(){
      await Font.loadAsync({
        'DMSans-Regular': require('./assets/fonts/DMSans-Regular.ttf'),
        'DMSans-Bold': require('./assets/fonts/DMSans-Bold.ttf')
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // blocks page loading before fonts are loaded
  if(!fontsLoaded){
    return null;
  }

  // Sets up navigator
  return (
      <ActionSheetProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name='Login'
                options={{headerTitleStyle:styles.titleText, headerShown: false }}
                component={LoginScreen}
              />
              <Stack.Screen
                name='Register'
                options={{headerTitleStyle:styles.titleText}}
                component={RegisterScreen}
              />
              <Stack.Screen
                name='Home'
                options={({ navigation }) => ({
                  // headerTitleStyle:styles.titleText,
                  headerTitle: () =><DefaultText style={styles.titleText}>Home</DefaultText>,
                  headerRight: () => (<TitleButtons navigation={navigation}/>),
              })}
                component={HomeScreen}
              />
              <Stack.Screen
                name='Group'
                options={{headerTitleStyle:styles.titleText}}
                component={GroupScreen}
              />
              <Stack.Screen
                name='Profile'
                options={{headerTitleStyle:styles.titleText}}
                component={ProfileScreen}
              />
              <Stack.Screen
                name='Settings'
                options={{headerTitleStyle:styles.titleText}}
                component={SettingsScreen}
              />
              <Stack.Screen
                name='Friends'
                options={{headerTitleStyle:styles.titleText}}
                component={FriendsScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ActionSheetProvider>
  );
}

