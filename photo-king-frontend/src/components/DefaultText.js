import { Text } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function DefaultText ({children, style}) {
    return(<Text style={[styles.baseText, style]}>{children}</Text>);
}
