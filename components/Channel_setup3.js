'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
var GridView = require('react-native-grid-view');
import NavigationBar from 'react-native-navbar';
var {gStyle, } = require('./Global');

var {
    StyleSheet,
    View,
    TextInput,
    Text,
    Image,
} = React;

class ChannelSetup3 extends ParseComponent {
    constructor(props) {
        super(props);
        this.groupMembers = new Array();
        var that = this;
        props.selectedMembers.map(function(user) {
            var pointer = {
                "__type": "Pointer",
                "className": "_User",
                "objectId": user.objectId
            };
            that.groupMembers.push(user.objectId);
        });
    }

    observe(props, state) {
        // console.log('observe called');
        return {
            user: ParseReact.currentUser
        };
    }

    renderItem(item) {
        // set blank url if not exist
        var profileImageUrl = '';
        if(item.hasOwnProperty('profileImage')) {
            profileImageUrl = item.profileImage._url;
        } else if (item.hasOwnProperty('fbProfileImageUrl')) {
            profileImageUrl = item.fbProfileImageUrl;
        }
        return (
            <Image
                style={styles.channelItem}
                source={{uri: profileImageUrl}}>
            </Image>
        );
    }

    createGroup() {
        ParseReact.Mutation.Create('Channel', {
            Caption: this.props.channelName,
            Owner: {
                    '__type': 'Pointer',
                    'className': '_User',
                    'objectId': this.data.user.objectId
                },
            members: this.groupMembers
        }).dispatch();
        Actions.channels_overview();
    }

    cancelGroup() {
        Actions.channels_overview();
    }

    render(){
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const titleConfig = {
            title: 'Review',
            tintColor: '#0066CD',
        };
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <View style={styles.inputs}>
                        <View style={styles.centered}>
                            <Text style={[styles.channelNameText, gStyle.fontOpenSans]}>{this.props.channelName}</Text>
                        </View>
                        <View style={styles.centered}>
                            <Text style={[styles.textMembers, gStyle.fontOpenSans]}>{this.props.selectedMembers.length} members</Text>
                        </View>
                    </View>
                    <GridView
                        items={this.props.selectedMembers}
                        itemsPerRow={4}
                        renderItem={this.renderItem.bind(this)}
                        style={styles.members}
                        cleanGrid={true}
                    />
                    <Button style={[styles.createBtn, styles.button, styles.whiteFont, styles.centered, gStyle.fontOpenSans]} onPress={this.createGroup.bind(this)}>
                        CREATE GROUP
                    </Button>
                    <Button style={[styles.cancelBtn, styles.button, styles.centered, gStyle.fontOpenSans]} onPress={this.cancelGroup.bind(this)}>
                        CANCEL
                    </Button>
                </View>
            </View>
        );
    }
}

var PIC_SIZE = 40;
var PIC_MARGIN = 10;

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F4EE',
        padding: 20,
        justifyContent: 'center',
    },
    createBtn: {
        backgroundColor: '#1D3EBE',
    },
    cancelBtn: {

    },
    inputs: {
        flex: 1,
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'flex-end',
    },
    button: {
        borderRadius: 5,
        marginBottom: 10,
        padding: 20,
    },
    channelName: {
        // backgroundColor: 'transparent',
        color: '#1D3EBE',

    },
    channelNameText: {
        fontSize: 24,
        color: '#1D3EBE',
    },
    textMembers: {
        fontSize: 18,
    },
    whiteFont: {
        color: '#FFF'
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    members: {
    },
    channelItem: {
        width: PIC_SIZE,
        height: PIC_SIZE,
        borderRadius: PIC_SIZE/2,
        borderWidth: 1,
        margin: PIC_MARGIN,
    },
});

module.exports = ChannelSetup3;
