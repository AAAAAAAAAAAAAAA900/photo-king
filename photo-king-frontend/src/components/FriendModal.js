import { Alert, Modal, TouchableOpacity, View } from "react-native";
import Pfp from "./Pfp";
import DefaultText from "./DefaultText";

export default function FriendModal({ friendClicked, setFriendClicked, friendModalVisible, setFriendModalVisible, removeFriend, removeFriendFromGroup }){

    return(
        friendClicked && (    // prevents instant rendering and friendClicked null errors
            <Modal
                animationType="fade"
                transparent={true}
                visible={friendModalVisible}
                onRequestClose={() => {setFriendModalVisible(false); setFriendClicked(null);}}
                style={{justifyContent:'center'}}
            >
                <View style={[styles.containerCenterAll, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                    <View style={styles.popupView}>
                        <View style={{flexDirection:'row'}}>
                            <Pfp url={friendClicked.pfp}/>
                            <DefaultText>{friendClicked.username}</DefaultText>
                        </View>
                        { removeFriend &&
                            <TouchableOpacity 
                            style={[styles.button, {backgroundColor:'red'}]}
                            onPress={() => {Alert.alert(
                                `Remove ${friendClicked.username} as friend?`,
                                "You will be removed from their friends list aswell.",
                                [
                                    { text: "Confirm", onPress: ()=>removeFriend(friendClicked.id)},
                                    { text: "Cancel", style: "cancel"}
                                ]
                            );}}
                            >
                                <DefaultText>Remove Friend</DefaultText>
                            </TouchableOpacity>
                        }
                        { removeFriendFromGroup &&
                            <TouchableOpacity 
                            style={[styles.button, {backgroundColor:'red'}]}
                            onPress={() => {Alert.alert(
                                `Remove ${friendClicked.username} from group?`,
                                "This group will no longer appear on their home screen.",
                                [
                                    { text: "Confirm", onPress: ()=>removeFriendFromGroup(friendClicked.id)},
                                    { text: "Cancel", style: "cancel"}
                                ]
                            );}}
                            >
                                <DefaultText>Remove From Group</DefaultText>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity 
                        style={styles.button}
                        onPress={() => { setFriendClicked(null); setFriendModalVisible(false);}}
                        >
                            <DefaultText>Close</DefaultText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    );
}