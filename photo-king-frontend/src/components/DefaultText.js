import { Text } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function DefaultText ({children, style, numberOfLines}) {
    return(<Text numberOfLines={numberOfLines} style={[styles.baseText, style]}>{children}</Text>);
}
