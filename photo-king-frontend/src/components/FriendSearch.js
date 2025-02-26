import { View, FlatList, TouchableOpacity } from "react-native";
import { SearchBar } from '@rneui/themed';
import { useState, useEffect } from "react";
import DefaultText from "./DefaultText";
import styles, { colors } from '../styles/ComponentStyles.js';
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

    return(
        <View style={{flex:1}}>
            <SearchBar
                placeholder="Search Friends..."
                onChangeText={(userSearch) => {setUserSearch(userSearch)}}
                value={userSearch}
                inputStyle={{
                        borderColor: colors.secondary, 
                        borderRadius:5,
                        backgroundColor:colors.greyWhite,
                        borderWidth: 1,
                        fontFamily: 'DMSans-Regular', 
                        fontSize: 16,
                    }}
                inputContainerStyle={{ backgroundColor:"transparent"}}
                containerStyle={{alignItems:'center', backgroundColor:"transparent"}}
                lightTheme={true}
            />
            <FlatList
                ItemSeparatorComponent={ () => <View style={styles.separator} /> }
                data={[...filteredData].sort((a,b)=>a.username.localeCompare(b.username))}
                keyExtractor={(item) => item.username}
                renderItem={({item}) => <FriendPreview friend={item} press={() => {onSelect? onSelect(item) : null}}/>}
            />
        </View>
    );
}

export function FriendPreview({friend, press}){
    return(
        <TouchableOpacity style={[styles.listItem, {padding:10}]} onPress={press}>
            <Pfp url={friend.pfp}/>
            <DefaultText>{friend.username}</DefaultText>
        </TouchableOpacity>
    );
}