import { Animated, FlatList, TouchableWithoutFeedback, View, Dimensions } from "react-native";
import { FriendPreview } from "./FriendSearch";
import { useRef, useEffect } from "react";
import DefaultText from "./DefaultText";

export default function Members({ membersPopUpVisible, setMembersPopUpVisible, users, press }){
    
    const offScreen = Dimensions.get("window").width;
    const slideAnim = useRef(new Animated.Value(offScreen)).current; // Start offscreen (right side)

    useEffect(() => {
        if (membersPopUpVisible) {
            Animated.timing(slideAnim, {
                toValue: 0, // Slide into view
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: offScreen, // Slide out of view
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [membersPopUpVisible]);

    return(
        // membersPopUpVisible &&
            <Animated.View style={{top: 90 ,height:'90%', width:'100%', position:'absolute', zIndex:2, flexDirection:'row-reverse',transform: [{ translateX: slideAnim }]}}>
                    <View style={{ width:'60%', height:'100%', backgroundColor:'white' }}>
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