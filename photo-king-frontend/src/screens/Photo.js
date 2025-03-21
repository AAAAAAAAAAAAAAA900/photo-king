import { useRoute } from "@react-navigation/native";
import { FlatList, Image, Modal, SafeAreaView, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import styles, { colors } from "../styles/ComponentStyles";
import DefaultText from "../components/DefaultText";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import imageApi from "../api/imageApi";
import Header from "../components/Header";
import { withTheme } from "@rneui/themed";
import { color } from "@rneui/themed/dist/config";
import userApi from "../api/userApi";
import Pfp from "../components/Pfp";



export default function PhotoScreen ({navigation}){
    const route = useRoute();
    const user = route.params?.user;
    const group = route.params?.group;
    const [photo, setPhoto] = useState(route.params?.photo);
    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const commentRef = useRef("");
    const commentBoxRef = useRef(null);
    const commenters = useRef({});
    const { width, height } = useWindowDimensions();

    const deletePhoto = async () => {
        try {
            const response = await imageApi.deleteImage(photo.id);

            navigation.dispatch((state) => {
                const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                return CommonActions.reset({
                    ...state,
                    index: routes.length - 1,
                    routes
                });
            });
            navigation.navigate('Group', route.params);
        } catch (error) {
            console.log(error);
        }
    };

    const uploadComment = async (comment) =>{
        if(!comment.trim()){
            return;
        }
        try{
            const postResponse = await imageApi.uploadComment(comment, user.id, photo.id);
            const getResponse = await imageApi.getComments(photo.id);
            setPhoto({...photo, comments:getResponse.data});
        } catch (e){
            console.log(e);
        }
    };

    const Comment = ({comment}) => {
        const [commenter, setCommenter] = useState(null);
        const [loading, setLoading] = useState(true);

        const getCommenter = async (commenterId) => {
            if (commenters.current[commenterId]){
                setCommenter(commenters.current[commenterId]);
            } else {
                try{
                    const response = await userApi.getFriendById(commenterId);
                    setCommenter(response.data);
                    commenters.current[commenterId] = response.data;
                }
                catch (e){
                    console.log(e);
                }
            }
        }

        useEffect(()=>{
            if(commenter){
                setLoading(false);
            } else{
                getCommenter(comment.userId);
            }
        }, [commenter]);

        const commentStyles = StyleSheet.create({
            commentContainer: {
                alignSelf: comment.userId=== user.id ? "flex-end" : "flex-start",
                margin:10,
                marginHorizontal:20
            },
            commentBubble:{
                maxWidth:'70%', 
                minWidth:'15%', 
                padding:10, 
                alignItems:"center",
                justifyContent:"center", 
                backgroundColor: comment.userId=== user.id ? colors.secondary : colors.primary,
                borderRadius:20,
            },
            textContainer:{
                justifyContent:"center"
            },
            commenterContainer:{
                gap:5,
                flexDirection: comment.userId=== user.id ? 'row-reverse' : 'row',
                alignSelf:'baseline',
            },
            commenterName:{
                alignSelf: comment.userId=== user.id ? "flex-end" : "flex-start",
                paddingRight: comment.userId=== user.id ? 45 : 0,
                paddingLeft: comment.userId=== user.id ? 0 : 45,
                maxWidth:'80%',
            },
            date:{
                alignSelf: comment.userId=== user.id ? "flex-end" : "flex-start",
                paddingRight: comment.userId=== user.id ? 45 : 0,
                paddingLeft: comment.userId=== user.id ? 0 : 45,
                maxWidth:'80%',
                color: colors.grey,

            },
            commentText: {
                color: comment.userId=== user.id ? 'white' : 'black',
            },
        });
        return(
            <View style={commentStyles.commentContainer}>
                <DefaultText numberOfLines={1} style={commentStyles.commenterName}>{(commenter && commenter.username ? commenter.username : '')}</DefaultText>
                <View style={commentStyles.commenterContainer}>
                    <Pfp url={commenter?.pfp} size={40}/>
                    <View style={commentStyles.commentBubble}>
                        <View style={commentStyles.textContainer}>
                            <DefaultText style={commentStyles.commentText}>{comment.comment}</DefaultText>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={{flex:1}}>
                <Header title={group.name} backFunction={()=>{
                    navigation.dispatch((state) => {
                        const routes = state.routes.slice(0, -2); // Pop 2 screens from stack
                        return CommonActions.reset({
                            ...state,
                            index: routes.length - 1,
                            routes
                        });
                    });
                    navigation.navigate('Group', {user:user, group:group});
                }}/>

                {/* Picture Modal */}
                <Modal
                animationType="fade"
                transparent={true}
                visible={photoModalVisible}
                onRequestClose={() => {setPhotoModalVisible(false);}}
                >
                    <TouchableOpacity activeOpacity={1} onPress={()=>setPhotoModalVisible(false)}
                    style={[styles.containerCenterAll, {flex:1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}]}>
                        <TouchableOpacity style={{height:'90%', width:'90%'}} activeOpacity={1}>
                            <Image
                            source={{uri: photo.url}}
                            style={{height:'100%', width:'100%', resizeMode:'contain'}}
                            />
                            <TouchableOpacity
                            onPress={()=>{setPhotoModalVisible(false);}}
                            style={{position:'absolute', top:height*0.1, right:width*0.1, height:60, width:60}}
                            >
                                <Image style={[styles.iconStyle, {borderRadius:5, backgroundColor:'rgba(0,0,0,0.2)', boxShadow: '0 0 5 2 rgba(0, 0, 0, 0.25)'}]} source={require('../../assets/icons/close.png')}/>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

                {/* Comments Modal */}
                <Modal
                visible={commentsModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={()=>setCommentsModalVisible(false)}
                >
                    <View style={{flex:1}}>
                        <TouchableOpacity  activeOpacity={1} style={{flex:1}} onPress={()=> setCommentsModalVisible(false)}/>
                        <View style={{position:"absolute", bottom:0, height:'75%', borderTopLeftRadius:40, borderTopRightRadius:40, width:'100%', backgroundColor:'white', borderTopWidth:3, borderRightWidth:3, borderLeftWidth:3, borderColor:colors.secondary}}>
                            <TouchableOpacity activeOpacity={1} onPress={()=> setCommentsModalVisible(false)} style={{height:60, borderBottomWidth:0.2, borderColor: colors.secondary, width:'100%', alignItems:"center", justifyContent:"center"}}>
                                <DefaultText style={styles.bold}>Comments</DefaultText>
                                <Image style={[styles.iconStyle,{height:'40%'}]} source={require('../../assets/icons/down.png')}/>
                            </TouchableOpacity>
                            <View style={{flex:1}}>
                                {photo.comments.length ?
                                    <FlatList
                                    data={[...photo.comments].sort((a,b) => {return (new Date(b.date).getTime() - new Date(a.date).getTime());})}
                                    keyExtractor={(item)=>  item.id}
                                    inverted={true}
                                    renderItem={(item)=> <Comment comment={item.item}/>}
                                    keyboardShouldPersistTaps="handled"
                                    />
                                :
                                    <View style={styles.containerCenterAll}>
                                        <DefaultText>Be the first to comment!</DefaultText>
                                    </View>
                                }
                            </View>
                            <KeyboardAvoidingView
                            behavior={Platform.OS == "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={Platform.OS == "ios" ? 200 : undefined}
                            >
                                <View style={{ padding:10,alignItems:"center", justifyContent:"center", gap:5, flexDirection:"row", borderTopLeftRadius:10, borderTopRightRadius:10, backgroundColor:colors.greyWhite}}>
                                    <TextInput
                                    ref={commentBoxRef}
                                    style={[styles.textIn, {width:'70%', borderWidth:0}]}
                                    onChangeText={(txt)=>{commentRef.current = txt;}}
                                    placeholder="Enter Comment..."
                                    />
                                    <TouchableOpacity style={styles.button} onPress={()=>{
                                        uploadComment(commentRef.current);
                                        commentBoxRef.current.clear();
                                        commentBoxRef.current.blur();
                                    }}>
                                        <DefaultText style={[{color:'white'}, styles.bold]}>Send</DefaultText>
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAvoidingView>
                        </View>
                    </View>
                </Modal>

                <TouchableOpacity 
                style={{flex:1, backgroundColor:colors.greyWhite }}
                onPress={()=>{setPhotoModalVisible(true);}}
                >
                    <Image 
                    source={{uri: photo.url}}
                    style={{height:'100%', width:'100%', resizeMode:'contain'}}
                    />
                </TouchableOpacity>
                <View style={{height:60, flexDirection:'row', alignItems:"center", justifyContent:"space-between", padding:10, backgroundColor:colors.primary}}>
                    <TouchableOpacity
                    onPress={()=>{Keyboard.dismiss();}}
                    style={{backgroundColor: colors.secondary, borderRadius:20, height:40, width:'30%', justifyContent:"center", alignItems:"center"}}
                    >
                        <Image style={styles.iconStyle} source={require('../../assets/icons/download.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>{setCommentsModalVisible(true);}}
                    style={{flexDirection:"row", gap:5,backgroundColor: colors.secondary, borderRadius:20, height:40, width:'30%', justifyContent:"center", alignItems:"center"}}
                    >
                        <Image style={[styles.iconStyle, {width:'35%'}]} source={require('../../assets/icons/comment.png')}/>
                        <DefaultText style={[styles.bold, {color:'white'}]}>{photo.comments.length}</DefaultText>
                    </TouchableOpacity>
                    { photo.userId == user.id &&
                        <TouchableOpacity
                        onPress={()=>{Keyboard.dismiss(); 
                                        Alert.alert(
                                            `Delete this photo?`,
                                            "It will be removed from the group for everyone.",
                                            [
                                                { text: "Cancel", style: "cancel"},
                                                { text: "Confirm", onPress: () => {deletePhoto()} }
                                            ]
                                        );}}
                        style={{backgroundColor: colors.secondary, borderRadius:20, height:40, width:'30%', justifyContent:"center", alignItems:"center"}}
                        >
                            <DefaultText style={[styles.bold, {color:'white'}]}>Delete</DefaultText>
                        </TouchableOpacity>
                    }
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}