'use strict';

var React = require('react-native');
var {View, Text, StyleSheet, Image, Navigator} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
var channelImg = require('../res/channel-inactive.png');
var {gStyle, Global} = require('./Global');

var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

import NavigationBar from 'react-native-navbar';

class Settings extends ParseComponent {
    constructor(props) {
        super(props);
        this.state = {
            profileImage: ''
        };

    }

    observe(props, state) {
        return {
            user: ParseReact.currentUser
        };
    }

    saveImage() {
        var imageFile = new Parse.File("profile.jpg", {base64: this.state.profileImage});
        imageFile.save().then(function () {
            var user=Global.currentUser
            var userId = {
                className: '_User',
                objectId: user.id
            };
            ParseReact.Mutation.Set(userId, {
                profileImage: imageFile
            }).dispatch();
        }, function (error) {
            console.log('Upload error: ', error);
            Alert.alert('Photo cannot be uploaded.');
        });
    }

    takePicture() {
        var that = this;
        ImagePickerManager.showImagePicker(cameraOptions, (response) => {
            console.log('Response = ', response);
         
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePickerManager Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can display the image using either data: 
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
             
                // uri (on iOS) 
                // const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                // uri (on android) 
                //const source = {uri: response.uri, isStatic: true};
             
                that.setState({
                    profileImage: source.uri
                });

                this.saveImage();
            }
        });
    }

    render(){
        const rightButtonConfig = {
            title: 'Log out',
            handler: function () {
                Parse.User.logOut();
                Actions.login();
            },
        };

        const titleConfig = {
            title: 'Settings',
            tintColor: '#0066CD',
        };
        // console.log('current user: ', this.data.user);
        if(this.data.user.hasOwnProperty('profileImage')) {
            this.setState({profileImage: this.data.user.profileImage._url});
        } else if (this.data.user.hasOwnProperty('fbProfileImageUrl')) {
            this.setState({profileImage: this.data.user.fbProfileImageUrl});
        }
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig} />
                <View style={styles.container}>
                    <View style={styles.topArea}>
                        <TouchableWithoutFeedback onPress={this.takePicture.bind(this)}>
                            <Image 
                                style={styles.profileImage} 
                                resizeMode='cover'
                                source={{uri: this.state.profileImage}}>
                            </Image>
                        </TouchableWithoutFeedback>
                        <Text style={[styles.profileTitle, styles.greyText, gStyle.fontOpenSans]}>{this.data.user.fullname}</Text>
                    </View>
                    <View style={styles.subItemsList}>
                        <View style={styles.subItem}>
                            <Button style={styles.itemButton} onPress={Actions.settingsProfile}>
                                <Text style={[styles.itemText, styles.greyText, gStyle.fontOpenSans]}>Your Profile</Text>
                                <Text style={[styles.itemIcon, styles.greyText, gStyle.fontOpenSans]}>-></Text>
                            </Button>
                        </View>
                        <View style={styles.subItem}>
                            <Button style={styles.itemButton} onPress={Actions.settingsNotification}>
                                <Text style={[styles.itemText, styles.greyText, gStyle.fontOpenSans]}>Notification</Text>
                                <Text style={[styles.itemIcon, styles.greyText, gStyle.fontOpenSans]}>-></Text>
                            </Button>
                        </View>
                        <View style={styles.subItem}>
                            <Button style={styles.itemButton} onPress={Actions.settingsPrivacy}>
                                <Text style={[styles.itemText, styles.greyText, gStyle.fontOpenSans]}>Privacy</Text>
                                <Text style={[styles.itemIcon, styles.greyText, gStyle.fontOpenSans]}>-></Text>
                            </Button>
                        </View>
                        <View style={styles.subItem}>
                            <Button style={[styles.lastItem, styles.itemButton]} onPress={Actions.settingsAbout}>
                                <Text style={[styles.itemText, styles.greyText, gStyle.fontOpenSans]}>About</Text>
                                <Text style={[styles.itemIcon, styles.greyText, gStyle.fontOpenSans]}>-></Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.bottomArea}>
                        <Button onPress={Actions.channels_overview}>
                            <Image style={styles.channelsBtn} source={channelImg} resizeMode='cover'></Image>
                        </Button>
                        <View style={styles.gapFill}></View>
                        <Image 
                            style={styles.smallImg}
                            source={{uri: this.style.profileImage}}>
                        </Image>
                    </View>
                </View>
                <View style={styles.indicatorContainer}>
                    <View style={styles.triangleContainer}>
                        <View style={[styles.triangle]}></View>
                    </View>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F6F4EE',
        padding: 20,
        paddingBottom: 10,
    },

    topArea: {
        flex: 0.3,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subItemsList: {
        flex: 0.5,
        justifyContent: 'center',
        borderRadius: 4,
    },
    profileImage: {
        margin: 20,
        borderWidth: 1,
        borderColor: 'black',
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    profileTitle: {
        fontSize: 18,
    },
    subItem: {
        padding: 20,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: '#FFF',
        backgroundColor: '#FFF',
    },
    lastItem: {
        borderBottomColor: '#FFF',
    },
    itemButton: {
        
    },
    itemText: {
        flex: 1,
    },
    itemIcon: {
        flex: 0.1,
    },

    bottomArea: {
        flex: 0.1,
        //justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    channelsBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    gapFill: {
        flex: 1,
    },
    smallImg: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 20,
    },

    greyText: {
        color: '#555',
    },
    indicatorContainer: {
        bottom: 0,
        backgroundColor: '#F6F4EE',
        paddingRight: 20,
        alignItems: 'flex-end',
    },
    triangleContainer: {
        width: 30,
        alignItems: 'center',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'black'
     }
});

module.exports = Settings;
