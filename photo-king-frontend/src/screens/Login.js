import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import styles from '../styles/ComponentStyles.js';

export default function LoginScreen ({navigation}){
  // Login screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  
  // Login attempt
  const login = () => {
    navigation.navigate("Home");
  }

  // Login screen view
  return(
    <SafeAreaView style={styles.container}>
      <Text margin={10}>Username</Text>
      <TextInput
        style={styles.textIn}
        onChangeText={setUsername}
        autoCapitalize ='none'
        autoCorrect ={false}
        placeholder="Enter username"
      />
      <Text margin={10}>Password</Text>
      <TextInput
        style={styles.textIn}
        onChangeText={setPassword}
        autoCapitalize ='none'
        autoCorrect ={false}
        placeholder="Enter password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={login}>
        <Text>Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
