import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import styles, { colors } from '../styles/ComponentStyles.js';
import Input from '../components/Input.js';
import axios from 'axios';

export default function LoginScreen ({navigation}){
  // Login screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  // Login attempt
  const Login = async () => {

    // Send login attempt to backend
    try {
      const response = await axios.post('https://20a6-2600-4040-af73-4a00-98d9-4725-d184-8b0.ngrok-free.app/api/user/login', {username: username, password: password},
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
    <SafeAreaView  style={[styles.containerCenterAll, {backgroundColor:colors.primary}]}>
      <View padding={20} borderWidth={5} style={[styles.inputContainer, {alignSelf:'center'}]} >
        <Input userUpdate={setUsername} passUpdate={setPassword}/>
        <TouchableOpacity style={styles.button} onPress={Login}>
          <Text>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
