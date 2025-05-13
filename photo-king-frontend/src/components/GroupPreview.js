import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import styles from '../styles/ComponentStyles.js';
import Pfp from './Pfp.js';
import DefaultText from './DefaultText.js';

export default function GroupPreview({ thumbnail, groupTitle, navFunction }) {
    return (
        <TouchableOpacity style={previewStyles.listItem} onPress={navFunction}>
            <DefaultText numberOfLines={1} style={previewStyles.titleText}>{groupTitle}</DefaultText>
            {thumbnail &&
                <Pfp url={thumbnail}/>
            }
        </TouchableOpacity>
    );
}

const previewStyles = StyleSheet.create({
    listItem:[
        styles.listItem, 
        { 
            justifyContent: 'space-between', 
            height:80 
        }
    ],
    titleText:[
        styles.titleText, 
        {
            maxWidth:'80%'
        }
    ],

});