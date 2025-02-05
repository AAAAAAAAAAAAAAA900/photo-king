import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { colors } from '../styles/ComponentStyles.js';
import Input from '../components/Input.js';
import axios from 'axios';
import DefaultText from '../components/DefaultText.js';
import { API_URL } from '../api/utils.js';

export default function LoginScreen ({navigation}){
  // Login screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password

  // Login attempt
  const Login = async () => {
    // Send login attempt to backend
    try {
      const response = await axios.post(`${API_URL}/api/user/login`, {username: username, password: password},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      navigation.navigate("Home", {user:username});

    }
    catch (error) {
      console.log(error);
    }
  }

  // Login screen view
  return(
    <SafeAreaView  style={[styles.container/*, {backgroundColor:colors.primary}*/]}>
      <LinearGradient 
        colors={[colors.primary, "#000000"]} // Change colors as needed
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
