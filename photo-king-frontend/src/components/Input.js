import { Component } from 'react';
import { Text, SafeAreaView, TextInput } from 'react-native';
import DefaultText from './DefaultText';

export default class Input extends Component {
    constructor(){
        super();
    }
    render() {
      return (
        <SafeAreaView style={styles.inputContainer}>
            <DefaultText>Username</DefaultText>
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