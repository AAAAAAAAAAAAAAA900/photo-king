import { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

export default class Input extends Component {
    constructor(){
        super();
    }
    render() {
      return (
        <SafeAreaView style={styles.inputContainer}>
            <Text>Username</Text>
            <TextInput
                style={styles.textIn}
                onChangeText={this.props.userUpdate}
                autoCapitalize ='none'
                autoCorrect ={false}
                placeholder="Enter username"
            />
            <Text>Password</Text>
            <TextInput
                style={styles.textIn}
                onChangeText={this.props.passUpdate}
                autoCapitalize ='none'
                autoCorrect ={false}
                placeholder="Enter password"
                secureTextEntry={true}
            />
        </SafeAreaView>
      );
    }
}