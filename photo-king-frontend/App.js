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
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import DefaultText from './src/components/DefaultText.js';
import ProfileScreen from './src/screens/Profile.js';
import SettingsScreen from './src/screens/Settings.js';
import FriendsScreen from './src/screens/Friends.js';
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import PhotoScreen from './src/screens/Photo.js';
import RankScreen from './src/screens/Rank.js';


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
              {/* Headers replaced with custom component because of expo go bug on android */}
              <Stack.Screen
                name='Login'
                options={{ headerShown: false }}
                component={LoginScreen}
              />
              <Stack.Screen
                name='Register'
                options={{ headerShown: false }}
                component={RegisterScreen}
              />
              <Stack.Screen
                name='Home'
                options={{ headerShown: false }}
                component={HomeScreen}
              />
              <Stack.Screen
                name='Group'
                options={{ headerShown: false }}
                component={GroupScreen}
              />
              <Stack.Screen
                name='Profile'
                options={{ headerShown: false }}
                component={ProfileScreen}
              />
              <Stack.Screen
                name='Settings'
                options={{ headerShown: false }}
                component={SettingsScreen}
              />
              <Stack.Screen
                name='Friends'
                options={{ headerShown: false }}
                component={FriendsScreen}
              />
              <Stack.Screen
                name='Photo'
                options={{ headerShown: false }}
                component={PhotoScreen}
              />
              <Stack.Screen
                name='Rank'
                options={{ headerShown: false }}
                component={RankScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </ActionSheetProvider>
  );
}

const headerStyles = StyleSheet.create({
  default:{
    headerTitleStyle:styles.titleText,
  },
  noBack: {
    headerTitleStyle:styles.titleText,
    headerBackVisible:false
  },
  profileAndSettings:
    ({ navigation, route }) => ({
      headerRight: () => (<TitleButtons user={route.params?.user} navigation={navigation}/>),
      headerTitleStyle:styles.titleText,
      headerBackVisible:false,
    }),
});