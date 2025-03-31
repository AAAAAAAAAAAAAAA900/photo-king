import { Animated, FlatList, TouchableWithoutFeedback, View, Dimensions, Platform, StyleSheet } from "react-native";
import { FriendPreview } from "./FriendSearch";
import { useRef, useEffect, useMemo, useCallback } from "react";
import DefaultText from "./DefaultText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles, { colors } from "../styles/ComponentStyles";


export default function Members({ membersPopUpVisible, setMembersPopUpVisible, users, press, ownerId, points }) {
    const { width, height } = Dimensions.get("window");
    const slideAnim = useRef(new Animated.Value(width)).current; // Start off screen (right side)
    const modalAdjustment = //header height + top safe area
        100 + (Platform.OS == 'ios' ? useSafeAreaInsets().top : 0);

    // gets first place ID. 
    const winnerId = useMemo((points)=>{
        let lowest = 0;
        let lowestId = '';
        for(const member in points){
            if (points[member] > lowest){
                lowestId = member;
                lowest = points[member];
            }
        }
        return lowestId;
    } ,[points]);
    
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

    // By points then lexicographically
    const memberSortFunction = (a,b) =>{
        const dif = points[b.id.toString()] - points[a.id.toString()];
        if( dif == 0 ){
            return a.username.localeCompare(b.username);
        }
        else{ 
            return dif;
        }
    };

    return (
        <Animated.View pointerEvents={membersPopUpVisible ? "auto" : "none"} 
        style={[
            { top: modalAdjustment, height: height - modalAdjustment, transform: [{ translateX: slideAnim }]},
            membersStyles.background
        ]}>
            <View style={membersStyles.container}>
                {/* MEMBERS LIST */}
                {users.length ?
                    <FlatList
                        data={[...users].sort(memberSortFunction)}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => 
                            <FriendPreview 
                                press={() => { press ? press(item) : null }} 
                                friend={item} 
                                points={points ? points[item.id.toString()] : undefined} 
                                isOwner={item.id == ownerId}
                                isWinner={item.id == winnerId}
                            />
                        }
                    />
                    :
                    <View style={membersStyles.containerCenterAll}>
                        <DefaultText>Add some friends to the group!</DefaultText>
                    </View>
                }
            </View>
            {/* CLOSE MODAL CLICK AREA */}
            <TouchableWithoutFeedback onPress={() => setMembersPopUpVisible(false)}>
                <View style={styles.container} />
            </TouchableWithoutFeedback>
        </Animated.View>
    );
}

const membersStyles = StyleSheet.create({
    background:{
        width: '100%', 
        position: 'absolute', 
        zIndex: 2, 
        flexDirection: 'row-reverse'
    },
    container:{ 
        width: '70%', 
        height: '100%', 
        backgroundColor: 'white',
        borderLeftWidth:1,
        borderColor:colors.grey
    },
    containerCenterAll:{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 10 
    }
});