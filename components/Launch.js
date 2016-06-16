'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, TouchableHighlight, Image} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');

import CONFIG from '../lib/config';
var bgImage = require('../res/home_bg.png');
var logo = require('../res/logo.png');
var {gStyle, } = require('./Global');

Parse.initialize(CONFIG.PARSE.APP_ID, CONFIG.PARSE.JAVASCRIPT_KEY);

class Launch extends React.Component {
    render(){
        return (
            <View style={styles.container}>
                <Image style={styles.background_image} source={bgImage} resizeMode='cover'>
                    <View style={styles.justify}>
                        <Image style={styles.logoImg} source={logo} resizeMode='cover'></Image>
                        <Text style={[styles.welcome, gStyle.fontOpenSans]}>Take the Tour with Mike</Text>
                    </View>
                    <View style={styles.buttonGroup}>
                        <Button style={[styles.signup_button, styles.buttons, gStyle.fontOpenSans]} onPress={Actions.register}>
                            SIGN UP
                        </Button>
                        <Button style={[styles.login_button, styles.buttons, gStyle.fontOpenSans]} onPress={()=>Actions.login({data:"Custom data", title:'Custom title' })}>
                            LOG IN
                        </Button>
                    </View>
                </Image>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch'
    },

    background_image: {
        flex: 1,
        width: null,
        height: null,
    },

    logoImg: {
        width: 100,
        height: 80,
    },

    justify: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 100,
    },

    welcome: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30
    },

    buttonGroup: {
        flex: 0.2,
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },

    buttons: {
        color: 'white',
        borderRadius: 4,
        textAlign: 'center',
        flex: .5,
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        width: 155,
    },

    signup_button: {
        backgroundColor: '#F34600',        
        marginRight: 20,
    },

    login_button: {
        backgroundColor: '#0066CD',
    },

});

module.exports = Launch;