import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { Alert, Image, SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";
import { useState, useEffect } from "react";
import TitleButtons from "../components/TitleButtons";
import Header from "../components/Header";
import photoGroupApi from "../api/photoGroupApi";
import { useForm, Controller } from 'react-hook-form';
import userApi from "../api/userApi";

export default function ProfileScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [userUpdated, setUserUpdated] = useState(false);
    const [bio, setBio] = useState("");

    const getBio = async () => {
        try{
            const userBio = await userApi.getBio(user.id);   
            setBio(userBio.data);
        }
        catch(error){
            console.log(error);
            return null;
        }
    }

    const setProfile = async (data) => {
        try{
            const response = await userApi.setProfile(user.id, data.username, data.name, data.bio);
            console.log(response.data);
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(()=> {
        getBio();
    }, []);

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
    } = useForm({defaultValues: {
        username: user.username,
        name: user.name,
        bio: bio
    }});

    const onSubmit = (data) => {
        console.log(data);
        setProfile(data);
        reset();
    }

    return(
        <SafeAreaView style={{flex:1}}>
            <Header border={true} title={'Profile'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>
            <View style={{flex:1, padding: 15, justifyContent:"space-between", alignItems:"center"}}>
                <View style={{alignSelf:"center"}}>
                    <Pfp user={user} setUser={setUser} setUserUpdated={setUserUpdated} url={user.profileUrl} size={120}/>
                    <View style={{position:'absolute', pointerEvents:"none", alignItems:"center", justifyContent:"center", borderRadius:5,backgroundColor: colors.greyWhite, borderWidth:4, bottom:0, right:0, height:40, width:40}}>
                        <Image style={styles.iconStyle} source={require('../../assets/icons/edit.png')}/>
                    </View>
                </View>
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
                <View>
                    <DefaultText style={{marginLeft:4}}>Name</DefaultText>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field : { onChange, value} }) => (
                            <TextInput
                            placeholder={user.name}
                            maxLength={30}
                            autoCorrect={false}
                            value={value}
                            onChangeText={onChange}
                            style={styles.textIn}
                            />
                        )}
                    />
                </View>
                <View>
                    <DefaultText style={{marginLeft:4}}>Message</DefaultText>
                    <Controller
                        name="bio"
                        control={control}
                        render={({ field : { onChange, value} }) => (
                            <TextInput
                            placeholder={bio ? bio : "Add bio..."}
                            maxLength={100}
                            multiline={true}
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textIn, {height:100 , textAlignVertical:"top", marginBottom:5}]}
                            />
                        )}
                    />
                </View>
                <TouchableOpacity style={styles.button}
                onPress={handleSubmit(onSubmit)}
                >
                    <DefaultText>Submit</DefaultText>
                </TouchableOpacity>
            </View>
            <NavBar navigation={navigation} user={user} screen='Profile'/>
        </SafeAreaView>
    );
}