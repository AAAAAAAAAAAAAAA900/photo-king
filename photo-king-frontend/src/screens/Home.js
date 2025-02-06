import {SafeAreaView, FlatList, View, ActivityIndicator, Text} from 'react-native';
import GroupPreview from '../components/GroupPreview.js';
import styles from "../styles/ComponentStyles";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import {useEffect, useState} from "react";
import {API_URL} from "../api/utils";

export default function HomeScreen ({navigation}){

  const route = useRoute();
  const { username } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading page

  // User data from username: API call
  const getUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/get-user/${username}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );
      setUser(response.data)
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }

  // useEffect to get user data on load
  useEffect(() => {
    getUser();
  }, []);

  /*
  useEffect(() => {
  }, [user]);
  Im commenting this out because Im pretty sure it litterally does nothing.
                         (-___-)
                            |
                          \ | /
                            | 
                           / \
  */

  // Home screen view: scrollable list of groups
  return (
      <SafeAreaView style={{ padding: 20 }}>
        {/* Show loading indicator while fetching data */}
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : user ? (
            // Render user info only if `user` is not null
            <FlatList
                ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                data={user.photoGroups}
                renderItem={({item}) => 
                  <GroupPreview groupTitle={item.name} navFunction={() => {
                    navigation.navigate("Group", {user: user,group: item})
                  }}
                  />
                }
                keyExtractor={ item => item.id }
            />
        ) : (
            // Show error message if user is null (e.g., not found)
            <Text style={{ color: 'red' }}>User not found</Text>
        )}
      </SafeAreaView>
  );
}
