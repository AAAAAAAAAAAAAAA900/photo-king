import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import Pfp from "./Pfp";
import DefaultText from "./DefaultText";
import styles, { colors } from "../styles/ComponentStyles";
import { useEffect, useState } from "react";
import userApi from "../api/userApi";
import { useUser } from "./UserContext";
import { update } from "lodash";


export default function FriendModal({ friendClicked, setFriendClicked, friendModalVisible, setFriendModalVisible, removeFriend, removeFriendFromGroup, ownerId }) {

    const [bio, setBio] = useState("");
    const { user, updateUser } = useUser();

    const getBio = async (id) => {
        try {
            const response = await userApi.getBio(id);
            setBio(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (friendClicked) {
            getBio(friendClicked.id);
        }
    }, [friendClicked]);

    const closeModal = () => {
        setBio("");
        setFriendModalVisible(false);
        setFriendClicked(null);
    };

    return (
        friendClicked && (    // prevents instant rendering and friendClicked null errors
            <Modal
                animationType="fade"
                transparent={true}
                visible={friendModalVisible}
                onRequestClose={() => { closeModal(); }}
            >
                <TouchableOpacity activeOpacity={1}
                    onPress={() => { closeModal(); }}
                    style={styles.modalBackground}>
                    <View style={styles.redModalBanner} />
                    <TouchableOpacity activeOpacity={1} style={friendStyles.popUpContainer}>
                        <View style={friendStyles.topBanner} />

                        {/* Modal container */}
                        <View style={friendStyles.profileContainer}>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {/* PFP surrounded by white circle */}
                                <View style={friendStyles.whiteBorder}>
                                    <Pfp url={friendClicked.pfp} size={100} />
                                </View>

                                {/* Block button */}
                                {friendClicked.id !== user.id &&
                                    <TouchableOpacity style={friendStyles.blockButton}
                                        onPress={() => {
                                            Alert.alert(
                                                `Block ${friendClicked.username}?`,
                                                "You will be removed from their friends list and all their content will be unviewable.",
                                                [
                                                    {
                                                        text: "Block", style: "destructive", onPress: () => {
                                                            try {
                                                                userApi.blockUser(user.id, friendClicked.id);
                                                                setFriendClicked(null);
                                                                setFriendModalVisible(false);
                                                            } catch (error) { console.log(error); }
                                                        }
                                                    },
                                                    { text: "Cancel", style: "cancel" }
                                                ]
                                            );
                                        }}
                                    >
                                        <DefaultText style={friendStyles.blockText}>Block</DefaultText>
                                    </TouchableOpacity>
                                }
                            </View>

                            {/* Username */}
                            <DefaultText style={friendStyles.username}>{friendClicked.username}</DefaultText>

                            {/* Bio */}
                            <View style={friendStyles.bioContainer}>
                                <DefaultText>{bio}</DefaultText>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={friendStyles.buttonsContainer}>
                            {removeFriend &&
                                <TouchableOpacity
                                    style={friendStyles.button}
                                    onPress={() => {
                                        Alert.alert(
                                            `Remove ${friendClicked.username} as friend?`,
                                            "You will be removed from their friends list aswell.",
                                            [
                                                { text: "Confirm", onPress: () => { removeFriend(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false); } },
                                                { text: "Cancel", style: "cancel" }
                                            ]
                                        );
                                    }}
                                >
                                    <DefaultText style={styles.buttonText}>Remove Friend</DefaultText>
                                </TouchableOpacity>
                            }

                            {(friendClicked.id !== ownerId && removeFriendFromGroup) &&
                                <TouchableOpacity
                                    style={friendStyles.button}
                                    onPress={() => {
                                        Alert.alert(
                                            `Remove ${friendClicked.username} from group?`,
                                            "This group will no longer appear on their home screen.",
                                            [
                                                { text: "Confirm", onPress: () => { removeFriendFromGroup(friendClicked.id); setFriendClicked(null); setFriendModalVisible(false); } },
                                                { text: "Cancel", style: "cancel" }
                                            ]
                                        );
                                    }}
                                >
                                    <DefaultText style={styles.buttonText}>Kick</DefaultText>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity
                                style={friendStyles.button}
                                onPress={() => { closeModal(); }}
                            >
                                <DefaultText style={styles.buttonText}>Close</DefaultText>
                            </TouchableOpacity>
                        </View>

                    </TouchableOpacity>
                    <View style={styles.redModalBanner} />
                </TouchableOpacity>
            </Modal>
        )
    );
}

const friendStyles = StyleSheet.create({
    button: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: colors.secondary,
        alignItems: "center",
        justifyContent: "center"
    },
    blockButton: {
        backgroundColor: "white",
        width: 70,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 35,
        right: 10
    },
    blockText: [
        styles.buttonText,
        {
            color: 'red'
        }
    ],
    popUpContainer: [
        styles.popupView,
        {
            alignItems: "baseline",
            height: 320,
            justifyContent: "baseline"
        }
    ],
    topBanner: {
        width: '100%',
        height: 60,
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: colors.secondary
    },
    profileContainer: {
        flex: 1,
        paddingHorizontal: 2,
        width: '100%'
    },
    whiteBorder: {
        left: 10,
        alignSelf: 'baseline',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 200
    },
    username: [
        styles.titleText,
        {
            marginLeft: 15
        }
    ],
    bioContainer: {
        height: 105,
        width: '100%',
        padding: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        height: 60,
        gap: 15,
        backgroundColor: colors.primary,
        justifyContent: 'space-between'
    },

});