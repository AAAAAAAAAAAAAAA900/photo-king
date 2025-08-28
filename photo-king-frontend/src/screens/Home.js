import { SafeAreaView, Image, FlatList, View, ActivityIndicator, TouchableOpacity, TextInput, Modal, Keyboard, StyleSheet, Alert, BackHandler } from 'react-native';
import GroupPreview from '../components/GroupPreview.js';
import styles, { colors } from "../styles/ComponentStyles";
import { StackActions, useRoute } from '@react-navigation/native';
import { useEffect, useState } from "react";
import DefaultText from '../components/DefaultText.js';
import NavBar from '../components/NavBar.js';
import photoGroupApi from "../api/photoGroupApi";
import Header from '../components/Header.js';
import TitleButtons from '../components/TitleButtons.js';
import imageApi from '../api/imageApi.js';
import DropDownMenu from '../components/DropDownMenu.js';
import { getUser } from './Login.js';
import { useUser } from '../components/UserContext.js';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function HomeScreen({ navigation }) {
    const {user, updateUser} = useUser();
    const [groupModalVisible, setGroupModalVisible] = useState(false)
    const [groupTitle, setGroupTitle] = useState('');
    const [daySelected, setDaySelected] = useState("Monday");
    const [thumbnails, setThumbnails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Create Android back action handler
        const backAction = () => {
            Alert.alert(
                'Log out?',
                'Navigating back will return to login screen.' ,
            [
                { text: 'Cancel', style: 'Cancel' },
                { text: 'Log Out', onPress: () => {
                    updateUser(null);
                    navigation.dispatch(StackActions.popToTop());
                } },
            ]);
            return true;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        
        // load thumbnail images for groups
        getGroupThumbnails();

        // Remove handler
        return ()=> backHandler.remove();
    }, []);

    const addGroup = async () => {
        try {
            let day;
            switch (daySelected) {
                case "Monday": day = 1; break;
                case "Tuesday": day = 2; break;
                case "Wednesday": day = 3; break;
                case "Thursday": day = 4; break;
                case "Friday": day = 5; break;
                case "Saturday": day = 6; break;
                case "Sunday": day = 7; break;
            }
            // creates a group and adds owner
            await photoGroupApi.addGroup(groupTitle, user.id, day);
        } catch (error) {
            console.log(error);
        }
        finally {
            getUser(updateUser, navigation);
        }
    }

    const getGroupThumbnails = async () => {
        const images = {};
        try {
            // get response promises
            const promises = user.groups.map(async (element) => {
                images[element.id] = await imageApi.getTopImage(element.id);
            });
            // await all responses
            await Promise.all(promises);
            // get data from responses
            Object.keys(images).forEach((key) => images[key] = images[key].data);
            setThumbnails(images);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const closeModal = () => {
        setGroupTitle('');
        setDaySelected("Monday");
        setGroupModalVisible(false);
    }

    // Home screen view: scrollable list of groups
    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <Header border={true} title={'Home'} buttons={<TitleButtons navigation={navigation} user={user} />} />

            {/* Create group popup */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={groupModalVisible}
                onRequestClose={() => { closeModal(); }}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => { closeModal(); }} style={styles.modalBackground}>
                    <View style={styles.redModalBanner} />
                    <View style={styles.blueModalBanner} />
                    <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()} style={homeStyles.modalContainer}>
                        <DefaultText style={styles.titleText}>Create Group</DefaultText>

                        {/* title input */}
                        <TextInput
                            style={homeStyles.modalTextIn}
                            onChangeText={(text) => { setGroupTitle(text) }}
                            autoCapitalize='none'
                            maxLength={20}
                            autoCorrect={false}
                            placeholder="Enter Group Name..."
                        />

                        {/* Reset day dropdown */}
                        <View style={homeStyles.dropDownContainer}>
                            <DefaultText style={homeStyles.dropDownText}>Resets every: </DefaultText>
                            <DropDownMenu data={days} selection={daySelected} setSelection={setDaySelected} />
                        </View>

                        {/* Buttons */}
                        <View style={homeStyles.modalButtonContainer}>
                            <TouchableOpacity style={homeStyles.modalCancelButton}
                                onPress={() => { closeModal(); }}
                            >
                                <DefaultText style={styles.bold} >Cancel</DefaultText>
                            </TouchableOpacity>
                            <TouchableOpacity style={homeStyles.modalSubmitButton}
                                onPress={() => {
                                    addGroup();
                                    setGroupTitle('');
                                    setGroupModalVisible(false);
                                    setDaySelected("Monday");
                                }}
                            >
                                <DefaultText style={styles.buttonText}>Submit</DefaultText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.blueModalBanner} />
                    <View style={styles.redModalBanner} />
                </TouchableOpacity>
            </Modal>

            {/* Show loading indicator while fetching data */}
            {loading ? (
                <View style={homeStyles.centerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) :
                // List groups if user has any
                user.groups && user.groups.length ? (
                    <View style={homeStyles.container}>
                        <FlatList
                            data={[...user.groups].sort((a, b) => a.name.localeCompare(b.name))} // alphabetical ordering
                            renderItem={({ item }) =>
                                <GroupPreview thumbnail={thumbnails[item.id]?.url} groupTitle={item.name} navFunction={() => {
                                    navigation.navigate("Group", { groupId: item.id })
                                }}
                                />
                            }
                            keyExtractor={item => item.id}
                        />
                    </View>
                ) : (
                    // No active groups message
                    <View style={homeStyles.centerContainer}>
                        <DefaultText>You have no active groups!</DefaultText>
                    </View>
                )
            }

            {/* add group button */}
            <TouchableOpacity style={homeStyles.addButton}
                onPress={() => setGroupModalVisible(true)}>
                <Image style={styles.iconStyle} source={require('../../assets/icons/plus.png')} />
            </TouchableOpacity>

            <NavBar navigation={navigation} screen='Home' />
        </SafeAreaView>
    );
}

const homeStyles = StyleSheet.create({
    modalContainer: [
        styles.popupView,
        {
            padding: 10,
            gap: 13,
        }
    ],
    modalTextIn: [
        styles.textIn,
        {
            width: '80%'
        }
    ],
    dropDownContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dropDownText: {
        marginTop: 5,
        marginRight: 5
    },
    modalButtonContainer: {
        flexDirection: 'row',
        gap: 10
    },
    modalCancelButton: [
        styles.button,
        {
            width: '40%',
            backgroundColor: colors.greyWhite
        }
    ],
    modalSubmitButton: [
        styles.button,
        {
            width: '40%'
        }
    ],

    centerContainer: [
        styles.containerCenterAll,
        {
            backgroundColor: 'white'
        }
    ],
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    addButton: {
        position: 'absolute',
        right: '8%',
        bottom: '15%',
        width: 70,
        height: 70,
        backgroundColor: colors.secondary,
        boxShadow: '5 5 5 0 rgba(0, 0, 0, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        margin: 5
    },





});