import {View, Text, SafeAreaView, Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ImageBackground, Keyboard, TouchableWithoutFeedback, TextInput, Image} from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { colors } from '../styles/ComponentStyles.js';
import DefaultText from '../components/DefaultText.js';
import * as SecureStore from "expo-secure-store";
import authApi from "../api/authApi";
import userApi from "../api/userApi";
import * as AppleAuthentication from 'expo-apple-authentication';
import {isTokenValid} from "../api/apiClient";
import { Controller, useForm } from 'react-hook-form';


export default function LoginScreen ({navigation}){
  // Login screen logic: store username and password
  const [loading, setLoading] = useState(true);
  const { 
    control,
    handleSubmit,
    formState: { 
        errors
    },
  } = useForm();

  // Login attempt
  const login = async (username, password) => {
    try {
      const response = await authApi.login(username, password);
      await SecureStore.setItemAsync("accessToken", response.data.accessToken);
      await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);
      const user_info = await userApi.getUserInfo();

      navigation.navigate("Home", {user: user_info.data});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken && await isTokenValid(refreshToken)) {
          const user_info = await userApi.getUserInfo();
          navigation.navigate("Home", {user: user_info.data});
        }
      } catch (error) {
        console.log(error);
      } finally{
        setLoading(false);
      }
    };
    checkLoginStatus().then();
  }, []);

  if (loading) {
    return (
        <SafeAreaView style={styles.containerCenterAll}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
    );
  }

  const onSubmit = (data) =>{
    login(data.username, data.password);
  };

  // Login screen view
  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView  style={styles.container}>
        <ImageBackground 
          resizeMode='stretch' 
          source={require('../../assets/backgrounds/LoginBackground.png')}
          style={styles.containerCenterAll}
        >
          <KeyboardAvoidingView behavior='padding' style={styles.containerCenterAll}>
          {/*<Image style={[styles.iconStyle, {height:60, width:300}]} source={require('../../assets/icons/title.png')}/>*/}
            <View style={styles.inputContainer} >
              <View style={{flexDirection:'row', width:250, height:40, alignItems:'center', backgroundColor:colors.greyWhite, borderRadius:5}}>
                <Image style={[styles.iconStyle, {width:'10%', marginLeft:5}]} source={require('../../assets/icons/username.png')}/>
                <Controller
                name="username"
                control={control}
                rules={{ required: "Please enter a username." }}
                render={({ field : { onChange, value} }) => (
                  <TextInput
                  placeholder={'Enter username...'}
                  maxLength={20}
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  style={[styles.textIn, {width:200}]}
                  />
                )}/>
              </View>
              <View style={{flexDirection:'row', width:250, height:40, alignItems:'center', backgroundColor:colors.greyWhite, borderRadius:5}}>
                <Image style={[styles.iconStyle, {width:'10%', marginLeft:5}]} source={require('../../assets/icons/password.png')}/>
                <Controller
                name="password"
                control={control}
                rules={{ required: "Please enter a password." }}
                render={({ field : { onChange, value} }) => (
                  <TextInput
                  inlineImageLeft=''
                  placeholder={'Enter password...'}
                  maxLength={128}
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  style={[styles.textIn, {width:200}]}
                  />
                )}/>
              </View>
              {errors.username && <DefaultText style={{color:"red"}}>{errors.username.message}</DefaultText>}
              {errors.password && <DefaultText style={{color:"red"}}>{errors.password.message}</DefaultText>}
              <TouchableOpacity style={{width: 250, height:40, marginTop:30, borderRadius:20, backgroundColor: colors.secondary, alignItems:'center', justifyContent:'center'}} onPress={handleSubmit(onSubmit)}>
                <DefaultText style={[styles.bold, {color:'white'}]}>Sign In</DefaultText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
                <Text style={styles.urlText}>create an account</Text>
              </TouchableOpacity>
              { Platform.OS == 'ios' &&
                <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
                    cornerRadius={20}
                    style={{width:250, height:40}}
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
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
