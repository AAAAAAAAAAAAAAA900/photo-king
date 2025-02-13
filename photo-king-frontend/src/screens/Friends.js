import { ActivityIndicator, SafeAreaView, View } from "react-native";
import DefaultText from "../components/DefaultText";
import { useRoute } from '@react-navigation/native';
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";


export default function FriendsScreen({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const [loading, setLoading] = useState(false);
    const [friendsList, setFriendsList] = useState([]);
    console.log(user.friends);
    if (!user){
        return(<DefaultText>ERROR CASE: user lost</DefaultText>)
    }

    // const loadFriendsList = async () => {
    //     try {
    //         const response = await axios.get(`${API_URL}/api/user/get-user/${username}`,
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             }
    //         );
    //         setFriendsList(response.data)
    //     }
    //     catch (error) {
    //         console.log(error);
    //     }
    //     finally {
    //         setLoading(false);
    //     }
    // };

    // // On screen load
    // useEffect(() => {
    //     loadFriendsList();
    // }, []);

    return( 
        <SafeAreaView style={{flex:1}}>
            {/* Show loading indicator while fetching data */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={{flex:1}}>
                    <DefaultText>friends</DefaultText>
                </View>
            )}
            <NavBar navigation={navigation} user={user} screen='Friends'/>
        </SafeAreaView>
    );
}