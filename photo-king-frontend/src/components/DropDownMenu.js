import { useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import DefaultText from './DefaultText';
import styles, { colors } from '../styles/ComponentStyles.js';

export default function DropDownMenu({data, selection, setSelection}){
    const [dropVisible, setDropVisible] = useState(false);

    const dropStyles = StyleSheet.create({
      selectionBox:{
        width:140,
        height: 30,
        borderWidth:1,
        borderRadius:2,
        padding:5,
        alignItems:'center',
        justifyContent:"space-between",
        flexDirection:'row'
      },
      container:{
        width:140,
        height: 100,
      },
      listContainer:{
        flex:1,
        borderWidth:1,
        borderRadius:2
      },
      listItem:{
        width:140,
        height: 30,
        padding:5,
        justifyContent:'center',
      }
    });

    const ListItem = ({text, setSelection}) => {
      return(
        <TouchableOpacity onPress={()=> {setSelection(text); setDropVisible(false);}} style={dropStyles.listItem}>
          <DefaultText>{text}</DefaultText>
        </TouchableOpacity>
      );
    }

    return(
      <View style={dropStyles.container}>
        <TouchableOpacity onPress={()=> setDropVisible(!dropVisible)} style={dropStyles.selectionBox}>
          <DefaultText>{selection}</DefaultText>
          <Image style={[styles.iconStyle, {width:'20%'}]} source={require('../../assets/icons/down.png')}/>
        </TouchableOpacity>
        { dropVisible &&
          <View style={dropStyles.listContainer}>
            <FlatList
            data={data}
            renderItem={(item) => <ListItem text={item.item} setSelection={setSelection}/>}
            keyExtractor={(item)=>item}
            />
          </View>
        }
      </View>
    );
  };