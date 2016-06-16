'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var Global = require('./Global');
var { gStyle, } = Global;
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
var ImagePickerManager = require('NativeModules').ImagePickerManager;

var {
	StyleSheet,
	View,
	Text,
	TextInput,
	Alert,
	Image,
} = React;

var cameraOptions = {
	title: 'Select profile picture', // specify null or empty string to remove the title 
	cancelButtonTitle: 'Cancel',
	takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button 
	chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button 
	// customButtons: {
	//   'Choose Photo from Facebook': 'fb', // [Button Text] : [String returned upon selection] 
	// },
	cameraType: 'front', // 'front' or 'back' 
  	mediaType: 'photo', // 'photo' or 'video' 
  	videoQuality: 'high', // 'low', 'medium', or 'high' 
  	// durationLimit: 10, // video recording max time in seconds 
  	maxWidth: 100, // photos only 
  	maxHeight: 100, // photos only 
  	aspectX: 2, // aspectX:aspectY, the cropping image's ratio of width to height 
  	aspectY: 1, // aspectX:aspectY, the cropping image's ratio of width to height 
  	quality: 0.2, // photos only 
  	angle: 0, // photos only 
  	allowsEditing: false, // Built in functionality to resize/reposition the image 
  	noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos) 
  	storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory) 
		skipBackup: true, // image will NOT be backed up to icloud 
		path: 'images' // will save image at /Documents/images rather than the root 
  	}
};

class Register2 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: {
				fullname: '',
			},
			image: null,
		};
		// Parse.initialize(CONFIG.PARSE.APP_ID, CONFIG.PARSE.JAVASCRIPT_KEY);
	}

	checkSignup() {
		var success = true;
		var state = this.state.value;
		for(var key in state){;
			console.log(key + ": " + state[key]);
			if(state[key].length <= 0){
				success = false;
			}
		}
		if(success) {
			this._register();
		} else {
			//show alert
			// AlertIOS.alert('Error','Please complete all fields',
		   //   [{text: 'Okay', onPress: () => console.log('')}]
			// );
		}
	}

	_register() {
		var that = this;
		var img
		console.log("PROPS: ", this.props.value);
		var imageFile = new Parse.File("profile.jpg", {base64: this.state.image});
		imageFile.save().then(function () {
			console.log('Upload success');

			var u = new Parse.User({
				username: that.props.value.username,
				email: that.props.value.email,
				password: that.props.value.password,
				fullname: that.state.value.fullname,
				sound: false,
				vibration: false,
				feedback: false,
				message: false,
				friend_request: false,
				profileImage: imageFile,
			});

			u.signUp(null, {
				success: function(user) {

					console.log('SignUp Success: ', user);
					Global.currentUser = user;
					Actions.channels_overview();
				}, 
				error: function(user, err) {
					console.log('Signup Error: ', user, err);
					Alert.alert('Signup failed', 
						err.message, 
						[
							{text: 'OK', onPress: ()=>Actions.pop()}
						]);
				}
			});

		}, function (error) {
			console.log('Upload error: ', error);
			Alert.alert('Photo cannot be uploaded.', 
				err.message, 
				[
					{text: 'OK', onPress: ()=>Actions.pop()}
				]
			);
		});
	}

	render(){
		var jsxPhoto = '';
		if (this.state.image != null) {
			jsxPhoto = <Image style={styles.profileImg} source={{uri:this.state.image}} resizeMode='cover'></Image>;
		} else {
			jsxPhoto = (
				<TouchableWithoutFeedback onPress={this.takePicture.bind(this)}>
					<Text style={[styles.largeFont, gStyle.fontOpenSans]}>+</Text>
				</TouchableWithoutFeedback>
			);
		}
		return (
			<View style={styles.container}>
				<View style={styles.title}>
					<Text style={[styles.titleText, gStyle.fontOpenSans]}>Sign up</Text>
				</View>
				<View style={styles.formStyle}>
					<View style={styles.imageView}>
						<View style={styles.imageArea}>
							{jsxPhoto}
						</View>
					</View>
					<View style={styles.inputs}>
						<View style={[gStyle.inputContainer, gStyle.lastInput]}>
							<TextInput 
								style={[styles.input, gStyle.fontOpenSans]}
								placeholder="What's your full name?"
								value={this.state.fullname}
								onChangeText={text => this.setState({
									value: {
										fullname: text,
									}
								})}
							/>
						</View>
					</View>
					<Button style={[styles.continueBtn, styles.whiteFont, styles.button, gStyle.fontOpenSans]} onPress={this.checkSignup.bind(this)}>
						DONE
					</Button>
				</View>
				<View style={styles.bottomText}>
					<Text style={[styles.greyColor, gStyle.fontOpenSans]}>By creating an account, you accpet our</Text>
					<Button style={[styles.blackColor, gStyle.fontOpenSans]} onPress={Actions.pop}>
						Terms of Service
					</Button>
				</View>
			</View>
		);
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
					image: source.uri
				});
			}
		});
	}
}

var imgSize = 80;
var styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#F6F4EE',
		padding: 20
	},
	title: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleText: {
		color: '#1D3DBF',
		fontSize: 18,
	},
	continueBtn: {
		backgroundColor: '#F34600',
		padding: 20,
	},
	fblogin: {
		backgroundColor: '#3B4D8F',
		padding: 20,
	},
	bottomText: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	formStyle: {
		marginTop: 40,
		// alignItems: 'flex-start',
		// justifyContent: 'center',

		flex: 1
	},
	imageView: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageArea: {
		width: 80,
		height: 80,
		borderRadius: 40,
		marginBottom: 20,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#F1EAE2',
	},
	profileImg: {
		width: imgSize,
		height: imgSize,
		borderRadius: imgSize / 2,

	},
	largeFont: {
		fontSize: 48,
		// fontWeight: 'bold',
	},
	inputs: {
		marginTop: 10,
		marginBottom: 20,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#F1EAE2',
	},
	button: {
		borderRadius: 3,
		color: 'white',
		marginBottom: 10,
	},
	input: {
		height: 40,
		fontSize: 14
	},
	greyColor: {
		color: 'grey'
	},
	blackColor: {
		color: 'black',
		fontWeight: '300',
	},
	whiteFont: {
		color: '#FFF'
	},
	preview: {
		width: 300,
		height: 200,
	}
});

module.exports = Register2;
