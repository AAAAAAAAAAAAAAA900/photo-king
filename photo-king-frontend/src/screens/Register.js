import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Button, ScrollView, TouchableWithoutFeedback, Keyboard, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import authApi from "../api/authApi";
import Header from '../components/Header.js';
import DefaultText from '../components/DefaultText.js';
import styles, { colors } from '../styles/ComponentStyles.js';


export default function RegisterScreen({ navigation }) {
    const screenWidth = Dimensions.get('window').width;
    const [errorMsg, setErrorMsg] = useState('');
    const {
        control,
        handleSubmit,
        formState: {
            errors
        },
        clearErrors
    } = useForm({reValidateMode: 'onSubmit'});

    const onSubmit = async (data) => {
        try {
            const response = await authApi.register(data).then(r => navigation.navigate("Login"));
        } catch (e) {
            setErrorMsg(e.response.data);
        }
    }

    const onChangeText = ()=>{
        setErrorMsg("");
        clearErrors();
    }

    // Login screen view
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.secondary }}>
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
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
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
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
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
                                            autoCorrect={false}
                                            maxLength={320}
                                            autoCapitalize='none'
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
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
                                            maxLength={30}
                                            autoCorrect={false}
                                            autoCapitalize='none'
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
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
                                            autoCorrect={false}
                                            autoCapitalize='none'
                                            maxLength={20}
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
                                            keyboardType='numeric'
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    {/* SUBMIT BUTTON */}
                    <View style={{alignItems:'center'}}>
                        {errorMsg && <DefaultText style={{color:'red'}}>{errorMsg}</DefaultText>}
                        {(errors.username?.message || errors.password?.message || errors.email?.message || errors.name?.message || errors.phone?.message) &&
                        <DefaultText style={{color:'red'}}>All fields are required.</DefaultText>}
                        <TouchableOpacity style={{ width: 250, height: 40, marginVertical: 20, alignSelf: 'center', borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }}
                            onPress={handleSubmit(onSubmit)}>
                            <DefaultText style={styles.buttonText}>Register</DefaultText>
                        </TouchableOpacity>
                    </View>

                    {/* NAVIGATE BACK TO LOG IN */}
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