'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, Image, TextInput, Alert} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
import NavigationBar from 'react-native-navbar';
var Global = require('./Global');
var { gStyle, } = Global;

class Profile extends ParseComponent {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                oldPass: '',
                newPass: '',
                passConfirm: '',
            },
        };
        
    }

    observe(props, state) {
        return {
            user: ParseReact.currentUser
        };
    }

    render() {
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const titleConfig = {
            title: 'Profile',
            tintColor: '#0066CD',
        };
        var profileImageUrl = '';
        if(this.data.user.hasOwnProperty('profileImage')) {
            profileImageUrl = this.data.user.profileImage._url;
        } else if (this.data.user.hasOwnProperty('fbProfileImageUrl')) {
            profileImageUrl = this.data.user.fbProfileImageUrl;
        }
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <View style={styles.subItemsList}>
                        <View style={styles.imgArea}>
                            <Image 
                                style={[styles.profileImage, styles.mb30]} 
                                resizeMode='cover'
                                source={{uri: profileImageUrl}}>
                            </Image>
                        </View>
                        <View style={[styles.textContainer, styles.mb30, gStyle.lastInput]}>
                            <Text style={gStyle.fontOpenSans}>{this.data.user.fullname}</Text>
                        </View>
                        <View style={styles.inputs}>                            
                            <View style={gStyle.inputContainer}>
                                <TextInput
                                    password={true}
                                    style={[styles.input, gStyle.fontOpenSans]}
                                    placeholder="Last Pasword"
                                    value={this.state.values.oldPass}
                                    onChangeText={text => this.setState({
                                        values: {
                                            oldPass: text,
                                            newPass: this.state.values.newPass,
                                            passConfirm: this.state.values.passConfirm
                                        }
                                    })}
                                />
                            </View>
                            <View style={gStyle.inputContainer}>
                                <TextInput
                                    password={true}
                                    style={[styles.input, gStyle.fontOpenSans]}
                                    placeholder="Pasword (8+ characters)"
                                    value={this.state.values.newPass}
                                    onChangeText={text => this.setState({
                                        values: {
                                            newPass: text,
                                            oldPass: this.state.values.oldPass,
                                            passConfirm: this.state.values.passConfirm
                                        }
                                    })}
                                />
                            </View>
                            <View style={[gStyle.inputContainer, gStyle.lastInput]}>
                                <TextInput
                                    password={true}
                                    style={[styles.input, gStyle.fontOpenSans]}
                                    placeholder="Pasword (8+ characters)"
                                    value={this.state.values.passConfirm}
                                    onChangeText={text => this.setState({
                                        values: {
                                            passConfirm: text,
                                            newPass: this.state.values.newPass,
                                            oldPass: this.state.values.oldPass
                                        }
                                    })}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.bottomArea}>
                        <Button style={[styles.saveBtn, gStyle.fontOpenSans]} onPress={()=>this._resetPassword()}>SAVE</Button>
                    </View>
                </View>
            </View>
        );
    }

    _resetPassword = () => {
        var that = this;
        if(this.state.values.newPass != this.state.values.passConfirm) {
            Alert.alert('Error', 'Password do not match. Please enter again.');
            this.setState({
                values: {
                    newPass: '',
                    passConfirm: '',
                }
            });
        }
        Parse.User.logIn(this.data.user.email, this.state.values.oldPass, {
            success: function(user) {
                console.log('login success');
                Parse.User.current().fetch().then(function(fetchedUser) {
                    console.log('User fetched:', fetchedUser);
                    fetchedUser.setPassword(that.state.values.newPass);
                    fetchedUser.save()
                    .then(
                        function(user) {
                            console.log('Password changed', user);
                            Alert.alert('Success', 'Your password has been successfully updated.');
                            Actions.pop();
                        },
                        function(error) {
                            Alert.alert('Error', error.message);
                        }
                    );
                });
            },
            error: function(user, error) {
                console.log('login error: ', user, error);
                Alert.alert('Error', 'Incorrect current password');
            }
        });
    };
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F4EE',
        padding: 30,
    },

    subItemsList: {
        flex: 1,
    },
    imgArea: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        margin: 20,
        borderWidth: 1,
        borderColor: 'black',
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    inputs: {
        marginBottom: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F1EAE2',
    },
    textContainer: {
        padding: 20,
        paddingLeft: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'white',
        backgroundColor: '#FFF',
        justifyContent: 'center',
        
    },
    input: {
        fontSize: 14,
        height: 40,
    },

    greyText: {
        color: '#555',
    },

    mb30: {
        marginBottom: 30,
    },

    bottomArea: {
        flex: 0.1,
        // justifyContent: 'flex-end',
        // alignItems: 'flex-end'
        alignItems: 'stretch',
    },
    saveBtn: {
        padding: 15,
        backgroundColor: '#436185',
        color: '#FFF',
        borderRadius: 5,
        width: null,
    },
    greyText: {
        color: '#555',
    },
});

module.exports = Profile;
