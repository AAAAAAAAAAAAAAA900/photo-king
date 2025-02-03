import { Component } from 'react';
import { SafeAreaView, TextInput } from 'react-native';
import DefaultText from './DefaultText';

export default class Input extends Component {
    constructor(){
        super();
    }
    render() {
      return (
        <SafeAreaView style={styles.inputContainer}>
            <TextInput
                style={styles.textIn}
                onChangeText={this.props.userUpdate}
                autoCapitalize ='none'
                autoCorrect ={false}
                placeholder="Enter username"
            />
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