import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button, ScrollView } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { API_URL } from '../api/utils.js';


export default function RegisterScreen ({navigation}){  


  const { 
    control,
    handleSubmit,
    formState: { 
      errors
    }
  } = useForm();

  const onSubmit = data => {
    Register(data);
  }

  // Send Register attempt to backend
  const Register = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/register`, data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      navigation.navigate("Home", {user : response.data});
    }
    catch (error) {
      console.log(error);
    }
  }

  // Login screen view
  return(
    <SafeAreaView style={registerStyles.container}>
      <ScrollView style={{ width: '95%' }}>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>Username</Text>
          <Controller
            name="username"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter Username"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>Password</Text>
          <Controller
            name="password"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter Password"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>Email</Text>
          <Controller
            name="email"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter Email"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>First Name</Text>
          <Controller
            name="firstname"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter First Name"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>Last Name</Text>
          <Controller
            name="lastname"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter Last name"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <View style={registerStyles.inputContainer}>
          <Text style={registerStyles.label}>Phone</Text>
          <Controller
            name="phone"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field : { onChange, value} }) => (
              <TextInput
                placeholder="Enter Phone Number"
                placeholderTextColor={'#616161'}
                value={value}
                onChangeText={onChange}
                keyboardType='numeric'
                style={registerStyles.textInput}
              />
            )}
          />
        </View>

        <TouchableOpacity style={registerStyles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={registerStyles.buttonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </SafeAreaView>
  );

}


const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#E1E1E1',
    marginBottom: 5,
    fontFamily: 'DMSans-Regular',
    paddingTop: 10
  },
  textInput: {
    backgroundColor: '#1D1D1D',
    color: '#E1E1E1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
  },
  button: {
    backgroundColor: '#BB86FC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#E1E1E1',
    fontSize: 18,
    fontFamily: 'DMSans-Regular',
  },
});