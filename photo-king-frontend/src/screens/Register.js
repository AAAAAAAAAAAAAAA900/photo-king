import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import styles from '../styles/ComponentStyles.js';
import axios from 'axios';

export default function RegisterScreen ({navigation}){
  // Register screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  
  //Register attempt
  const Register = async () => {

    // Send login attempt to backend
    try {
      const response = await axios.post('https://1785-2600-4040-af73-4a00-98d9-4725-d184-8b0.ngrok-free.app/api/user/register', {username: username, password: password},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      navigation.navigate("Home");

    }
    catch (error) {
      console.log(error);
    }
  }

  // Login screen view
  return(
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={Login}>
        <Text>Register</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
