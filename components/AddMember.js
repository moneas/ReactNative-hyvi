'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
import NavigationBar from 'react-native-navbar';
var SearchBar = require('react-native-search-bar');
var { ItemCheckbox } = require('react-native-item-checkbox');
var Global = require('./Global');
var { gStyle, } = Global;

var page = null;

var {
    StyleSheet,
    View,
    Text,
    TextInput,
    ListView,
    Image,
} = React;

class AddMember extends ParseComponent {

    constructor(props) {
        super(props);
        this.members = [];
        this.isInitial = 1;
        this.state = {
            searchText: ''
        };
    }

    observe(props, state) {
        // console.log('Observe called: ', state)
        return {
            user: ParseReact.currentUser,
            users: (new Parse.Query('_User'))
                .notContainedIn('objectId', props.members)
                // .contains('fullname', state.searchText),
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
        if(rowData.fullname.indexOf(this.state.searchText) == -1) {
            return (
                <View></View>
                );
        }
        // set blank url if not exist
        var profileImageUrl = '';
        if(rowData.hasOwnProperty('profileImage')) {
            profileImageUrl = rowData.profileImage._url;
        } else if (rowData.hasOwnProperty('fbProfileImageUrl')) {
            profileImageUrl = rowData.fbProfileImageUrl;
        }
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
        // console.log(text);
        this.setState({searchText: text});
        // this.state.searchText = text
    };

    render(){
        // console.log('Rendering list');
        var that=this;
        const leftButtonConfig = {
            title: 'Cancel',
            handler: function () {
                Actions.pop();
            },
        };
        const rightButtonConfig = {
            title: 'Add',
            handler: function () {
                var channelId = {
                    className: 'Channel',
                    objectId: that.props.objectId
                };
                var jsonObj = {
                    members: [],
                };
                that.members.map(function(user) {
                    if(user.isSelected == 1) {
                        ParseReact.Mutation.Add(channelId, 'members', user.objectId).dispatch();
                    }
                });
                Actions.channels_overview();
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

        if (this.isInitial == 1) {
            this.members = this.data.users.map(function(user) {
                var b = {};
                for(var prop in user){
                    b[prop] = user[prop];
                }
                b['isSelected'] = 0;
                return b;
            });
            this.isInitial = 0;
        }

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

module.exports = AddMember;
