import { Animated, FlatList, TouchableWithoutFeedback, View, Dimensions, Platform } from "react-native";
import { FriendPreview } from "./FriendSearch";
import { useRef, useEffect } from "react";
import DefaultText from "./DefaultText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles, { colors } from "../styles/ComponentStyles";


export default function Members({ membersPopUpVisible, setMembersPopUpVisible, users, press }){
    
    const {width, height} = Dimensions.get("window");
    const slideAnim = useRef(new Animated.Value(width)).current; // Start off screen (right side)
    const modalAdjustment = //header height + top safe area
    100 + (Platform.OS == 'ios' ? useSafeAreaInsets().top : 0);

    useEffect(() => {
        if (membersPopUpVisible) {
            Animated.timing(slideAnim, {
                toValue: 0, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: width, // Slide out of view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [membersPopUpVisible]);

    return(
        // membersPopUpVisible &&
            <Animated.View pointerEvents={membersPopUpVisible ? "auto" : "none"} style={{top:modalAdjustment ,height: height - modalAdjustment, width:'100%', position:'absolute', zIndex:2, flexDirection:'row-reverse',transform: [{ translateX: slideAnim }]}}>
                    <View style={{ width:'60%', height:'100%', backgroundColor:'white',}}>
                        {users.length ? 
                            <FlatList
                                data={[...users].sort((a,b)=>a.username.localeCompare(b.username))}
                                keyExtractor={(item) => item.id}
                                renderItem={(item) => <FriendPreview press={() => {press ? press(item.item) : null}} friend={item.item}/>}
                            />
                        : 
                            <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:10}}>
                                <DefaultText>Add some friends to the group!</DefaultText>
                            </View>
                        }
                    </View>
                    <TouchableWithoutFeedback onPress={()=>setMembersPopUpVisible(false)}>
                        <View style={{flex:1}}/>
                    </TouchableWithoutFeedback>
                </Animated.View>
        );
}