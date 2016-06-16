'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
var Global = require('./Global');
var { gStyle, } = Global;
import NavigationBar from 'react-native-navbar';
var {AudioPlayer} = require('react-native-audio');
var { Icon, } = require('react-native-item-checkbox');
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

var {
	StyleSheet,
	View,
	TextInput,
	Image,
	Text,
} = React;

const CLOCK_SIZE = 18;
const PLAY_BUTTON_SIZE = 35;

class PlayRecord extends ParseComponent {
	constructor(props) {
		super(props);

		// initialize state params
		this.state = {
			currentTime: 0.0,
			isPlaying: false,
			finished: false,
		}
		console.log('Record PROP: ', props);

		AudioPlayer.onFinished = (data) => {
			this.setState({finished: data.finished});
			console.log('Finished playing: ', data);
			this.setState({isPlaying: false});
		};

		AudioPlayer.onProgress = (data) => {
			console.log('playing: ', data);
			this.setState({currentTime: Math.floor(data.currentTime)});
		}


		// construct timeframe string
		this.mins = Math.floor(props.duration / 60);
		this.seconds = props.duration - (60 * this.mins);
		this.durationStr = this.zeroFill(this.mins, 2) + " : " + this.zeroFill(this.seconds, 2);
	}

	observe(props, state) {
	}

	componentDidMount() {
		// Play audio when view loaded
		var audioURL = '';
		if (this.props.hasOwnProperty('fileURL')) {
			audioURL = this.props.fileURL;
		}
		AudioPlayer.playWithUrl(audioURL);
		this.setState({isPlaying: true});
		console.log('Playing initiated: ', audioURL);
	}

	_play () {
		if(!this.state.isPlaying) {
			this.setState({isPlaying: true});
			AudioPlayer.unpause();
		} else {
			this.setState({isPlaying: false});
			AudioPlayer.pause();
		}
	}

	zeroFill( number, width )
	{
	  	width -= number.toString().length;
	  	if ( width > 0 )
	  	{
	    	return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	  	}
	  	return number + ""; // always return a string
	}

	render(){
		var that = this;							// save {this} instance for future use
		var btnStyleName = (this.state.isPlaying) ? 'ion|ios-pause' : 'ion|ios-play';			// set play button style; play or pause

		// construct string for playing timeframe
		var mins = Math.floor(this.state.currentTime / 60);
		var seconds = this.state.currentTime - (60 * mins);
		var timeStr = this.zeroFill(mins, 2) + " : " + this.zeroFill(seconds, 2);

		// configure navigation bar
		const leftButtonConfig = {
			title: '<-',
			handler: function () {
				Actions.pop();
			},
		};
		const rightButtonConfig = {
			title: 'Delete',
			handler: function () {
				// delete current record from parse
				ParseReact.Mutation.Destroy(that.props.id).dispatch();
				Actions.pop();
			},
		};

		const titleConfig = {
			title: 'Details',
			tintColor: '#0066CD',
		};

		return (
			<View style={{flex: 1}}>
				<NavigationBar
					title={titleConfig}
					leftButton={leftButtonConfig}
					rightButton={rightButtonConfig} />
				<View style={styles.container}>
					<View style={[styles.toolArea,]}>
						<View style={styles.leftArea}>
							<View style={styles.timeWrapper}>
								<Icon
			                        name='ion|ios-clock-outline'
			                        size={ CLOCK_SIZE }
			                        color='#94918C'
			                        style={[styles.clockIcon]} />
								<Text style={{color: '#94918C'}}>{this.durationStr}</Text>
							</View>
						</View>
						<View style={styles.mainArea}>
							<TouchableWithoutFeedback onPress= {() => this._play()}>
								<Icon
			                        name={ btnStyleName } 
			                        size={ PLAY_BUTTON_SIZE }
			                        color='#0066DD'
			                        style={[styles.playBtnIcon]} />
							</TouchableWithoutFeedback>
						</View>
						<View style={styles.rightArea}>
							<Text style={styles.colorBlue}>{timeStr}</Text>
						</View>
					</View>
					<View style={styles.spectrumArea}>
						
					</View>
				</View>
			</View>
		);
	}
}

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F6F4EE',
		padding: 20,
		// flexDirection: 'row',
	},
	toolArea: {
		flex: .1,
		flexDirection: 'row',
		// borderWidth: 1,
	},
	leftArea: {
		flex: .4,
		justifyContent: 'flex-end',
	},
	timeWrapper: {
		flexDirection: 'row',
	},
	mainArea: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		flex: 0.2,
	},
	rightArea: {
		flex: .4,
		alignItems: 'flex-end',
		justifyContent: 'flex-end',
	},
	colorBlue: {
		color: '#0066CD',
	},
	spectrumArea: {
		flex: 1,
		margin: 20,
	},
	clockIcon: {
        width: CLOCK_SIZE,
        height: CLOCK_SIZE,
        backgroundColor: 'transparent',
        marginRight: 5,
    },
    playBtnIcon: {
    	width: PLAY_BUTTON_SIZE,
        height: PLAY_BUTTON_SIZE,
        backgroundColor: 'transparent',
    }
});


module.exports = PlayRecord;