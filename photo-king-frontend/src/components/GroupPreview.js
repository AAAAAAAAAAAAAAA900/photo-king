import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function GroupPreview ({groupTitle, navFunction}) {
    return(
        <TouchableOpacity style={styles.group} onPress={navFunction}>
                <Text style={styles.titleText}>{groupTitle}</Text>
        </TouchableOpacity>
    );
}