import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, SafeAreaView, TextInput, TouchableOpacity, View, Keyboard, Modal } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";
import { useState, useEffect, useRef } from "react";
import TitleButtons from "../components/TitleButtons";
import Header from "../components/Header";
import photoGroupApi from "../api/photoGroupApi";
import { useForm, Controller } from 'react-hook-form';
import userApi from "../api/userApi";
import { color } from "@rneui/themed/dist/config";

export default function ProfileScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [userUpdated, setUserUpdated] = useState(false);
    const [bio, setBio] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bioFocussed, setBioFocussed] = useState(false);
    const bioRef = useRef(null);
    const [nameFocussed, setNameFocussed] = useState(false);
    const nameRef = useRef(null);

    const getBio = async () => {
        try{
            const userBio = await userApi.getBio(user.id);   
            setBio(userBio.data);
        }
        catch(error){
            console.log(error);
        }
    }

    const setProfile = async (data) => {
        try{
            const response = await userApi.setProfile(user.id, data.username, data.name, data.bio);
            return response.data;
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=> {
        getBio();

        const onKeyboardClose = () =>{
            nameRef.current.blur();
            bioRef.current.blur();
        };

        const listener = Keyboard.addListener("keyboardDidHide", onKeyboardClose);
        return () => {listener.remove();};
    }, []);

    useEffect(() =>{
        if(bio){
            reset({username: user.username, name: user.name, bio:bio});
            setLoading(false);
        }
    }, [bio]);

    const getGroups = async () => {
        try {
            let groups = await photoGroupApi.getGroupsByUserId(user.id);
            return groups.data;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if(userUpdated){
            setUserUpdated(false);
            getGroups().then((groups) => setUser({...user, groups: groups}));
        }
    }, [userUpdated]);

    const { 
        control,
        handleSubmit,
        formState: { 
            errors
        },
        reset
    } = useForm();

    const onSubmit = (data) => {
        setProfile(data);
        setUser({...user, username: data.username, name: data.name});
        setBio(data.bio);
        setUserUpdated(true);
        setSubmitted(true);
        reset({
            username: data.username,
            name: data.name,
            bio: data.bio
        });
    }

    return(

        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{flex:1}}> 
                <Header border={true} title={'Profile'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>
                {loading ?
                    <View style={[styles.containerCenterAll, {backgroundColor:colors.greyWhite}]}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                : 
                    <View style={{flex:1, alignItems:"center", backgroundColor:colors.greyWhite}}>
                        <View style={{alignSelf:"center", marginVertical:10}}>
                            <Pfp user={user} setUser={setUser} setUserUpdated={setUserUpdated} url={user.profileUrl} size={120} borderWidth={4}/>
                            <View style={{position:'absolute', pointerEvents:"none", alignItems:"center", justifyContent:"center", borderRadius:5,backgroundColor: colors.greyWhite, borderWidth:4, bottom:0, right:0, height:40, width:40}}>
                                <Image style={styles.iconStyle} source={require('../../assets/icons/edit.png')}/>
                            </View>
                        </View>
                        <View style={{flex:1, width:'100%', alignItems:"center", justifyContent:"space-between"}}>
                            { (bioFocussed || nameFocussed) && <View style={[(bioFocussed ? {zIndex:4} : {zIndex:3} ), {position:"absolute", height:'100%', width:'100%', backgroundColor: colors.greyWhite}]}/>}
                            <View>
                                <DefaultText style={{marginLeft:4}}>Username</DefaultText>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{ required: "Username is required." }}
                                    render={({ field : { onChange, value} }) => (
                                        <TextInput
                                        placeholder={user.username}
                                        maxLength={20}
                                        autoCorrect={false}
                                        value={value}
                                        onChangeText={onChange}
                                        style={styles.textIn}
                                        />
                                    )}
                                />
                            </View>
                            <KeyboardAvoidingView style={{zIndex:3}} enabled={nameFocussed} behavior="position" keyboardVerticalOffset={300}>
                                <DefaultText style={{marginLeft:4}}>Name</DefaultText>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: "Name is required" }}
                                    render={({ field : { onChange, value} }) => (
                                        <TextInput
                                        ref={nameRef}
                                        placeholder={user.name}
                                        maxLength={30}
                                        autoCorrect={false}
                                        onFocus={()=> setNameFocussed(true)}
                                        onEndEditing={()=> setNameFocussed(false)}
                                        value={value}
                                        onChangeText={onChange}
                                        style={styles.textIn}
                                        />
                                    )}
                                />
                            </KeyboardAvoidingView>
                            <KeyboardAvoidingView style={{zIndex:4}} enabled={bioFocussed} behavior="position" keyboardVerticalOffset={265}>
                                <DefaultText style={{marginLeft:4}}>Message</DefaultText>
                                <Controller
                                    name="bio"
                                    control={control}
                                    render={({ field : { onChange, value} }) => (
                                        <TextInput
                                        ref={bioRef}
                                        placeholder={bio ? bio : "Add bio..."}
                                        maxLength={100}
                                        multiline={true}
                                        onFocus={()=> setBioFocussed(true)}
                                        onEndEditing={()=> setBioFocussed(false)}
                                        value={value}
                                        onChangeText={onChange}
                                        style={[styles.textIn, {height:100 , textAlignVertical:"top", marginBottom:5}]}
                                        />
                                    )}
                                />
                            </KeyboardAvoidingView>
                            {errors.username && <DefaultText style={{color:"red"}}>{errors.username.message}</DefaultText>}
                            {errors.name && <DefaultText style={{color:"red"}}>{errors.name.message}</DefaultText>}
                            {submitted && <DefaultText style={{color:"green"}}>Profile Updated</DefaultText>}

                            <View style={{height:60, width:'100%', padding:8, justifyContent:"center", alignItems:"center", backgroundColor:colors.primary}}>
                                <TouchableOpacity style={{height:'100%', width:'100%', borderRadius:10, borderWidth:2, alignItems:"center", justifyContent:"center",borderColor:colors.secondary, backgroundColor:colors.secondary}}
                                onPress={()=> handleSubmit(onSubmit)}
                                >
                                    <DefaultText style={[styles.bold, {color:'white'}]} >Submit</DefaultText>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                } 
                <NavBar navigation={navigation} user={user} screen='Profile'/>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}