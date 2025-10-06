import { useRoute } from "@react-navigation/native";
import { Animated, FlatList, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, useAnimatedValue, BackHandler } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";
import { CommonActions } from "@react-navigation/native";
import React, { act, useCallback, useEffect, useRef, useState } from "react";
import imageApi from "../api/imageApi";
import Header from "../components/Header";
import userApi from "../api/userApi";
import Pfp from "../components/Pfp";
import * as FileSystem from 'expo-file-system';

import {
    fitContainer,
    ResumableZoom,
    useImageResolution,
} from 'react-native-zoom-toolkit';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import WebsocketService from "../utilities/WebsocketService";
import { useUser } from "../components/UserContext";
import { Filter } from "bad-words";

export default function PhotoScreen({ navigation }) {
    const route = useRoute();
    const { user } = useUser();
    const group = user.groups.find((g) => g.id == route.params?.groupId);
    const [photo, setPhoto] = useState(route.params?.photo);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const commentRef = useRef("");          // tracks text input text
    const commentBoxRef = useRef(null);     // for clearing text input on send
    const commenters = useRef({});          // map for previously queried commenters to reduce api calls
    const websocketServiceRef = useRef(WebsocketService);
    const profanityFilterRef = useRef(new Filter());

    const navigateBack = () => {
        navigation.dispatch((state) => {
            const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
            return CommonActions.reset({
                ...state,
                index: routes.length - 1,
                routes
            });
        });
        navigation.navigate(route.params.from, route.params);
    }

    // Adds back action listener and subscribes to comment websocket endpoint
    useEffect(() => {
        // Create Android back action handler
        const backAction = () => {
            navigateBack();
            return true;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // subscribe to comments endpoint
        const destination = "/topic/comment/" + photo.id;
        const callback = (message) => {
            setPhoto(prevPhoto => ({ ...prevPhoto, comments: [...(prevPhoto.comments), JSON.parse(message.body)] }));
        };
        websocketServiceRef.current.subscribe(destination, callback);

        // Remove back handler and unsubscribe from comments
        return () => {
            backHandler.remove();
            websocketServiceRef.current.unsubscribe(destination);
        }
    }, []);

    const deletePhoto = async () => {
        try {
            await imageApi.deleteImage(photo.id);
            navigateBack();
        } catch (error) {
            console.log(error);
        }
    };

    const downloadPhoto = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied to access media library');
                return;
            }

            const fileName = photo.url.split('/').pop();
            const localUri = FileSystem.documentDirectory + fileName;

            const downloadedFile = await FileSystem.downloadAsync(photo.url, localUri);
            console.log('Downloaded to:', downloadedFile.uri);

            if (downloadedFile && downloadedFile.uri) {
                await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);
                Alert.alert('Success', 'Image saved to gallery!');
            } else {
                throw new Error('File URI is invalid.');
            }
        } catch (err) {
            console.error('Save failed:', err);
            Alert.alert('Error', 'Could not save image.');
        }
    }


    const uploadComment = async (comment) => {
        if (!comment.trim()) {
            // empty comment case
            return;
        }
        try {
            // send through websocket
            websocketServiceRef.current.publish(
                "/app/comment/" + photo.id, // destination
                comment,                    // body
                { userId: user.id }         // headers
            );
        } catch (e) {
            console.log(e);
        }
    };

    const Comment = ({ comment }) => {
        const [commenter, setCommenter] = useState(null);
        const isUserRef = useRef(comment.userId === user.id);
        const blockedRef = useRef(Object.keys(user.blockedUsers).includes(String(comment.userId)));
        const [touched, setTouched] = useState(false);
        const [flagged, setFlagged] = useState(comment.flagged);

        const getCommenter = async (commenterId) => {
            if (blockedRef.current) {
                setCommenter({ username: "Blocked User", pfp: null });
                return;
            }
            if (commenters.current[commenterId]) {
                const cached = commenters.current[commenterId];
                if (cached instanceof Promise) {
                    const commenter = await cached;
                    setCommenter(commenters.current[commenterId]);
                } else {
                    setCommenter(cached);
                }
            } else {
                try {
                    commenters.current[commenterId] = userApi.getFriendById(commenterId).then(
                        (response) => {
                            commenters.current[commenterId] = response.data;
                            setCommenter(response.data);
                        });
                }
                catch (e) {
                    console.log(e);
                    delete commenters.current[commenterId];
                }
            }
        }

        const blockCommentPressed = useCallback(() => {
            if (blockedRef.current) {
                Alert.alert("This user is already blocked.");
            } else {
                Alert.alert(
                    "Do you want to report this user?",
                    "It will make all of their content unviewable.",
                    [
                        { text: "Block", style: "destructive", onPress: () => { userApi.blockUser(user.id, comment.userId) } },
                        { text: "Cancel", style: "cancel" },
                    ]
                )
            }
        }, [blockedRef.current]);

        const flagCommentPressed = useCallback(() => {
            if (flagged) {
                Alert.alert("This comment has already been reported and is awaiting review.");
            } else {
                Alert.alert(
                    "Do you want to report this comment?",
                    "It will make it unviewable until a team member reviews it.",
                    [
                        { text: "Report", style: 'destructive', onPress: () => { 
                            setFlagged(true); 
                            const commentIndex = photo.comments.indexOf(comment);
                            setPhoto((prevPhoto) => { return {...prevPhoto, comments: prevPhoto.comments.with(commentIndex, {...comment, flagged:true})};}); 
                            imageApi.flagComment(comment.id)
                         }},
                        { text: "Cancel", style: "cancel" },
                    ]
                )
            }
        }, [flagged]);

        useEffect(() => {
            getCommenter(comment.userId);
        }, []);

        const commentStyles = StyleSheet.create({
            commentContainer: {
                alignSelf: isUserRef.current ? "flex-end" : "flex-start",
                margin: 10,
            },
            commentBubble: {
                maxWidth: '70%',
                minWidth: '15%',
                padding: 10,
                marginRight: isUserRef.current ? 20 : 0,
                marginLeft: isUserRef.current ? 0 : 20,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: isUserRef.current ? 'flex-end' : 'flex-start',
                backgroundColor: flagged ? "orange" : isUserRef.current ? colors.secondary : colors.primary,
                borderRadius: 20,
                borderTopRightRadius: isUserRef.current ? 5 : 20,
                borderTopLeftRadius: isUserRef.current ? 20 : 5,
            },
            textContainer: {
                justifyContent: "center"
            },
            commenterContainer: {
                gap: 5,
                flexDirection: isUserRef.current ? 'row-reverse' : 'row',
                alignSelf: isUserRef.current ? 'flex-end' : 'flex-start',
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 3,
            },
            commenterName: {
                fontSize: 14,
                maxWidth: '80%',
            },
            commentText: {
                color: isUserRef.current ? 'white' : 'black',
            },
            actionContainer: {
                flexDirection: 'row',
                width: 150,
                height: 25,
                alignSelf: isUserRef.current ? 'flex-end' : 'flex-start',
                marginHorizontal: 30,
                gap: 5,
                marginBottom: 10
            },
            blockButton: {
                flex: 1,
                backgroundColor: 'red',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
            },
            flagButton: {
                flex: 1,
                backgroundColor: 'orange',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
            },
            iconStyle: [
                styles.iconStyle,
                {
                    width: '25%',
                }
            ],
        });
        return (
            <View>
                <TouchableOpacity style={commentStyles.commentContainer} activeOpacity={1} onPress={() => { setTouched((touched) => { return !touched }); }}>
                    <View style={commentStyles.commenterContainer}>
                        <Pfp url={commenter?.pfp} size={30} />
                        <DefaultText numberOfLines={1} style={commentStyles.commenterName}>{(commenter && commenter.username ? commenter.username : '')}</DefaultText>
                    </View>
                    <View style={commentStyles.commentBubble}>
                        <View style={commentStyles.textContainer}>
                            <DefaultText style={commentStyles.commentText}>{blockedRef.current || flagged ? "Blocked message." : profanityFilterRef.current.clean(comment.comment)}</DefaultText>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* FLAG AND BLOCK BUTTONS */}
                {(touched && !isUserRef.current) &&
                    <View style={commentStyles.actionContainer}>
                        <TouchableOpacity style={commentStyles.flagButton}
                            onPress={flagCommentPressed}>
                            <DefaultText style={styles.buttonText}>Flag</DefaultText>
                            <Image style={commentStyles.iconStyle} source={require('../../assets/icons/flag.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity style={commentStyles.blockButton}
                            onPress={blockCommentPressed}>
                            <DefaultText style={styles.buttonText}>Block</DefaultText>
                            <Image style={commentStyles.iconStyle} source={require('../../assets/icons/block.png')} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        );
    }

    const FadingIcon = useCallback(() => {
        const fadeValue = useAnimatedValue(1);

        const fadeOut = () => {
            Animated.timing(fadeValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        };

        useEffect(() => {
            setTimeout(fadeOut, 1000);
        }, []);

        return (
            <Animated.View pointerEvents="none" style={[{ opacity: fadeValue }, photoStyles.fadingIcon]}>
                <Image style={styles.iconStyle} source={require('../../assets/icons/spread.png')} />
            </Animated.View>
        );
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                {/* View stops zoomable image from appearing above header on zoom */}
                <View style={[{ height: (Platform.OS == 'ios' ? useSafeAreaInsets().top : 0) }, photoStyles.cover]} />
                <SafeAreaView style={styles.safeAreaContainer}>
                    <View style={photoStyles.cover}>
                        <Header title={group.name} backFunction={() => { navigateBack(); }} buttons={
                            /* FLAG IMAGE BUTTON */
                            <TouchableOpacity style={photoStyles.flagButton}
                                onPress={() => {
                                    if (photo.flagged) {
                                        Alert.alert("This photo has already been reported and is awaiting review.");
                                    } else {
                                        Alert.alert(
                                            "Do you want to report this photo?",
                                            "It will make it unviewable until a team member reviews it.",
                                            [
                                                { text: "Cancel", style: "cancel" },
                                                { text: "Report", onPress: () => { setPhoto({ ...photo, flagged: true }); imageApi.flagImage(photo.id); } }
                                            ]
                                        )
                                    }
                                }}>
                                <Image style={styles.iconStyle} source={require('../../assets/icons/flag.png')} />
                            </TouchableOpacity>
                        } />
                    </View>

                    {/* I do not understand but this view is required for the modal to work on android */}
                    <View>
                        {/* Comments Modal */}
                        <Modal
                            visible={commentsModalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => setCommentsModalVisible(false)}
                        >
                            <TouchableOpacity activeOpacity={1} style={styles.container} onPress={() => setCommentsModalVisible(false)} />
                            <View style={photoStyles.commentModalBox}>
                                {/* top tab */}
                                <TouchableOpacity activeOpacity={1} onPress={() => setCommentsModalVisible(false)} style={photoStyles.commentBoxTopTab}>
                                    <DefaultText style={styles.bold}>Comments</DefaultText>
                                    <Image style={photoStyles.downIcon} source={require('../../assets/icons/down.png')} />
                                </TouchableOpacity>

                                {/* Comments */}
                                <View style={styles.container}>
                                    {photo.comments.length ?
                                        <FlatList
                                            data={[...photo.comments].sort((a, b) => { return (new Date(b.date).getTime() - new Date(a.date).getTime()); })}
                                            keyExtractor={(item) => item.id}
                                            inverted={true}
                                            renderItem={({ item }) => <Comment comment={item} />}
                                            keyboardShouldPersistTaps="handled"
                                        />
                                        :
                                        <View style={styles.containerCenterAll}>
                                            <DefaultText>Be the first to comment!</DefaultText>
                                        </View>
                                    }
                                </View>

                                {/* Comment input box */}
                                <KeyboardAvoidingView
                                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                                    keyboardVerticalOffset={Platform.OS == "ios" ? 200 : undefined}
                                >
                                    <View style={photoStyles.commentInputContainer}>
                                        <TextInput
                                            ref={commentBoxRef}
                                            style={photoStyles.commentInput}
                                            onChangeText={(txt) => { commentRef.current = txt; }}
                                            placeholder="Enter Comment..."
                                            maxLength={250}
                                        />
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            uploadComment(commentRef.current);
                                            commentBoxRef.current.clear();
                                            commentBoxRef.current.blur();
                                        }}>
                                            <DefaultText style={styles.buttonText}>Send</DefaultText>
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAvoidingView>
                            </View>
                        </Modal>
                    </View>

                    {/* Photo */}
                    <View style={photoStyles.backgroundContainer}>
                        <ZoomablePhoto url={photo.url} flagged={photo.flagged} />
                        <FadingIcon />
                    </View>

                    {/* Bottom bar */}
                    <View style={photoStyles.bottomBar}>
                        {/* Download button */}
                        {!photo.flagged &&
                            <TouchableOpacity
                                onPress={() => { downloadPhoto() }}
                                style={photoStyles.bottomButton}
                            >
                                <Image style={styles.iconStyle} source={require('../../assets/icons/download.png')} />
                            </TouchableOpacity>
                        }
                        <TouchableOpacity
                            onPress={() => { setCommentsModalVisible(true); }}
                            style={photoStyles.commentsButton}
                        >
                            <Image style={photoStyles.commentsIcon} source={require('../../assets/icons/comment.png')} />
                            <DefaultText style={styles.buttonText}>{photo.comments.length}</DefaultText>
                        </TouchableOpacity>
                        {(photo.userId == user.id || group.ownerId == user.id) &&
                            <TouchableOpacity
                                onPress={() => {
                                    Keyboard.dismiss();
                                    Alert.alert(
                                        `Delete this photo?`,
                                        "It will be removed from the group for everyone.",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            { text: "Confirm", onPress: () => { deletePhoto() } }
                                        ]
                                    );
                                }}
                                style={photoStyles.bottomButton}
                            >
                                <DefaultText style={styles.buttonText}>Delete</DefaultText>
                            </TouchableOpacity>
                        }
                    </View>
                </SafeAreaView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const ZoomablePhoto = (({ url, flagged = false }) => {
    const { width, height } = useWindowDimensions();
    const { isFetching, resolution } = useImageResolution({ uri: url });
    const heightOffset = //header height + bottom bar height + top safe area
        100 + 60 + (Platform.OS == 'ios' ? useSafeAreaInsets().top : 0);

    if (isFetching || resolution === undefined) {
        return null;
    }

    const size = fitContainer(resolution.width / resolution.height, {
        width,
        height: height - heightOffset,
    });

    return (
        flagged ?
            <View style={styles.containerCenterAll}>
                <Image source={require('../../assets/icons/flag.png')} style={photoStyles.flaggedIcon} />
                <DefaultText style={photoStyles.flaggedText}>A user has reported this photo: review pending.</DefaultText>
            </View>
            :
            <ResumableZoom maxScale={resolution}>
                <Image source={{ uri: url }} style={{ ...size }} resizeMethod={'scale'} />
            </ResumableZoom>
    );
});

const photoStyles = StyleSheet.create({
    flagButton: {
        backgroundColor: "orange",
        borderRadius: 25,
        height: 50,
        width: 50,
        right: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    fadingIcon: {
        position: "absolute",
        backgroundColor: colors.secondary,
        borderRadius: 300,
        height: '15%',
        width: '25%',
        top: '42.5%',
        left: '37.5%',
        padding: 4,
        alignItems: "center",
        boxShadow: '5 5 5 0 rgba(0, 0, 0, 0.25)'
    },
    cover: {
        zIndex: 4,
        backgroundColor: colors.secondary
    },
    commentModalBox: {
        position: "absolute",
        bottom: 0,
        height: '75%',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        width: '100%',
        backgroundColor: 'white',
        borderTopWidth: 3,
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderColor: colors.secondary
    },
    commentBoxTopTab: {
        height: 60,
        borderBottomWidth: 0.2,
        borderColor: colors.secondary,
        width: '100%',
        alignItems: "center",
        justifyContent: "center"
    },
    downIcon: [
        styles.iconStyle,
        {
            height: '40%'
        }
    ],
    commentInputContainer: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        flexDirection: "row",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: colors.greyWhite
    },
    commentInput: [
        styles.textIn,
        {
            width: '70%'
        }
    ],
    backgroundContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    bottomBar: {
        height: 60,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: colors.primary
    },
    bottomButton: {
        backgroundColor: colors.secondary,
        borderRadius: 20,
        height: 40,
        width: '30%',
        justifyContent: "center",
        alignItems: "center"
    },
    commentsButton: {
        flexDirection: "row",
        gap: 5,
        backgroundColor: colors.secondary,
        borderRadius: 20,
        height: 40,
        width: '30%',
        justifyContent: "center",
        alignItems: "center"
    },
    commentsIcon: [
        styles.iconStyle,
        {
            width: '35%'
        }
    ],
    flaggedIcon: {
        height: '60%',
        aspectRatio: 1,
        resizeMode: 'contain',
        backgroundColor: 'orange',
        borderRadius: 1000,
    },
    flaggedText: {
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'DMSans-Bold',
    }
});