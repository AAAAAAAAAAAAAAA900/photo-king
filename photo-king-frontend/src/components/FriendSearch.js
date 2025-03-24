import { View, FlatList, TouchableOpacity, TextInput, Image } from "react-native";
import { useState, useEffect } from "react";
import DefaultText from "./DefaultText";
import styles, { colors } from '../styles/ComponentStyles.js';
import Pfp from "./Pfp.js";

export default function FriendSearch({ searchData, onSelect }) {
    const [userSearch, setUserSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(searchData); // Update filtered data when the friend list updates
    }, [searchData]);

    // User search bar search function
    const search = (text) => {
        if (text) {
            const data = /* API call: query for friends of user WHERE username LIKE '{text}%' */
                searchData.filter((item) => item.username.toLowerCase().includes(text.toLowerCase()));
            setFilteredData(data);
        } else {
            setFilteredData(searchData);
        }
    };

    // Update search results on type change
    useEffect(() => {
        search(userSearch);
    }, [userSearch]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", width: '90%', alignSelf:"center", justifyContent: "center", backgroundColor:colors.greyWhite, borderRadius:5, margin:2, marginHorizontal:5}}>
                <Image style={[styles.iconStyle, {width:'15%'}]} source={require('../../assets/icons/search.png')} />
                <TextInput
                    placeholder="Search Friends..."
                    onChangeText={(userSearch) => { setUserSearch(userSearch) }}
                    value={userSearch}
                    style={[styles.textIn, { width: '85%' }]}
                />
            </View>
            <FlatList
                data={[...filteredData].sort((a, b) => a.username.localeCompare(b.username))}
                keyExtractor={(item) => item.username}
                renderItem={({ item }) => <FriendPreview friend={item} press={() => { onSelect ? onSelect(item) : null }} />}
            />
        </View>
    );
}

export function FriendPreview({ friend, press }) {
    return (
        <TouchableOpacity style={[styles.listItem, { padding: 10, gap: 20 }]} onPress={press}>
            <Pfp url={friend.pfp} />
            <DefaultText style={styles.bold}>{friend.username}</DefaultText>
        </TouchableOpacity>
    );
}