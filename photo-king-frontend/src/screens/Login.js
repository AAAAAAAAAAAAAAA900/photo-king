import { View, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ImageBackground, Keyboard, TouchableWithoutFeedback, TextInput, Image, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import styles, { colors } from '../styles/ComponentStyles.js';
import DefaultText from '../components/DefaultText.js';
import * as SecureStore from "expo-secure-store";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import * as AppleAuthentication from 'expo-apple-authentication';
import { isTokenValid } from "../api/apiClient";
import { Controller, useForm } from 'react-hook-form';
import { StackActions } from '@react-navigation/native';


export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState("");
    const {
        control,
        handleSubmit,
        formState: { errors },
        clearErrors,
    } = useForm({ reValidateMode: "onSubmit" });


    // Login attempt
    const login = async (username, password) => {
        try {
            const response = await authApi.login(username, password);
            await SecureStore.setItemAsync("accessToken", response.data.accessToken);
            await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
            const user_info = await userApi.getUserInfo();
            navigation.navigate("Home", { user: user_info.data });
        } catch (error) {
            setLoginError(error.response.data ? "Check username or password" : "");
        }
    }

    // auto login
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const refreshToken = await SecureStore.getItemAsync("refreshToken");
                if (refreshToken && await isTokenValid(refreshToken)) {
                    const user_info = await userApi.getUserInfo();
                    navigation.navigate("Home", { user: user_info.data });
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        checkLoginStatus().then();
    }, []);

    const onSubmit = (data) => {
        Keyboard.dismiss();
        login(data.username, data.password);
    };

    // loading indicator blocking screen
    if (loading) {
        return (
            <SafeAreaView style={styles.containerCenterAll}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    const onChangeText = () => {
        setLoginError("");
        clearErrors();
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <ImageBackground
                    resizeMode='stretch'
                    source={require('../../assets/backgrounds/LoginBackground.png')}
                    style={styles.containerCenterAll}
                >
                    <KeyboardAvoidingView
                        keyboardVerticalOffset={-200}
                        behavior='padding'
                        style={styles.containerCenterAll}>
                        {/*<Image style={[styles.iconStyle, {height:60, width:300}]} source={require('../../assets/icons/title.png')}/>*/}
                        <View style={loginStyles.inputContainer} >

                            {/* USERNAME INPUT */}
                            <View style={loginStyles.inputWithIcon}>
                                <Image style={loginStyles.inLineIcon} source={require('../../assets/icons/username.png')} />
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "Please enter a username." }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder={'Enter username...'}
                                            maxLength={20}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            value={value}
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
                                            style={loginStyles.textIn}
                                        />
                                    )} />
                            </View>

                            {/* PASSWORD INPUT */}
                            <View style={loginStyles.inputWithIcon}>
                                <Image style={loginStyles.inLineIcon} source={require('../../assets/icons/password.png')} />
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{ required: "Please enter a password." }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder={'Enter password...'}
                                            autoCapitalize='none'
                                            maxLength={128}
                                            autoCorrect={false}
                                            secureTextEntry={true}
                                            value={value}
                                            onChangeText={(txt) => { onChange(txt); onChangeText(); }}
                                            style={loginStyles.textIn}
                                        />
                                    )} />
                            </View>

                            {/* ERROR DISPLAY */}
                            <View style={loginStyles.errorTextContainer}>
                                {errors.username?.message && <DefaultText style={loginStyles.errorText}>{errors.username.message}</DefaultText>}
                                {errors.password?.message && <DefaultText style={loginStyles.errorText}>{errors.password.message}</DefaultText>}
                                {loginError && <DefaultText style={loginStyles.errorText}>{loginError}</DefaultText>}
                            </View>

                            {/* SUBMIT BUTTON */}
                            <TouchableOpacity style={[
                                loginError || errors.password?.message || errors.username?.message ? { marginTop: 10 } : { marginTop: 30 },
                                loginStyles.loginButton]}
                                onPress={handleSubmit(onSubmit)}>
                                <DefaultText style={styles.buttonText}>Sign In</DefaultText>
                            </TouchableOpacity>

                            {/* DIVIDERS */}
                            <View style={loginStyles.dividerContainer}>
                                <View style={loginStyles.divider} />
                                <DefaultText style={loginStyles.greyText}>OR</DefaultText>
                                <View style={loginStyles.divider} />
                            </View>

                            {/* 'SIGN IN WITH...' OPTIONS */}
                            {Platform.OS == 'ios' &&
                                <AppleAuthentication.AppleAuthenticationButton
                                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
                                    cornerRadius={20}
                                    style={loginStyles.signInWith}
                                    onPress={async () => {
                                        try {
                                            const credential = await AppleAuthentication.signInAsync();
                                            const { identityToken } = credential;
                                            console.log(identityToken);

                                            // signed in
                                        } catch (e) {
                                            if (e.code === 'ERR_REQUEST_CANCELED') {
                                                // handle that the user canceled the sign-in flow
                                            } else {
                                                // handle other errors
                                            }
                                        }
                                    }}
                                />
                            }

                            {/* SIGN UP BUTTON */}
                            <View style={loginStyles.signUpContainer}>
                                <DefaultText style={loginStyles.greyText}>Don't have an accout? </DefaultText>
                                <TouchableOpacity onPress={() => { navigation.navigate("Register") }}>
                                    <DefaultText style={styles.urlText}>Sign up!</DefaultText>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export async function getUser(setUser = null, navigation = null) {
    try {
        const response = await userApi.getUserInfo();
        if (setUser) {
            setUser(response.data);
        }
        return response.data;
    }
    catch (error) {
        console.log(error);
        if (navigation) {
            navigation.dispatch(StackActions.popToTop());
        }
        return null;
    }
}

const loginStyles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        rowGap: 20,
        padding: 30,
        alignItems: 'center',
        boxShadow: '5 5 5 0 rgba(0, 0, 0, 0.25)',
        borderRadius: 10
    },
    inputWithIcon:{ 
        flexDirection: 'row', 
        width: 250, 
        height: 40, 
        alignItems: 'center', 
        backgroundColor: colors.greyWhite, 
        borderRadius: 5 
    },
    inLineIcon:[
        styles.iconStyle, 
        { 
            width: '10%', 
            marginLeft: 5 
        }
    ],
    textIn:[
        styles.textIn, 
        { width: 200 

        }
    ],
    errorTextContainer:{ 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    errorText:{
        color:'red'
    },
    loginButton:{
        width: 250, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: colors.secondary, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    dividerContainer:{
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, 
        width: 250, 
        padding: 10
    },
    divider:{ 
        height: 1, 
        flex: 1, 
        backgroundColor: '#999999' 
    },
    greyText:{
        color: '#999999'
    },
    signInWith:{
        width: 250, 
        height: 40 
    },
    signUpContainer:{
        flexDirection:'row'
    }
});