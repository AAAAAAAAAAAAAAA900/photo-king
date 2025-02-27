import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { colors } from '../styles/ComponentStyles.js';
import Input from '../components/Input.js';
import DefaultText from '../components/DefaultText.js';
import * as SecureStore from "expo-secure-store";
import authApi from "../api/authApi";
import userApi from "../api/userApi";

export default function LoginScreen ({navigation}){
  // Login screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password

  // Login attempt
  const Login = async () => {
    try {
      const response = await authApi.login(username, password);
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);

      const user_info = await userApi.getUserInfo();

      navigation.navigate("Home", {user: user_info.data});
    } catch (error) {
      console.log(error);
    }
  }

  // Login screen view
  return(
    <SafeAreaView  style={[styles.container/*, {backgroundColor:colors.primary}*/]}>
      <LinearGradient 
        colors={[colors.primary, colors.secondary]} // Change colors as needed
        start={{ x: 0, y: 0 }} // Top-left corner
        end={{ x: 1, y: 1 }} // Bottom-right corner
        style={styles.containerCenterAll}
      >
        <View padding={20} borderWidth={5} style={[styles.inputContainer, {alignSelf:'center'}]} >
          <Input userUpdate={setUsername} passUpdate={setPassword}/>
          <TouchableOpacity style={styles.button} onPress={Login}>
            <DefaultText>Log in</DefaultText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
            <Text style={styles.urlText}>create an account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
