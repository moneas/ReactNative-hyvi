'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
import NavigationBar from 'react-native-navbar';
var {gStyle, } = require('./Global');

var {
    StyleSheet,
    View,
    Text,
    TextInput,
} = React;

class ChannelSetup1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                channelName: '',
            }
        };
        // Parse.initialize(CONFIG.PARSE.APP_ID, CONFIG.PARSE.JAVASCRIPT_KEY);
    }

    render(){
        var parent = this;
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const rightButtonConfig = {
            title: 'Next',
            handler: function () {
                Actions.channelSetup2(parent.state.value);
            },
        };

        const titleConfig = {
            title: 'Channels',
            tintColor: '#0066CD',
        };
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <View style={{backgroundColor: 'white', borderWidth: 1, borderColor: '#F1EAE2', borderRadius: 4,}}>
                        <View style={[gStyle.inputContainer, gStyle.lastInput]}>
                            <TextInput 
                                style={[styles.input, gStyle.fontOpenSans]}
                                placeholder="Name Your Channel"
                                value={this.state.channelName}
                                onChangeText={text => this.setState({value: {channelName: text}})}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#F6F4EE',
        padding: 20
    },
    input: {
        height: 40,
        fontSize: 14
    },
});

module.exports = ChannelSetup1;
