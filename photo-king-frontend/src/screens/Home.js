import {SafeAreaView, Image, FlatList, View, ActivityIndicator, Text, TouchableOpacity, TextInput, Modal, ImageBackground } from 'react-native';
import GroupPreview from '../components/GroupPreview.js';
import styles, {colors} from "../styles/ComponentStyles";
import { useRoute } from '@react-navigation/native';
import {useEffect, useState} from "react";
import DefaultText from '../components/DefaultText.js';
import NavBar from '../components/NavBar.js';
import photoGroupApi from "../api/photoGroupApi";
import Header from '../components/Header.js';
import TitleButtons from '../components/TitleButtons.js';
import imageApi from '../api/imageApi.js';

export default function HomeScreen ({navigation}){

  const route = useRoute();
  const [user, setUser] = useState(route.params?.user);
  const [groupModalVisible, setGroupModalVisible] = useState(false)
  const [groupTitle, setGroupTitle] = useState('');
  const [thumbnails, setThumbnails] = useState({}); 
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    getGroupThumbnails();
  }, []);

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

  const getGroupThumbnails = async () => {
    const images = {};
    try{
      // get response promises
      const promises = user.groups.map(async (element) => {
        images[element.id] = await imageApi.getTopImage(element.id);
      });
      // await all responses
      await Promise.all(promises);
      // get data from responses
      Object.keys(images).forEach((key) => images[key]=images[key].data);
      setThumbnails(images);
      setLoading(false);
    } catch(error){
      console.log(error);
    }
  }

  // Home screen view: scrollable list of groups
  return (
      <SafeAreaView style={{ flex:1 }}>

        <Header border={true} title={'Home'} buttons={<TitleButtons navigation={navigation} user={user}/>}/>

        {/* Create group popup */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={groupModalVisible}
          onRequestClose={() => {setGroupModalVisible(false);}}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {setGroupModalVisible(false);}} style={ [styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
            <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
            <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
            <TouchableOpacity activeOpacity={1} style={[styles.popupView, {padding:10,gap:40}]}>
                <DefaultText style={styles.titleText}>Create Group</DefaultText>
                <TextInput 
                  style={[styles.textIn, {width: '80%'}]}
                  onChangeText={(text) => {setGroupTitle(text)}}
                  autoCapitalize ='none'
                  maxLength={20}
                  autoCorrect ={false}
                  placeholder="Enter Group Name..."
                />
                <View style={{flexDirection:'row', gap:10}}>
                <TouchableOpacity style={[styles.button, {width:'40%', backgroundColor:colors.greyWhite}]}
                    onPress={() => {
                      setGroupTitle(''); 
                      setGroupModalVisible(false);
                    }}
                  >
                    <DefaultText>Cancel</DefaultText>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, {width:'40%'}]}
                    onPress={() => {
                      addGroup();
                      setGroupTitle('');
                      setGroupModalVisible(false);
                    }}
                  >
                    <DefaultText>Submit</DefaultText>
                  </TouchableOpacity>
                </View>
            </TouchableOpacity>
            <View style={{width:'75%', height:10, backgroundColor:colors.primary}}/>
            <View style={{width:'75%', height:30, backgroundColor:colors.secondary}}/>
          </TouchableOpacity>
        </Modal>


        {/* Show loading indicator while fetching data */}
        {loading ? (
            <View style={styles.containerCenterAll}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
        ) : user ? (
          // Render flatlist if user has groups
          user.groups && user.groups.length ? (
            // List groups if user has any
            <View style={{flex:1}}>
              <FlatList
                  ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                  data={[...user.groups].sort((a, b)=> a.name.localeCompare(b.name))} // alphabetical ordering
                  renderItem={({item}) => 
                    <GroupPreview thumbnail={thumbnails[item.id]?.url} groupTitle={item.name} navFunction={() => {
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
        <TouchableOpacity style={{
                position:'absolute',
                right:'8%',
                bottom:'15%',
                width:70, 
                height:70,
                backgroundColor: colors.secondary,
                boxShadow: '5 5 5 0 rgba(0, 0, 0, 0.25)', 
                alignItems:'center', 
                justifyContent:'center', 
                borderRadius:50,
                margin: 5  
              }} 
              onPress={() => setGroupModalVisible(true)}>
            <Image style={styles.iconStyle} source={require('../../assets/icons/plus.png')}/>
        </TouchableOpacity> 
        <NavBar navigation={navigation} user={user} screen='Home'/>
      </SafeAreaView>
  );
}
