'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
var Swipeout = require('react-native-swipeout')
import NavigationBar from 'react-native-navbar';
var SearchBar = require('react-native-search-bar');
var Global = require('./Global');
var { gStyle, } = Global;
var { Icon, } = require('react-native-item-checkbox');

var page = null;
var isInitial = 1;

var {
    StyleSheet,
    View,
    Text,
    ListView,
    Image,
    TouchableWithoutFeedback,
} = React;

class Search extends ParseComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
        };
        // console.log('Props: ', props);
        this.channels = props.channels.map(function(ch) {
            return {
                '__type': 'Pointer',
                'className': 'Channel',
                'objectId': ch,
            };
        });
    }

    observe(props, state) {
        // console.log('observe called: ', props.objectId);
        return {
            records: (new Parse.Query('Record'))
                    .containedIn('channelId', this.channels),
        };
    }

    renderRow(rowData) {
        // console.log('Rendering row: ', rowData);
        if (this.state.searchText.length < 1) return (<View></View>);
        // return empty view if search key is not contained in tag names
        var isSearchKeyContained = false;
        var that = this;
        rowData.tags.map(function(tag) {
            if (tag.indexOf(that.state.searchText) > -1) {
                isSearchKeyContained = true;
            }
        });
        if(!isSearchKeyContained) {
            return (
                <View></View>
            );
        }

        // if rowData meets search criteria
        var imgURL = '';
        if(rowData.recorder.hasOwnProperty('profileImage')) {
            imgURL = rowData.recorder.profileImage._url;
        } else if (rowData.recorder.hasOwnProperty('fbProfileImageUrl')) {
            imgURL = rowData.recorder.fbProfileImageUrl;
        }
        if(rowData.recorder.objectId == Global.currentUser.id) {
            var swipeBtns = [{
                text: "Delete",
                backgroundColor: 'transparent',
                type: 'deleteIcon',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                marginLeft: 10,
                padding: 3,
                onPress: () => { this.deleteNote(rowData) },
            }];
            
            return (
                <View style={{marginTop: 20}}>
                    <Swipeout 
                        right={swipeBtns}
                        backgroundColor='transparent'
                        autoClose={true}
                        >
                        <View style={[styles.row, styles.selfRow]}>
                            <View style={{flex: 1}}></View>
                            <TouchableWithoutFeedback onPress={()=>this.showDetail(rowData)}>
                                <View>
                                    <Image style={[styles.audioSpectrum, styles.selfSpectrum]}></Image>
                                </View>
                            </TouchableWithoutFeedback>
                            <View>
                                <Image 
                                    style={[styles.rowImage, styles.selfImage]} 
                                    resizeMode='cover'
                                    source={{uri: imgURL}}>
                                </Image>
                            </View>
                        </View>
                    </Swipeout>
                    <View style={styles.selfTag}>
                        <Text style={[styles.tagText, gStyle.fontOpenSans]}>{rowData.tag}</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{marginTop: 20}}>
                    <View style={styles.row}>
                        <View>
                            <Image 
                                style={[styles.rowImage, styles.otherImage]} 
                                resizeMode='cover'
                                source={{uri: imgURL}}>
                            </Image>
                        </View>                        
                        <TouchableWithoutFeedback onPress={()=>this.showDetail(rowData)} >
                            <View>
                                <Image style={[styles.audioSpectrum, styles.otherSpectrum]}></Image>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.otherTag}>
                        <Text style={[styles.tagText, gStyle.fontOpenSans]}>{rowData.tag}</Text>
                    </View>
                </View>
            );
        }
    }

    gotoRecord() {
        Actions.newRecord(this.state.values);
    }

    deleteNote = (rowData) => {
        console.log('Delete Record: ', rowData.id);
        ParseReact.Mutation.Destroy(rowData.id).dispatch();
    };

    showDetail = (rowData) => {
        Actions.playRecord(rowData);
    };

    _onKeywordChange = (text) => {
        this.setState({searchText: text});
    };

    render(){
        console.log('Rendering View: ', this.data.records.length);
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const titleConfig = {
            title: 'Search',
            tintColor: '#0066CD',
        };
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.data.records);
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <SearchBar
                        placeholder='Search'
                        hideBackground={true}
                        onChangeText={(text) => this._onKeywordChange(text)}
                        />
                    <ListView
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                        style={styles.mainArea} />
                </View>
            </View>
        )
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
    mainArea: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        flex: 1,
    },
    selfRow: {
        alignItems: 'flex-end',
    },
    selfTag: {
        marginLeft: 70,
        marginTop: 10,
    },
    otherTag: {
        marginRight: 70,
        marginTop: 10,
        alignItems: 'flex-end',
    },
    tagText: {
        color: '#9E9B96',
    },
    selfSpectrum: {
        // marginLeft: PIC_SIZE,
        marginRight: 10,
        backgroundColor: '#204FC1',
    },
    otherSpectrum: {
        marginLeft: 10,
        backgroundColor: 'white',
    },
    audioSpectrum: {
        borderRadius: PIC_SIZE/2,   
        height: PIC_SIZE,
        width: 220,
    },
    rowImage: {
        flex: 0.1,
        width: PIC_SIZE,
        height: PIC_SIZE,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: PIC_SIZE/2,
    },
    selfImage: {

    },
    otherImage: {

    },
});

module.exports = Search;
