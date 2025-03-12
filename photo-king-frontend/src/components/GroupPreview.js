import { TouchableOpacity, Text } from 'react-native';
import styles from '../styles/ComponentStyles.js';
import Pfp from './Pfp.js';

export default function GroupPreview ({thumbnail, groupTitle, navFunction}) {
    return(
        <TouchableOpacity style={styles.listItem} onPress={navFunction}>
                {thumbnail &&
                    <Pfp url={thumbnail}/>
                }
                <Text style={styles.titleText}>{groupTitle}</Text>
        </TouchableOpacity>
    );
}