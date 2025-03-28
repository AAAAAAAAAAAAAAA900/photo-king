import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { ActivityIndicator, Image, KeyboardAvoidingView, TouchableWithoutFeedback, SafeAreaView, TextInput, TouchableOpacity, View, Keyboard, StyleSheet } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";
import { useState, useEffect, useRef } from "react";
import TitleButtons from "../components/TitleButtons";
import Header from "../components/Header";
import { useForm, Controller } from 'react-hook-form';
import userApi from "../api/userApi";
import { getUser } from "./Login";

export default function ProfileScreen({ navigation }) {
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [bio, setBio] = useState(undefined);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bioFocussed, setBioFocussed] = useState(false);
    const bioRef = useRef(null);
    const [nameFocussed, setNameFocussed] = useState(false);
    const nameRef = useRef(null);

    const getBio = async () => {
        try {
            const userBio = await userApi.getBio(user.id);
            setBio(userBio.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const setProfile = async (data) => {
        try {
            await userApi.setProfile(user.id, data.username, data.name, data.bio);
            await getUser(setUser, navigation);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getBio();

        // unselect text inputs on keyboard close because keyboard avoid persists until unselect
        const onKeyboardClose = () => {
            nameRef.current.blur();
            bioRef.current.blur();
        };

        const listener = Keyboard.addListener("keyboardDidHide", onKeyboardClose);
        return () => { listener.remove(); };
    }, []);

    useEffect(() => {
        if (bio !== undefined) {
            reset({ username: user.username, name: user.name, bio: bio || "" });
            setLoading(false);
        }
    }, [bio]);

    const {
        control,
        handleSubmit,
        formState: {
            errors
        },
        clearErrors,
        reset
    } = useForm({reValidateMode:'onSubmit'});

    const onSubmit = (data) => {
        setProfile(data);
        setBio(data.bio);
        setSubmitted(true);
        reset({
            username: data.username,
            name: data.name,
            bio: data.bio
        });
    }

    const onChangeText = ()=>{
        setSubmitted(false);
        clearErrors();
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <Header border={true} title={'Profile'} buttons={<TitleButtons navigation={navigation} user={user} />} />

                {loading ?
                    <View style={profileStyles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                    :
                    <View style={profileStyles.profileContainer}>
                        <View style={profileStyles.pfpContainer}>
                            {/* PROFILE PHOTO */}
                            <Pfp user={user} setUser={setUser} url={user.profileUrl} size={120} borderWidth={4} />
                            <View style={profileStyles.pfpEditableIconContainer}>
                                <Image style={styles.iconStyle} source={require('../../assets/icons/edit.png')} />
                            </View>
                        </View>
                        <View style={profileStyles.textInputsContainer}>
                            {/* background blocks pfp for text inputs to slide up and avoid keyboard */}
                            {(bioFocussed || nameFocussed) && <View style={[(bioFocussed ? { zIndex: 4 } : { zIndex: 3 }), profileStyles.toggleableBackground]} />}
                            <View>

                                {/* USERNAME INPUT */}
                                <DefaultText style={profileStyles.textLabel}>Username</DefaultText>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "Username is required." }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            placeholder={user.username}
                                            maxLength={20}
                                            autoCorrect={false}
                                            value={value}
                                            onChangeText={(text) => {onChange(text); onChangeText();}}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>

                            {/* NAME INPUT */}
                            <KeyboardAvoidingView style={profileStyles.nameKeyboardAvoidingView} enabled={nameFocussed} behavior="position" keyboardVerticalOffset={300}>
                                <DefaultText style={profileStyles.textLabel}>Name</DefaultText>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: "Name is required" }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            ref={nameRef}
                                            placeholder={user.name}
                                            maxLength={30}
                                            autoCorrect={false}
                                            onFocus={() => setNameFocussed(true)}
                                            onEndEditing={() => setNameFocussed(false)}
                                            value={value}
                                            onChangeText={(text) => {onChange(text); onChangeText();}}
                                            style={styles.textIn}
                                        />
                                    )}
                                />
                            </KeyboardAvoidingView>

                            {/* BIO INPUT */}
                            <KeyboardAvoidingView style={profileStyles.bioKeyboardAvoidingView} enabled={bioFocussed} behavior="position" keyboardVerticalOffset={265}>
                                <DefaultText style={profileStyles.textLabel}>Message</DefaultText>
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            ref={bioRef}
                                            placeholder={bio ? bio : "Add bio..."}
                                            maxLength={100}
                                            multiline={true}
                                            onFocus={() => setBioFocussed(true)}
                                            onEndEditing={() => setBioFocussed(false)}
                                            value={value}
                                            onChangeText={(text) => {onChange(text); onChangeText();}}
                                            style={profileStyles.largeTextInput}
                                        />
                                    )}
                                />
                            </KeyboardAvoidingView>

                            {/* ERROR/SUCCESS MESSAGES */}
                            {errors.username && <DefaultText style={profileStyles.errorMsg}>{errors.username.message}</DefaultText>}
                            {errors.name && <DefaultText style={profileStyles.errorMsg}>{errors.name.message}</DefaultText>}
                            {submitted && <DefaultText style={profileStyles.successMsg}>Profile Updated</DefaultText>}

                            {/* SUBMIT BUTTON */}
                            <View style={profileStyles.submitButtonContainer}>
                                <TouchableOpacity style={profileStyles.submitButton}
                                    onPress={handleSubmit(onSubmit)}
                                >
                                    <DefaultText style={styles.buttonText} >Submit</DefaultText>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                }
                <NavBar navigation={navigation} user={user} screen='Profile' />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const profileStyles = StyleSheet.create({
    loadingContainer:[
        styles.containerCenterAll, 
        { 
            backgroundColor: 'white' 
        }
    ],
    profileContainer:{ 
        flex: 1,
        alignItems: "center", 
        backgroundColor: 'white' 
    },
    pfpContainer:{ 
        alignSelf: "center", 
        marginVertical: 10 
    },
    pfpEditableIconContainer:{ 
        position: 'absolute', 
        pointerEvents: "none", 
        alignItems: "center", 
        justifyContent: "center",
        borderRadius: 5, 
        backgroundColor: colors.greyWhite, 
        borderWidth: 4, 
        bottom: 0, 
        right: 0, 
        height: 40,
        width: 40 
    },
    textInputsContainer:{ 
        flex: 1, 
        width: '100%', 
        alignItems: "center", 
        justifyContent: "space-between" 
    },
    toggleableBackground:{ 
        position: "absolute", 
        height: '100%', 
        width: '100%', 
        backgroundColor: 'white' 
    },
    textLabel:{ 
        marginLeft: 4 
    },
    nameKeyboardAvoidingView:{ 
        zIndex: 3 
    },
    bioKeyboardAvoidingView:{ 
        zIndex: 4 
    },
    largeTextInput:[
        styles.textIn, 
        { 
            height: 100, 
            textAlignVertical: "top", 
            marginBottom: 5 
        }
    ],
    errorMsg:{ 
        color: "red" 
    },
    successMsg:{ 
        color: "green" 
    },
    submitButtonContainer:{ 
        height: 60, 
        width: '100%', 
        padding: 8, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: colors.primary 
    },
    submitButton:{ 
        height: '100%', 
        width: '100%', 
        borderRadius: 10, 
        borderWidth: 2, 
        alignItems: "center", 
        justifyContent: "center", 
        borderColor: colors.secondary, 
        backgroundColor: colors.secondary 
    }
});