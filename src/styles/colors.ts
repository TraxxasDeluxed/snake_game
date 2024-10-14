import * as React from 'react';
import {SafeAreaView} from 'react-native';

export default function Game():JSX.Element{
    return <SafeAreaView></SafeAreaView> 
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#fff';
        alignItems: 'center';
        justifyContent: 'center'
    }
})