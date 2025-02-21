import { View, Image, TouchableOpacity } from 'react-native';


export default function Pfp ({user}){
    return(
        <View style={{flex:1}}>
            { user.profileUrl ?
                <TouchableOpacity>
                    <Image  style={{height: 200, width:200}} source={{uri: user.profileUrl}} />
                </TouchableOpacity>
            : 
                <TouchableOpacity>
                    <Image  style={{height: 200, width:200}} source={require('../../assets/icons/pfp.png')} />
                </TouchableOpacity>
            }
        </View>
    );
}