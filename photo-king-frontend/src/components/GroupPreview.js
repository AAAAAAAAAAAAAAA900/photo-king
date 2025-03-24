import { TouchableOpacity, Text, View } from 'react-native';
import styles from '../styles/ComponentStyles.js';
import Pfp from './Pfp.js';
import DefaultText from './DefaultText.js';

export default function GroupPreview({ thumbnail, groupTitle, navFunction }) {
    return (
        <TouchableOpacity style={[styles.listItem, { justifyContent: 'space-between', height:80 }]} onPress={navFunction}>
            <DefaultText numberOfLines={1} style={[styles.titleText, {maxWidth:'80%'}]}>{groupTitle}</DefaultText>
            {thumbnail &&
                <Pfp url={thumbnail}/>
            }
        </TouchableOpacity>
    );
}