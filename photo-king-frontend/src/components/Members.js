import { Animated, FlatList, TouchableWithoutFeedback, View, Dimensions } from "react-native";
import { FriendPreview } from "./FriendSearch";
import { useRef, useEffect } from "react";

export default function Members({ membersPopUpVisible, setMembersPopUpVisible, group }){
    
    const {width, height} = Dimensions.get("window");
    const slideAnim = useRef(new Animated.Value(width)).current; // Start offscreen (right side)

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
            <Animated.View style={{height:'100%', width:'100%', position:'absolute', zIndex:2, flexDirection:'row-reverse',transform: [{ translateX: slideAnim }]}}>
                    <View style={{ width:'60%', height:'100%', backgroundColor:'white' }}>
                        <FlatList
                            data={group.users}
                            keyExtractor={(item) => item.id}
                            renderItem={(item) => <FriendPreview friend={item.item}/>}
                        />
                    </View>
                    <TouchableWithoutFeedback onPress={()=>setMembersPopUpVisible(false)}>
                        <View style={{flex:1}}/>
                    </TouchableWithoutFeedback>
                </Animated.View>
        );
}