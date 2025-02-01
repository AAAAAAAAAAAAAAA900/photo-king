import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Component } from 'react';

function LoginScreen (){
  // Login screen logic: store username and password
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  
  // Login screen view
  return(
    <SafeAreaView style={styles.container}>
      <Text margin={10}>Username</Text>
      <TextInput
        style={{height: 60, borderColor: 'red', 
                borderWidth: 1, margin:10, fontSize:25,}}
        onChangeText={setUsername}
        autoCapitalize ='none'
        autoCorrect ={false}
        placeholder="Enter username"
      />
      <Text margin={10}>Password</Text>
      <TextInput
        style={{height: 60, borderColor: 'red', 
                borderWidth: 1, margin:10, fontSize:25,}}
        onChangeText={setPassword}
        autoCapitalize ='none'
        autoCorrect ={false}
        placeholder="Enter password"
        secureTextEntry={true}
      />
      <TouchableOpacity style={styles.button} onPress={logIn}>
        <Text>Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


// Sets up stack navigator
const RootStack = createNativeStackNavigator({
  initialRouteName: 'Login',
  screens: {
    Login: LoginScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  button: {
    height:40, 
    width:90, 
    margin:10,
    backgroundColor: 'dodgerblue',
    alignItems: 'center',
    justifyContent: 'center',
  }
});