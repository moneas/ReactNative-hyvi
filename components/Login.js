'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var ParseComponent = ParseReact.Component(React);
import CONFIG from '../lib/config';
var Global = require('./Global');
var { gStyle, } = Global;
var FBLoginManager = require('NativeModules').FBLoginManager;
// var ActivityIndicatorIOS = require('react-native-activity-indicator-ios');

var {
	StyleSheet,
	View,
	TextInput,
	ActivityIndicatorIOS,
	Text,
	Alert,
	Image,
} = React;

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: {
				email: 'Test13@gmail.com',
				password: 'asdf',
			},
			loading: false
		};
		var imgFromUrl = new Image();

	}

	observe(props, state) {
	    return {
	      	user: ParseReact.currentUser
	    };
	}

	checkLogin() {
        var success = true;
        var state = this.state.value;
        for(var key in state){
        	// console.log(key + ": " + state[key]);
          	if(state[key].length <= 0) {
            	success = false;
          	}
        }

        if(success) {
          	this._doLogin();
        } else {
        	console.log('Form Validation Error');
          	//show alert
          	// AlertIOS.alert('Error','Please complete all fields',
           //  	[{text: 'Okay', onPress: () => console.log('')}]
          	// );
        }
    }

    _doLogin() {
      	var parent = this;
      	this.state.loading = true;
      	Parse.User.logIn(this.state.value.email, this.state.value.password, {
		  	success: function(user) {
		    	parent.state.loading = false;
		    	Global.currentUser = user;
		    	console.log('Login Success: ', Global.currentUser);
		    	Actions.channels_overview();
		  	},
		  	error: function(user, error) {
		  		parent.state.loading = false;
		    	console.log('Incorrect username or password:', user, error);
		    	Alert.alert('Login Error', 
		    		'Invalid username or password.'
		    	);
		  	}
		});
    }

    convertImgToDataURLviaCanvas(url, callback, outputFormat){
	    var img = new Image();
	    img.crossOrigin = 'Anonymous';
	    img.src = url;
	    img.onload = function(){
	    	console.log('loaded');
	        // var canvas = document.createElement('CANVAS');
	        // var ctx = canvas.getContext('2d');
	        // var dataURL;
	        // canvas.height = this.height;
	        // canvas.width = this.width;
	        // ctx.drawImage(this, 0, 0);
	        // dataURL = canvas.toDataURL(outputFormat);
	        // callback(dataURL);
	        // canvas = null;
	    };
	    
	    console.log('img: ', img)
	}

	convertFileToDataURLviaFileReader(url, callback){
	    var xhr = new XMLHttpRequest();
	    xhr.responseType = 'blob';
	    xhr.onload = function() {
	    	console.log(xhr.response);
	        var reader  = new FileReader();
	        reader.onloadend = function () {
	            callback(reader.result);
	        }
	        reader.readAsDataURL(xhr.response);
	    };
	    xhr.open('GET', url);
	    xhr.send();
	}

    fbLogin() {
    	var that = this;
	    FBLoginManager.loginWithPermissions(["email","user_friends"], function(error, data){
		  	if (!error) {
		    	// console.log("Login data: ", data);
		    	var authData = {
	                id: data.credentials.userId,
	                access_token: data.credentials.token,
	            	expiration_date: data.credentials.tokenExpirationDate
	            };

	            //sign up into parse db
	            Parse.FacebookUtils.logIn(authData, {
	                success: (user) => {
	                	console.log('fb user: ', user);
	                    if (user.existed()) {

	                    } else {
	                      	// signup: update user fbData, e.g. email
	                      	var fbData = user.get('authData').facebook;
	                      	console.log('getting user additional information: ', fbData);
	                      	// var api = 'https://graph.facebook.com/me?access_token=' + fbData.access_token;
	                      	var api = 'https://graph.facebook.com/v2.3/' + fbData.id + 
	                      		'?fields=name,email&access_token=' + fbData.access_token;
	                      	var pictureUrl = 'https://graph.facebook.com/v2.3/' + fbData.id + 
	                      		'/picture?type=large';
	                      	fetch(api)
				            .then((response) => response.json())
				            .then((responseData) => {
				            	console.log('additional data: ', responseData);
				            	console.log('user email: ', responseData.email);
				            	var userId = {
	                            	className: '_User',
	                            	objectId: user.id
	                          	};
				              	ParseReact.Mutation.Set(userId, {
		                            username: responseData.email,
		                            email: responseData.email,
		                            fullname: responseData.name,
		                            sound: false,
						            vibration: false,
						            feedback: false,
						            message: false,
						            friend_request: false,
						            fbProfileImageUrl: pictureUrl
	                          	}).dispatch();
				            })
				            .done();
	                    }
	                    Global.currentUser = user;
	                    Actions.channels_overview();
	                },
	                error: (user, error) => {
	                    console.log('Error', error.message);
	                    switch (error.code) {
	                      	case Parse.Error.INVALID_SESSION_TOKEN:
	                        	Parse.User.logOut().then(() => {
	                          		this.onFacebookLogin(token);
	                        	});
	                        	break;
	                      	default:
	                        // TODO: error
	                    }
	            	    that.setState({loadingCurrentUser: false});
	                	that.setState({errorMessage: error.message});
	                }
	            });
		  	} else {
				console.log("Error: ", data);
		  	}
		})
    }

    _fbLogin() {
    	var newObj = ParseReact.Mutation.Create('Channel', {
    		Caption: 'Test channel',
    		members: ['ewrewrewr'],
    	}).dispatch()
    	.then(function(data) {
    		console.log('Succeeded: ', data);
    	});
    	console.log('New object: ', newObj);
    }

	render(){
		return (
			<View style={styles.container}>
				<View style={styles.title}>
					<Text style={[styles.titleText, gStyle.fontOpenSans]}>Login</Text>
				</View>
				<View style={styles.formStyle}>
					<View style={styles.inputs}>
						<View style={gStyle.inputContainer}>
							<TextInput 
								style={[styles.input, gStyle.fontOpenSans]}
								placeholder="Email"
								value={this.state.value.email}
								onChangeText={text => this.setState({
									value:{email: text, password: this.state.value.password}
								})}
								ref='emailInput'
							/>
						</View>
						<View style={[gStyle.inputContainer, gStyle.lastInput]}>
							<TextInput
								password={true}
								style={[styles.input, gStyle.fontOpenSans]}
								placeholder="Pasword"
								value={this.state.value.password}
								onChangeText={text => this.setState({
									value:{password: text, email: this.state.value.email}
								})}
								ref='passwordInput'
							/>
						</View>
					</View>
					<Button style={[styles.signin, styles.whiteFont, styles.button, gStyle.fontOpenSans]} onPress={this.checkLogin.bind(this)}>
						LOG IN
					</Button>
					<Button style={[styles.fblogin, styles.whiteFont, styles.button, gStyle.fontOpenSans]} onPress={this.fbLogin.bind(this)}>
						LOG IN WITH FACEBOOK
					</Button>
				</View>
				<ActivityIndicatorIOS animating={this.state.loading} />
				<Button style={[styles.signup, gStyle.fontOpenSans]} onPress={Actions.register}>
					Don't have an account?
				</Button>
				
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
	title: {
		flex: 0.1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleText: {
		color: '#1D3DBF',
		fontSize: 18,
		fontWeight: '500',
	},
	signin: {
		backgroundColor: '#0066CD',
		padding: 20,
	},
	fblogin: {
		backgroundColor: '#4b62a1',
		padding: 20,
	},
	signup: {
		justifyContent: 'center',
		alignItems: 'center',
		color: 'black',
		fontWeight: '300',
	},
	formStyle: {
		justifyContent: 'center',
		flex: 1
	},
	inputs: {
		marginTop: 10,
		marginBottom: 20,
		backgroundColor: 'white',
		borderWidth: 1,
		borderColor: '#F1EAE2',
		borderRadius: 4,
	},
	button: {
		borderRadius: 4,
		color: 'white',
		marginBottom: 10,
	},
	input: {
		height: 40,
		fontSize: 14
	},
	whiteFont: {
		color: '#FFF'
	}
});


module.exports = Login;