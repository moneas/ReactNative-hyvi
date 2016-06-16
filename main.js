'use strict';

var React = require('react-native');
var {AppRegistry, Navigator, StyleSheet, Text, View, Button} = React;
var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');
var Launch = require('./components/Launch');
var Register = require('./components/Register');
var Register2 = require('./components/Register2');
var Login = require('./components/Login');
var channels_overview = require('./components/Channels_overview');
var Settings = require('./components/Settings');
var Notification = require('./components/Notification');
var About = require('./components/About');
var Privacy = require('./components/Privacy');
var Profile = require('./components/Profile');
var Channel_setup1 = require('./components/Channel_setup1');
var Channel_setup2 = require('./components/Channel_setup2');
var Channel_setup3 = require('./components/Channel_setup3');
var Channel = require('./components/Channel');
var NewRecord = require('./components/NewRecord');
var PlayRecord = require('./components/PlayRecord');
var AddMembers = require('./components/AddMember');
var SearchByTag = require('./components/Search');

class TabIcon extends React.Component {
    render(){
        return (
            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
        );
    }
}

class Header extends React.Component {
    render(){
        return <Text></Text>
    }
}

class SettingsHeader extends React.Component {
    render(){
        return <Text></Text>
    }
}

export default class Main extends React.Component {
    render() {
        return (
            <Router name="root" hideNavBar={true}>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                <Schema name="back" sceneConfig={Navigator.SceneConfigs.FloatFromLeft}/>
                
                <Route name="login" 
                    component={Login} 
                    type='replace' 
                    title="Login" 
                    schema="default"
                    hideNavBar={true}
                    />

                <Route name="register" 
                    component={Register} 
                    type='replace' 
                    title="Sign up" 
                    schema="back" 
                    />
                <Route name="register2" component={Register2} title="Sign up"  schema="default"/>

                <Route name="channels_overview" 
                    title="Channels" 
                    component={channels_overview} 
                    type="replace" 
                    />
                
                <Route name="settings" 
                    title="Settings" 
                    component={Settings} 
                    type="replace"
                    />
                <Route name="settingsProfile" 
                    component={Profile} 
                    type="push" 
                    title="Profile"
                    />
                <Route name="settingsNotification" 
                    component={Notification} 
                    title="Notifications"
                    />
                <Route name="settingsAbout" 
                    component={About} 
                    title="About"
                    />
                <Route name="settingsPrivacy" 
                    component={Privacy} 
                    title="Privacy"
                    />
                <Route name="channelSetup1" 
                    component={Channel_setup1} 
                    title="Set Up Channel"
                    />
                <Route name="channelSetup2" 
                    component={Channel_setup2} 
                    title="Add Members"
                    />
                <Route name="channelSetup3" 
                    component={Channel_setup3} 
                    title="Review"
                    />
                <Route name="channel" 
                    component={Channel}
                    />
                <Route name="newRecord" 
                    component={NewRecord}
                    />
                <Route name="playRecord" 
                    component={PlayRecord}
                    />
                <Route name="addMembers" 
                    component={AddMembers}
                    />
                <Route name="search" 
                    component={SearchByTag}
                    />

                <Route name="launch" header={Header} component={Launch} wrapRouter={true} hideNavBar={true} initial={true}/>
            </Router>
        );
    }
}