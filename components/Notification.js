'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, Image, Switch} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
import NavigationBar from 'react-native-navbar';
var {gStyle, } = require('./Global');

class Notification extends ParseComponent {
    constructor(props) {
        console.log('constructor called');
        super(props);
        this.state = {
            isSoundOn: false,
            isVibrationOn: false,
            isFeedbackOn: false,
            isMessagesOn: true,
            isFriendRequestsOn: true,
        };
        // console.log('user: ' + JSON.stringify(this.data.user));
    }

    observe(props, state) {
        console.log('observe called');
        return {
            user: ParseReact.currentUser
        };
    }

    render(){
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const titleConfig = {
            title: 'Notification',
            tintColor: '#0066CD',
        };
        if(!this.data.user) {
            return (
                <View style={styles.container}></View>
            );
        } else {
            return (
                <View style={{flex: 1}}>
                    <NavigationBar
                        title={titleConfig}
                        leftButton={leftButtonConfig} />
                    <View style={styles.container}>
                        <View style={styles.subItemsList}>
                            <View style={styles.subItem}>
                                <View style={styles.itemTextView}>
                                    <Text style={[styles.greyText, gStyle.fontOpenSans]}>Sound</Text>
                                </View>
                                <Switch
                                  onValueChange={(value) => this.switchSetting('sound', value)}
                                  style={styles.itemSwitch}
                                  value={this.data.user.sound}
                                  onTintColor='#436185'
                                  tintColor='#E1DCD3' />
                            </View>
                            <View style={[styles.subItem, styles.mb20]}>
                                <View style={styles.itemTextView}>
                                    <Text style={[styles.greyText, gStyle.fontOpenSans]}>Vibration</Text>
                                </View>
                                <Switch
                                  onValueChange={(value) => this.switchSetting('vibration', value)}
                                  style={styles.itemSwitch}
                                  value={this.data.user.vibration}
                                  onTintColor='#436185'
                                  tintColor='#E1DCD3' />
                            </View>
                            <View style={styles.subItem}>
                                <View style={styles.itemTextView}>
                                    <Text style={[styles.greyText, gStyle.fontOpenSans]}>Feedback</Text>
                                </View>
                                <Switch
                                  onValueChange={(value) => this.switchSetting('feedback', value)}
                                  style={styles.itemSwitch}
                                  value={this.data.user.feedback}
                                  onTintColor='#436185'
                                  tintColor='#E1DCD3' />
                            </View>
                            <View style={styles.subItem}>
                                <View style={styles.itemTextView}>
                                    <Text style={[styles.greyText, gStyle.fontOpenSans]}>Messages</Text>
                                </View>
                                <Switch
                                  onValueChange={(value) => this.switchSetting('message', value)}
                                  style={styles.itemSwitch}
                                  value={this.data.user.message}
                                  onTintColor='#436185'
                                  tintColor='#E1DCD3' />
                            </View>
                            <View style={styles.subItem}>
                                <View style={styles.itemTextView}>
                                    <Text style={[styles.greyText, gStyle.fontOpenSans]}>Friend Requests</Text>
                                </View>
                                <Switch
                                  onValueChange={(value) => this.switchSetting('friend_request', value)}
                                  style={styles.itemSwitch}
                                  value={this.data.user.friend_request}
                                  onTintColor='#436185'
                                  tintColor='#E1DCD3' />
                            </View>
                        </View>
                    </View>
                </View>
            );
        }
    }

    switchSetting = (key, value) => {
        var userId = {
            className: '_User',
            objectId: this.data.user.objectId
        };
        var jsonObj = {};
        jsonObj[key] = value;
        ParseReact.Mutation.Set(userId, jsonObj).dispatch();
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F6F4EE',
        padding: 30,
    },

    subItemsList: {
        marginTop: 70,
    },

    subItem: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1,
        borderBottomColor: '#F1EAE2',
        borderColor: '#FFF',
        backgroundColor: '#FFF',
        flexDirection: 'row',
    },
    itemTextView: {
        flex: 1,
        justifyContent: 'center'
    },
    viewWithSize: {
        width: 100,
        height: 100,
        borderWidth: 1,
    },

    lastItem: {
        borderBottomColor: '#FFF',
    },

    itemSwitch: {
        // backgroundColor: '#436185'
    },

    greyText: {
        color: '#555',
    },

    mb20: {
        marginBottom: 20,
    },
});

module.exports = Notification;
