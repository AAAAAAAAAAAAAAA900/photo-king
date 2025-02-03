import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button } from 'react-native';
import { useState } from 'react';
import styles from '../styles/ComponentStyles.js';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

export default function RegisterScreen ({navigation}){  


  const { control, handleSubmit, errors } = useForm();

  const onSubmit = data => {
    console.log(data);
  }

  // Send Register attempt to backend
  const Register = async () => {
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
      <View>
        <Text>Username</Text>
        <Controller
          name="username"
          control={control}
          render={(props) => <TextInput {...props}/>}
          rules={{ required: "This field is required" }}
        />
      </View>
      <View>
        <Text>Password</Text>
        <Controller
          name="password"
          control={control}
          render={(props) => <TextInput {...props}/>}
          rules={{ required: "This field is required" }}
        />
      </View>
      <Button title="Register" onPress={handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
}
