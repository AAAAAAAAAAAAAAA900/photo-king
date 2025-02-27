import {SafeAreaView, FlatList, View, ActivityIndicator, Text, TouchableOpacity, TextInput, Modal } from 'react-native';
import GroupPreview from '../components/GroupPreview.js';
import styles from "../styles/ComponentStyles";
import { useRoute } from '@react-navigation/native';
import axios from "axios";
import {useEffect, useState} from "react";
import {API_URL} from "../api/utils";
import DefaultText from '../components/DefaultText.js';
import NavBar from '../components/NavBar.js';
import photoGroupApi from "../api/photoGroupApi";

export default function HomeScreen ({navigation}){

  const route = useRoute();
  const [user, setUser] = useState(route.params?.user);
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // loading page
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [groupTitle, setGroupTitle] = useState('');

  useEffect(() => {
    navigation.setOptions({ user: user }); // pass user along to header
  }, [user]);

  const addGroup = async () => {
      try {
          const group_response = await photoGroupApi.addGroup(groupTitle, user.id); // CREATES A GROUP
          const group_data = group_response.data;
          try {
              const user_group_response = await photoGroupApi.addUserToGroup(user.id, group_data.id); // ADDS OWNER TO GROUP
              setUser({
                  ...user,
                  groups: [...user.groups, group_data]
              });
          } catch (error) {
              console.log(error);
          }
      } catch (error) {
          console.log(error);
      }
  }

  // Home screen view: scrollable list of groups
  return (
      <SafeAreaView style={{ flex:1 }}>

        {/* Create group popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={groupModalVisible}
          onRequestClose={() => {setGroupModalVisible(false);}}
        >
          <View style={ [styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
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
          // Render flatlist if user has groups
          user.groups && user.groups.length ? (
            // List groups if user has any
            <View style={{flex:1}}>
              <FlatList
                  ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                  data={[...user.groups].sort((a, b)=> a.name.localeCompare(b.name))} // alphabetical ordering
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
