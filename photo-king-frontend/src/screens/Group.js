import { SafeAreaView } from 'react-native';
import DefaultText from '../components/DefaultText';
import { useRoute } from '@react-navigation/native';

export default function GroupScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    return(
        <SafeAreaView>
            <DefaultText>{user} {group}</DefaultText>
        </SafeAreaView>
    );
}