import { useRoute } from "@react-navigation/native";
import DefaultText from "../components/DefaultText";
import { Image, SafeAreaView, TextInput, TouchableOpacity, View } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import NavBar from "../components/NavBar";
import Pfp from "../components/Pfp";
import { useState, useEffect } from "react";
import TitleButtons from "../components/TitleButtons";
import Header from "../components/Header";
import photoGroupApi from "../api/photoGroupApi";
import { useForm, Controller } from 'react-hook-form';


export default function ProfileScreen({navigation}){
    const route = useRoute();
    const [user, setUser] = useState(route.params?.user);
    const [userUpdated, setUserUpdated] = useState(false);

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
        }
    } = useForm();

    const onSubmit = data => {

    }

    return(
        <SafeAreaView style={{flex:1}}>
            <Header border={true} title={'Profile'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>
            <View style={{flex:1, padding: 10}}>
                <View style={{alignSelf:"baseline"}}>
                    <Pfp user={user} setUser={setUser} setUserUpdated={setUserUpdated} url={user.profileUrl} size={175}/>
                    <View style={{position:'absolute', pointerEvents:"none", alignItems:"center", justifyContent:"center", borderRadius:5,backgroundColor: colors.greyWhite, borderWidth:4, bottom:5, right:10, height:40, width:40}}>
                        <Image style={styles.iconStyle} source={require('../../assets/icons/edit.png')}/>
                    </View>
                </View>
                <View style={{flex:1, paddingHorizontal:15, paddingTop:10, gap:1}}>
                    <DefaultText style={{marginLeft:10}}>Username</DefaultText>
                    <Controller
                        name="username"
                        control={control}
                        render={({ field : { onChange, value} }) => (
                            <TextInput
                            placeholder={user.username}
                            maxLength={20}
                            autoCorrect={false}
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textIn, {alignSelf:"center", marginBottom:5}]}
                            />
                        )}
                    />
                    <DefaultText style={{marginLeft:10}}>Name</DefaultText>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field : { onChange, value} }) => (
                            <TextInput
                            placeholder={user.name}
                            maxLength={30}
                            autoCorrect={false}
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textIn, {alignSelf:"center", marginBottom:5}]}
                            />
                        )}
                    />
                    <DefaultText style={{marginLeft:10}}>Message</DefaultText>
                    <Controller
                        name="bio"
                        control={control}
                        render={({ field : { onChange, value} }) => (
                            <TextInput
                            placeholder="Add bio..."
                            maxLength={100}
                            multiline={true}
                            value={value}
                            onChangeText={onChange}
                            style={[styles.textIn, {flex:1, textAlignVertical:"top", alignSelf:"center", marginBottom:5}]}
                            />
                        )}
                    />
                <TouchableOpacity style={[styles.button, {alignSelf:"center"}]}
                onPress={() => handleSubmit(onSubmit)}
                >
                    <DefaultText>Submit</DefaultText>
                </TouchableOpacity>
                </View>
            </View>
            <NavBar navigation={navigation} user={user} screen='Profile'/>
        </SafeAreaView>
    );
}