import { Component } from 'react';
import { Text, SafeAreaView } from 'react-native';
import styles from '../styles/ComponentStyles.js';

export default function DefaultText ({children}) {
    return(<Text style={styles.baseText}>{children}</Text>);
}
