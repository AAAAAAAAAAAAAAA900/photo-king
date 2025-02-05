import { SafeAreaView, Text } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';
import {useEffect} from "react";

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;

    return(
        <SafeAreaView>
            <DefaultText> {user.email} </DefaultText>
        </SafeAreaView>
    );
}