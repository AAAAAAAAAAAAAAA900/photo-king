import { SafeAreaView, FlatList, View } from 'react-native';
import styles from '../styles/ComponentStyles.js';
import GroupPreview from '../components/GroupPreview.js';
import { useRoute } from '@react-navigation/native';

export default function HomeScreen ({navigation}){
  const route = useRoute();
  const user = route.params?.user;

  // query groups user belongs to
  const loadUserGroups = (userID) => {
    // PLACEHOLDER IMPLEMENTATION
    const groups = []
    for (let i = 0; i < 10; ++i){
      groups[i] = {title:('group ' + (i+1)), id: (i+1)}
    }
    return (groups);
  }

  // Home screen view: scrollable list of groups
  return(
    <SafeAreaView style={styles.container}>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}  // The lines seperating groups
        data={loadUserGroups(/*REPLACE THIS WITH THE USERS NAME*/ user)}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <GroupPreview groupTitle={item.title} navFunction={() => {navigation.navigate("Group", {user:user, group:item.title})}}/>}
      />
    </SafeAreaView>
  );
}
