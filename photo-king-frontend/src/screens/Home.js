import {SafeAreaView, FlatList, View, ActivityIndicator, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import GroupPreview from '../components/GroupPreview.js';
import styles from "../styles/ComponentStyles";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import {useEffect, useState} from "react";
import {API_URL} from "../api/utils";
import DefaultText from '../components/DefaultText.js';
import NavBar from '../components/NavBar.js';

export default function HomeScreen ({navigation}){

  const route = useRoute();
  const [user, setUser] = useState(route.params?.user);
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // loading page
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [groupTitle, setGroupTitle] = useState('');

  const addGroup = async () => {

    try {
      const group_response = await axios.post(`${API_URL}/api/photo-group/add`, {name: groupTitle},
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const group_data = group_response.data

      try {
        const user_group_response = await axios.post(`${API_URL}/api/user-groups/add-user/${user.id}/${group_data.id}`)
        setUser({
          ...user,
          groups: [...user.groups, group_data]
        });
      }
      catch (error) {
        console.log(error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  
  // Home screen view: scrollable list of groups
  return (
      <SafeAreaView style={{ padding: 20, flex:1 }}>

        {/* Create group popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={groupModalVisible}
          onRequestClose={() => {setGroupModalVisible(false);}}
        >
          <View style={ styles.containerCenterAll}>
            <TextInput 
              style={styles.textIn}
              onChangeText={(text) => {setGroupTitle(text)}}
              autoCapitalize ='none'
              autoCorrect ={false}
              placeholder="Enter Group Name..."
            />
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity style={styles.button}
                onPress={() => {
                  addGroup();
                  setGroupTitle('');
                  setGroupModalVisible(false);
                }}
              >
                <DefaultText>Submit</DefaultText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={() => {
                  setGroupTitle(''); 
                  setGroupModalVisible(false);
                }}
              >
                <DefaultText>Cancel</DefaultText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        {/* Show loading indicator while fetching data */}
        {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : user ? (
          // Render user info only if `user` is not null
          user.groups && user.groups.length ? (
            // List groups if user has any
            <View style={{flex:1}}>
              <FlatList
                  ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                  data={user.groups}
                  renderItem={({item}) => 
                    <GroupPreview groupTitle={item.name} navFunction={() => {
                      navigation.navigate("Group", {user: user,group: item})
                    }}
                    />
                  }
                  keyExtractor={ item => item.id }
              />
            </View>
          ) : (
              // No active groups message
            <View style={styles.containerCenterAll}>
              <DefaultText>You have no active groups!</DefaultText>
            </View>
          ) 
        ) : (
            // Show error message if user is null (e.g., not found)
            <View style={styles.containerCenterAll}>
              <Text style={{ color: 'red' }}>User not found</Text>
            </View>
        )}
        <TouchableOpacity style={styles.button} onPress={() => setGroupModalVisible(true)}>
            <DefaultText>+</DefaultText>
        </TouchableOpacity> 
        <NavBar navigation={navigation} user={user} screen='Home'/>
      </SafeAreaView>
  );
}
