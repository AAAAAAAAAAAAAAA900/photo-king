import { View, FlatList, TouchableOpacity } from "react-native";
import { SearchBar } from '@rneui/themed';
import { useState, useEffect } from "react";
import DefaultText from "./DefaultText";
import styles from '../styles/ComponentStyles.js';
import Pfp from "./Pfp.js";

export default function FriendSearch({searchData, onSelect}){
    const [userSearch, setUserSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        setFilteredData(searchData); // Update filtered data when the friend list updates
    }, [searchData]);

    // User search bar search function
    const search = (text) => {
        if (text){
            const data = /* API call: query for friends of user WHERE username LIKE '{text}%' */
                searchData.filter((item) => item.username.toLowerCase().includes(text.toLowerCase()));
            setFilteredData(data);
        } else{
            setFilteredData(searchData);
        }
    };

    // Update search results on type change
    useEffect(() => {
        search(userSearch);
    }, [userSearch]);
    
    function FriendPreview({friend}){
        return(
            <TouchableOpacity style={styles.listItem} onPress={() => {onSelect? onSelect(friend) : null}}>
                <Pfp url={friend.pfp}/>
                <DefaultText>{friend.username}</DefaultText>
            </TouchableOpacity>
        );
    }

    return(
        <View style={{flex:1}}>
            <SearchBar
                placeholder="Search Friends..."
                onChangeText={(userSearch) => {setUserSearch(userSearch)}}
                value={userSearch}
                inputContainerStyle={[styles.textIn, {width:'100%'}]}
                containerStyle={{alignItems:'center'}}
                lightTheme={true}
            />
            <FlatList
                ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                data={filteredData}
                keyExtractor={(item) => item.username}
                renderItem={({item}) => <FriendPreview friend={item}/>}
            />
        </View>
    );
}