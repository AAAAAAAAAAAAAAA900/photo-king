import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import authApi from "../api/authApi";
import Header from '../components/Header.js';
import DefaultText from '../components/DefaultText.js';
import styles, { colors } from '../styles/ComponentStyles.js';


export default function RegisterScreen({ navigation }) {
    const screenWidth = Dimensions.get('window').width;
    const {
        control,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm();

    const onSubmit = (data) => {
        try {
            authApi.register(data).then(r => navigation.navigate("Login"));
        } catch (e) {
            console.log(e);
        }
    }


    // Login screen view
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{ flex: 1, backgroundColor:colors.secondary}}>
                <Header height={60} />
                <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>

                    {/* PAGE TITLE */}
                    <DefaultText style={[styles.bold, { fontSize: 40, paddingVertical: 30 }]}>Register</DefaultText>

                    <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={80}>
                        <View style={{ alignItems: 'center', backgroundColor: 'white' }}>
                            {/* USERNAME */}
                            <View style={registerStyles.inputContainer}>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter username..."
                                            maxLength={20}
                                            value={value}
                                            autoCorrect={false}
                                            onChangeText={onChange}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>

                            {/* PASSWORD */}
                            <View style={registerStyles.inputContainer}>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter password..."
                                            value={value}
                                            maxLength={128}
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            onChangeText={onChange}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>

                            {/* EMAIL */}
                            <View style={registerStyles.inputContainer}>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter email..."
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>

                            {/* NAME */}
                            <View style={registerStyles.inputContainer}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter name..."
                                            value={value}
                                            onChangeText={onChange}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>

                            {/* PHONE NUMBER */}
                            <View style={registerStyles.inputContainer}>
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: "This field is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder="Enter phone number..."
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType='numeric'
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    {/* SUBMIT BUTTON */}
                    <TouchableOpacity style={{ width: 250, height: 40, marginVertical: 20, alignSelf: 'center', borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}
                        onPress={handleSubmit(onSubmit)}>
                        <DefaultText style={styles.buttonText}>Register</DefaultText>
                    </TouchableOpacity>

                    {/* LOG IN */}
                    <View style={{ flexDirection: 'row' }}>
                        <DefaultText style={{ color: '#999999' }}>Already have an accout? </DefaultText>
                        <TouchableOpacity onPress={() => { navigation.popToTop() }}>
                            <DefaultText style={styles.urlText}>Sign in!</DefaultText>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ position: 'absolute', bottom: -100, left: -screenWidth / 2, backgroundColor: colors.primary, width: screenWidth, height: 200, transform: [{ rotate: '20deg' }] }} />
                <View style={{ position: 'absolute', bottom: -100, right: -screenWidth / 2, backgroundColor: colors.primary, width: screenWidth, height: 200, transform: [{ rotate: '-20deg' }] }} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );

}


const registerStyles = StyleSheet.create({
    inputContainer: {
        paddingBottom: 20,
        alignItems: 'center'
    },
});