import { SafeAreaView, FlatList, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import styles from "../styles/ComponentStyles";
import {useEffect, useState} from "react";

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [pictures, setPictures] = useState([]);

    // FlatList element's view
    const Pic = ({ photo }) => {
        return <TouchableOpacity style={groupStyles.picHolder}>{photo.icon}</TouchableOpacity>;
    };

    // API call(?) to get photos from group
    const loadPictures /*= async*/ = () => {
        const pics = [];
        for (let i = 0; i < 40; ++i){
            pics[i]= {
                icon: (
                    <Image
                        style={groupStyles.pic}
                        source={require('../../assets/icons/icon.png')}
                        // defaultSource= default image to display while loading images.
                    />
                ),
                id:i.toString()
            };
        }
        setPictures(pics);
    }

    // useEffect to get group pictures on load
    useEffect(() => {
        loadPictures();
    }, [/*group*/]);
    
    return(
        <SafeAreaView style={{flex:1}}>
            <DefaultText> {JSON.stringify(user)} {JSON.stringify(group)}</DefaultText>
            <View style={groupStyles.picList}>
                <FlatList 
                    numColumns={3}
                    renderItem={({ item }) => <Pic photo={item} />}
                    keyExtractor={(picture) => picture.id}
                    data={pictures}
                />
            </View>
            <View style={groupStyles.buttonHolder}>
                <TouchableOpacity style={styles.button}>
                    <DefaultText>Add photo</DefaultText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <DefaultText>Add user</DefaultText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const groupStyles = StyleSheet.create({
    picList: {
        flex: 1
    },
    picHolder: {
        flex:1,
        maxWidth: "33%",
        aspectRatio:1,
        alignItems:'center',
        margin: 1.5
    },
    pic: { 
        flex:1, 
        height:'100%', 
        width:'100%', 
        resizeMode:'cover' 
    },
    buttonHolder: {
        alignSelf: 'baseline',
        flexDirection:"row"
    }
});