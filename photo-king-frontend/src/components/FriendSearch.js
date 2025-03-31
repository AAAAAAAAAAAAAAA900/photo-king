import { View, FlatList, TouchableOpacity, TextInput, Image, StyleSheet } from "react-native";
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
        <View style={styles.container}>
            <View style={searchStyles.searchBarContainer}>
                <Image style={searchStyles.searchIcon} source={require('../../assets/icons/search.png')} />
                <TextInput
                    placeholder="Search Friends..."
                    onChangeText={(userSearch) => { setUserSearch(userSearch) }}
                    value={userSearch}
                    style={searchStyles.textIn}
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

export function FriendPreview({ friend, press, points, isOwner, isWinner }) {
    return (
        <TouchableOpacity style={searchStyles.listItem} onPress={press}>
            <Pfp url={friend.pfp} />
            {/* If given points, display them below the username */}
            { points !== undefined ?
                <View style={searchStyles.pointsContainer}>
                    <DefaultText numberOfLines={1} style={styles.bold}>{friend.username}</DefaultText>
                    <DefaultText>Points: {points}</DefaultText>
                </View>
                :
                <DefaultText numberOfLines={1} style={searchStyles.username}>{friend.username}</DefaultText>
            }
            {/* If displaying owner of a group, add a tag */}
            {isOwner &&
                <View style={searchStyles.ownerTag}>
                    <DefaultText>Owner</DefaultText>
                </View>
            }
            {/* If displaying winner of a group, add crown icon */}
            {isWinner &&
                <View style={searchStyles.iconContainer}>
                    <Image style={styles.iconStyle} source={require('../../assets/icons/crown.png')} />
                </View>
            }
        </TouchableOpacity>
    );
}

const searchStyles = StyleSheet.create({
    searchBarContainer:{ 
        flexDirection: "row", 
        width: '90%', 
        alignSelf:"center", 
        justifyContent: "center", 
        backgroundColor:colors.greyWhite, 
        borderRadius:5, 
        margin:2, 
        marginHorizontal:5
    },
    searchIcon:[
        styles.iconStyle, 
        {
            width:'15%'
        }
    ],
    textIn:[
        styles.textIn, 
        { 
            width: '85%' 
        }
    ],
    listItem:[
        styles.listItem, 
        { 
            padding: 10, 
            gap: 20 
        }
    ],
    username:[
        styles.bold,
        {
            width:'75%'
        }
    ],
    pointsContainer:{
        flex:1,
        justifyContent: 'center',
    },
    ownerTag:{
        position:"absolute",
        bottom:1,
        right:4,
    },
    iconContainer:{
        position:"absolute",
        top:0,
        right:0,
        height:23,
        width:25
    }

});