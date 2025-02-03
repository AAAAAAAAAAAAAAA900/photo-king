import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
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
          <DefaultText>Log in</DefaultText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
          <DefaultText>create an account</DefaultText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
