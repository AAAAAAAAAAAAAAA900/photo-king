import { Text } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function DefaultText ({children}) {
    return(<Text style={styles.baseText}>{children}</Text>);
}
