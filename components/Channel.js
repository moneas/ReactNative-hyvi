'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
var Swipeout = require('react-native-swipeout')
import NavigationBar from 'react-native-navbar';
var Global = require('./Global');
var { gStyle, } = Global;
var { Icon, } = require('react-native-item-checkbox');
var img_spectrumWhite = require('../res/spectrum_white.png');
var img_spectrumBlue = require('../res/spectrum_blue.png');

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

class Channel extends ParseComponent {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                channelId: props.objectId,
            },
        };
        console.log('channel props: ', props);
    }

    observe(props, state) {
        // console.log('observe called: ', props.objectId);
        return {
            records: (new Parse.Query('Record'))
                    .equalTo('channelId', {
                        '__type': 'Pointer',
                        'className': 'Channel',
                        'objectId': props.objectId,
                    }),
        };
    }

    renderRow(rowData) {
        // console.log('Rendering row: ', rowData.tags);

        // Get url of profile picture
        var imgURL = '';
        if(rowData.recorder.hasOwnProperty('profileImage')) {
            imgURL = rowData.recorder.profileImage._url;
        } else if (rowData.hasOwnProperty('fbProfileImageUrl')) {
            imgURL = rowData.fbProfileImageUrl;
        }

        // Generate tag string
        var tagStr ='';
        for (var i = 0; i < rowData.tags.length; i++) {
            var totalLen = tagStr.length;
            totalLen += rowData.tags[i].length;
            if ( totalLen > 30 ) {
                tagStr += '...';
                break;
            }
            tagStr += '#' + rowData.tags[i] + ' ';
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
                                    <View style={[styles.audioSpectrum, styles.selfSpectrum]}>
                                        <Image 
                                            style={[styles.spectrumImg]} 
                                            source={img_spectrumWhite}
                                            resizeMode='cover'>
                                        </Image>
                                    </View>
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
                        <View style={styles.selfTag}>
                            <Text style={[styles.tagText, gStyle.fontOpenSans]}>{tagStr}</Text>
                        </View>
                    </Swipeout>                    
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
                        <TouchableWithoutFeedback onPress={()=>this.showDetail(rowData)}>
                            <View>
                                <View style={[styles.audioSpectrum, styles.otherSpectrum]}>
                                    <Image 
                                        style={[styles.spectrumImg]} 
                                        source={img_spectrumBlue}
                                        resizeMode='cover'>
                                    </Image>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.otherTag}>
                        <Text style={[styles.tagText, gStyle.fontOpenSans]}>{tagStr}</Text>
                    </View>
                </View>
            );
        }
    }

    gotoRecord() {
        Actions.newRecord({channelId: this.state.values.channelId});
    }

    deleteNote = (rowData) => {
        console.log('Delete Record: ', rowData.id);
        ParseReact.Mutation.Destroy(rowData.id).dispatch();
    };

    showDetail = (rowData) => {
        Actions.playRecord(rowData);
    };

    render(){
        var that = this;
        // console.log('Rendering View: ', this.data.records);
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const rightButtonConfig = {
            title: 'Search',
            handler: function () {
                Actions.search({
                    channel: 'One',
                    channels: [that.state.values.channelId],
                });
            },
        };
        const titleConfig = {
            title: this.props.Caption,
            tintColor: '#0066CD',
        };
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.data.records);
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    rightButton={rightButtonConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <ListView
                        dataSource={dataSource}
                        renderRow={this.renderRow.bind(this)}
                        style={styles.mainArea} />
                    <View style={styles.bottomArea}>
                        <View style={styles.gapFill}>
                            <Button onPress={this.gotoRecord.bind(this)}>
                                <Image style={styles.btnCenter}></Image>
                            </Button>
                        </View>
                    </View>
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
        backgroundColor: '#0066CD',
    },
    otherSpectrum: {
        marginLeft: 10,
        backgroundColor: 'white',
    },
    audioSpectrum: {
        borderRadius: PIC_SIZE/2,   
        height: PIC_SIZE,
        width: 220,
        alignItems: 'stretch',
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },
    spectrumImg: {
        flex: 1,
        width: null,
        height: null,
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
    bottomArea: {
        flex: 0.1,
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    gapFill: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    btnCenter: {
        width: 60,
        height: 60,
        backgroundColor: '#0066CD',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 30,
    },
});

module.exports = Channel;
