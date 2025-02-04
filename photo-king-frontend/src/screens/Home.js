import { SafeAreaView, FlatList } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function HomeScreen ({navigation}){
  
  // Home screen view: scrollable list of groups
  return(
    <SafeAreaView style={styles.container}>
      <FlatList>
        
      </FlatList>
    </SafeAreaView>
  );
}
