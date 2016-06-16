'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
import NavigationBar from 'react-native-navbar';
var SearchBar = require('react-native-search-bar');
var {ItemCheckbox} = require('react-native-item-checkbox');
var Global = require('./Global');
var { gStyle, } = Global;

var page = null;
var isInitial = 1;

var {
    StyleSheet,
    View,
    Text,
    TextInput,
    ListView,
    Image,
} = React;

class ChannelSetup2 extends ParseComponent {

    constructor(props) {
        super(props);
        this.state = {
            values: {
                channelName: props.channelName,
                selectedMembers: []
            },
            searchText: ''
        };
        this.members = [];
    }

    observe(props, state) {
        return {
            user: ParseReact.currentUser,
            users: (new Parse.Query('_User')).notEqualTo('objectId', Global.currentUser.id),
        };
    }

    _onCheckCallback = (rowID) => {
        this.members[rowID].isSelected = 1;
    };

    _onUncheckCallback = (rowID) => {
        // console.log('unchecked: ', rowID);
        this.members[rowID].isSelected = 0;
    };

    renderRow(rowData, sectionID, rowID) {
        console.log('rendering row ', rowID, rowData);
        if(rowData.fullname.indexOf(this.state.searchText) == -1) {
            return (
                <View></View>
            );
        }
        console.log('iamge not null ', rowID);
        // console.log('user data: ', rowData);
        // set blank url if not exist
        var profileImageUrl = '';
        if(rowData.hasOwnProperty('profileImage')) {
            profileImageUrl = rowData.profileImage._url;
        } else if (rowData.hasOwnProperty('fbProfileImageUrl')) {
            profileImageUrl = rowData.fbProfileImageUrl;
        }
        console.log('rendered row ', rowID, profileImageUrl);
        return (
            <View style={styles.row}>
                <View style={styles.rowImageContainer}>
                    <Image
                        style={styles.rowImage}
                        source={{uri: profileImageUrl}}>
                    </Image>
                </View>
                <View style={styles.rowName}>
                    <Text style={gStyle.fontOpenSans}>{rowData.fullname}</Text>
                </View>
                <View style={styles.rowSelection}>
                    <ItemCheckbox
                        onCheck={() => this._onCheckCallback(rowID)}
                        onUncheck={() => this._onUncheckCallback(rowID)}
                        color='#1D3EBE'
                        size={20}
                    />
                </View>
            </View>
        );
    }

    _onKeywordChange = (text) => {
        var that = this;
        // console.log(text);
        this.setState({searchText: text});
        this.members.map(function(member, i){
            if(member.fullname.indexOf(that.state.searchText) == -1) {
                member.isSelected = false;
            }            
        });
        // this.state.searchText = text
    };

    render(){
        console.log('calling render');
        var that=this;
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const rightButtonConfig = {
            title: 'Next',
            handler: function () {
                that.setState({
                    values: {
                        channelName: that.state.values.channelName,
                        selectedMembers: []
                    }
                });
                that.state.values.selectedMembers.push(that.data.user);
                that.members.map(function(user) {
                    if(user.isSelected == 1) {
                        that.state.values.selectedMembers.push(user);
                    }
                });
                Actions.channelSetup3(that.state.values);
            },
        };
        const titleConfig = {
            title: 'Add Members',
            tintColor: '#0066CD',
        };

        if(this.data.users.length == 0) {
            return(
                <View style={{flex: 1}}>
                    <NavigationBar
                        title={titleConfig}
                        rightButton={rightButtonConfig}
                        leftButton={leftButtonConfig} />
                    <View style={styles.container}>
                        <SearchBar
                            placeholder='Search'
                            hideBackground={true}
                            />
                    </View>
                </View>
            );
        }

        if (isInitial == 1) {
            this.members = this.data.users.map(function(user) {
                var b = {};
                for(var prop in user){
                    b[prop] = user[prop];
                }
                b['isSelected'] = 0;
                return b;
            });
            isInitial = 0;
        }

        console.log('Rendering view: ', this.data.users, isInitial);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.data.users);
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <SearchBar
                        placeholder='Search'
                        hideBackground={true}
                        onChangeText={(text) => this._onKeywordChange(text)}
                        />
                    <ListView
                        dataSource = {dataSource}
                        renderRow={this.renderRow.bind(this)}>
                    </ListView>
                </View>
            </View>
        );
    }
}

var PIC_SIZE = 40;
var styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#F6F4EE',
        padding: 20
    },
    searchBar: {
        padding: 0
    },
    row: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
    },
    rowImageContainer: {
        flex: 0.2,
        marginRight: 10,
        justifyContent: 'center',
    },
    rowImage: {
        width: PIC_SIZE,
        height: PIC_SIZE,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: PIC_SIZE/2,
    },
    rowName: {
        flex: 1,
        // justifyContent: 'center',

    },
    rowSelection: {
        flex: .1,
    },
});

module.exports = ChannelSetup2;
