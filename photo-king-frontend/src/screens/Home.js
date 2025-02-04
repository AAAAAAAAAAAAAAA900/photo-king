import { SafeAreaView, FlatList, View } from 'react-native';
import styles from '../styles/ComponentStyles.js';
import GroupPreview from '../components/GroupPreview.js';

export default function HomeScreen ({navigation}){
  
  // query groups user belongs to
  const loadUserGroups = (userID) => {
    // PLACEHOLDER IMPLEMENTATION
    return (
      [
        {title:'group1', id: 1},
        {title:'group2', id: 2},
        {title:'group3', id: 3}
      ]
    );
  }

  // Home screen view: scrollable list of groups
  return(
    <SafeAreaView style={styles.container}>
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        data={loadUserGroups(/*REPLACE THIS WITH THE USERS NAME*/'USERNAME')}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => <GroupPreview groupTitle={item.title} navFunction={() => {console.log("Clicked")}}/>}
      />
    </SafeAreaView>
  );
}
