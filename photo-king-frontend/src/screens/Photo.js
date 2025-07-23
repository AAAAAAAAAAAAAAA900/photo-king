import { useRoute } from "@react-navigation/native";
import { Animated, FlatList, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, useAnimatedValue, BackHandler } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";
import { CommonActions } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { API_URL } from "../api/utils";


export default function PhotoScreen({ navigation }) {
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [photo, setPhoto] = useState(route.params?.photo);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const commentRef = useRef("");          // tracks text input text
    const commentBoxRef = useRef(null);     // for clearing text input on send
    const commenters = useRef({});          // map for previously queried commenters to reduce api calls
    const stompClient = new StompJs.Client({brokerURL: 'ws://' + API_URL + '/websocket'});

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

    // Adds back action listener
    useEffect(() => {
        //Open websocket connection 
        stompClient.activate();

        // Create Android back action handler
        const backAction = () => {
            navigateBack();
            return true;
        }
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        // Remove back handler and close socket 
        return () => {
            stompClient.deactivate();
            backHandler.remove();
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
            return;
        }
        try {
            stompClient.publish({
                destination: "/app/comments",
                body: JSON.stringify({
                    'message': comment,
                    'createdAt': Date.now(),
                    'sender': user,
                    'userImage': photo
                })
            });
        } catch (e) {
            console.log(e);
        }
    };

    const Comment = ({ comment }) => {
        const [commenter, setCommenter] = useState(null);

        const getCommenter = async (commenterId) => {
            if (commenters.current[commenterId]) {
                setCommenter(commenters.current[commenterId]);
            } else {
                try {
                    const response = await userApi.getFriendById(commenterId);
                    setCommenter(response.data);
                    commenters.current[commenterId] = response.data;
                }
                catch (e) {
                    console.log(e);
                }
            }
        }

        useEffect(() => {
            getCommenter(comment.userId);
        }, []);

        const commentStyles = StyleSheet.create({
            commentContainer: {
                alignSelf: comment.userId === user.id ? "flex-end" : "flex-start",
                margin: 10,
                marginHorizontal: 20
            },
            commentBubble: {
                maxWidth: '70%',
                minWidth: '15%',
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: comment.userId === user.id ? colors.secondary : colors.primary,
                borderRadius: 20,
            },
            textContainer: {
                justifyContent: "center"
            },
            commenterContainer: {
                gap: 5,
                flexDirection: comment.userId === user.id ? 'row-reverse' : 'row',
                alignSelf: 'baseline',
            },
            commenterName: {
                alignSelf: comment.userId === user.id ? "flex-end" : "flex-start",
                paddingRight: comment.userId === user.id ? 45 : 0,
                paddingLeft: comment.userId === user.id ? 0 : 45,
                maxWidth: '80%',
            },
            date: {
                alignSelf: comment.userId === user.id ? "flex-end" : "flex-start",
                paddingRight: comment.userId === user.id ? 45 : 0,
                paddingLeft: comment.userId === user.id ? 0 : 45,
                maxWidth: '80%',
                color: colors.grey,

            },
            commentText: {
                color: comment.userId === user.id ? 'white' : 'black',
            },
        });
        return (
            <View style={commentStyles.commentContainer}>
                <DefaultText numberOfLines={1} style={commentStyles.commenterName}>{(commenter && commenter.username ? commenter.username : '')}</DefaultText>
                <View style={commentStyles.commenterContainer}>
                    <Pfp url={commenter?.pfp} size={40} />
                    <View style={commentStyles.commentBubble}>
                        <View style={commentStyles.textContainer}>
                            <DefaultText style={commentStyles.commentText}>{comment.comment}</DefaultText>
                        </View>
                    </View>
                </View>
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
                        <Header title={group.name} backFunction={() => { navigateBack(); }} />
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
                        <ZoomablePhoto url={photo.url} />
                        <FadingIcon />
                    </View>

                    {/* Bottom bar */}
                    <View style={photoStyles.bottomBar}>
                        <TouchableOpacity
                            onPress={() => { downloadPhoto() }}
                            style={photoStyles.bottomButton}
                        >
                            <Image style={styles.iconStyle} source={require('../../assets/icons/download.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setCommentsModalVisible(true); }}
                            style={photoStyles.commentsButton}
                        >
                            <Image style={photoStyles.commentsIcon} source={require('../../assets/icons/comment.png')} />
                            <DefaultText style={styles.buttonText}>{photo.comments.length}</DefaultText>
                        </TouchableOpacity>
                        {photo.userId == user.id &&
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

const ZoomablePhoto = (({ url }) => {
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
        <ResumableZoom maxScale={resolution}>
            <Image source={{ uri: url }} style={{ ...size }} resizeMethod={'scale'} />
        </ResumableZoom>
    );
});

const photoStyles = StyleSheet.create({
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

});