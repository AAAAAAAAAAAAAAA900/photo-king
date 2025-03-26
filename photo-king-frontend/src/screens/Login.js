import { View, Text, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ImageBackground, Keyboard, TouchableWithoutFeedback, TextInput, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { colors } from '../styles/ComponentStyles.js';
import DefaultText from '../components/DefaultText.js';
import * as SecureStore from "expo-secure-store";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import * as AppleAuthentication from 'expo-apple-authentication';
import { isTokenValid } from "../api/apiClient";
import { Controller, useForm } from 'react-hook-form';


export default function LoginScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [loginError, setLoginError] = useState("");
    const {
        control,
        handleSubmit,
    } = useForm();

    // Login attempt
    const login = async (username, password) => {
        try {
            const response = await authApi.login(username, password);
            await SecureStore.setItemAsync("accessToken", response.data.accessToken);
            await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
            const user_info = await userApi.getUserInfo();

            navigation.navigate("Home", { user: user_info.data });
        } catch (error) {
            setLoginError("Check username or password.");
            console.log(error);
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

    // Login screen view
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={[styles.container, {backgroundColor:colors.secondary}]}>
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
                        <View style={styles.inputContainer} >

                            {/* USERNAME INPUT */}
                            <View style={{ flexDirection: 'row', width: 250, height: 40, alignItems: 'center', backgroundColor: colors.greyWhite, borderRadius: 5 }}>
                                <Image style={[styles.iconStyle, { width: '10%', marginLeft: 5 }]} source={require('../../assets/icons/username.png')} />
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
                                            onChangeText={(txt) => { onChange(txt); setLoginError(""); }}
                                            style={[styles.textIn, { width: 200 }]}
                                        />
                                    )} />
                            </View>

                            {/* PASSWORD INPUT */}
                            <View style={{ flexDirection: 'row', width: 250, height: 40, alignItems: 'center', backgroundColor: colors.greyWhite, borderRadius: 5 }}>
                                <Image style={[styles.iconStyle, { width: '10%', marginLeft: 5 }]} source={require('../../assets/icons/password.png')} />
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
                                            onChangeText={(txt) => { onChange(txt); setLoginError(""); }}
                                            style={[styles.textIn, { width: 200 }]}
                                        />
                                    )} />
                            </View>

                            {/* ERROR DISPLAY */}
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {loginError && <DefaultText style={{ color: "red" }}>{loginError}</DefaultText>}
                            </View>

                            {/* SUBMIT BUTTON */}
                            <TouchableOpacity style={[
                                loginError ? { marginTop: 10 } : { marginTop: 30 },
                                { width: 250, height: 40, borderRadius: 20, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' }]}
                                onPress={handleSubmit(onSubmit)}>
                                <DefaultText style={styles.buttonText}>Sign In</DefaultText>
                            </TouchableOpacity>

                            {/* DIVIDERS */}
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, width: 250, padding: 10 }}>
                                <View style={{ height: 1, flex: 1, backgroundColor: '#999999' }} />
                                <DefaultText style={{ color: '#999999' }}>OR</DefaultText>
                                <View style={{ height: 1, flex: 1, backgroundColor: '#999999' }} />
                            </View>

                            {/* 'SIGN IN WITH...' OPTIONS */}
                            {Platform.OS == 'ios' &&
                                <AppleAuthentication.AppleAuthenticationButton
                                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
                                    cornerRadius={20}
                                    style={{ width: 250, height: 40 }}
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
                            <View style={{flexDirection:'row'}}>
                                <DefaultText style={{color:'#999999'}}>Don't have an accout? </DefaultText>
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
