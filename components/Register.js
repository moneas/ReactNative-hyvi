'use strict';
var React = require('react-native');
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;
var Parse = require('parse/react-native');
var ParseReact = require('parse-react/react-native');
var FBLoginManager = require('NativeModules').FBLoginManager;
var Global = require('./Global');
var { gStyle, } = Global;

var {
    StyleSheet,
    View,
    TextInput,
    Text,
} = React;

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {
                username: '',
                email: '',
                password: ''
            }
        };
    }

    observe(props, state) {
        return {
            user: null
        };
    }

    validate() {

        var success = true;
        var state = this.state.value;
        for(var key in state){;

            if(state[key].length <= 0){
                success = false;
            }
        }
        
        if(success) {
            Actions.register2(this.state);
        } else {

        }
    }

    onFBSignUp() {
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

    _onFBSignUp() {
        var imgElement = document.createElement(img);
        
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={[styles.titleText, gStyle.fontOpenSans]}>Sign up</Text>
                </View>
                <View style={styles.formStyle}>
                    <View style={styles.inputs}>
                        <View style={gStyle.inputContainer}>
                            <TextInput 
                                style={[styles.input, gStyle.fontOpenSans]}
                                placeholder="Choose a username"
                                value={this.state.value.username}
                                onChangeText={text => this.setState({
                                    value:{
                                        username: text,
                                        email: this.state.value.email, 
                                        password: this.state.value.password
                                    }
                                })}
                            />
                        </View>
                        <View style={gStyle.inputContainer}>
                            <TextInput 
                                style={[styles.input, gStyle.fontOpenSans]}
                                placeholder="Email"
                                value={this.state.value.email}
                                onChangeText={text => this.setState({
                                    value:{
                                        email: text, 
                                        password: this.state.value.password,
                                        username: this.state.value.username,
                                    }
                                })}
                            />
                        </View>
                        <View style={[gStyle.inputContainer, gStyle.lastInput]}>
                            <TextInput
                                password={true}
                                style={[styles.input, gStyle.fontOpenSans]}
                                placeholder="Pasword (8+ characters)"
                                value={this.state.value.password}
                                onChangeText={text => this.setState({
                                    value:{
                                        password: text, 
                                        email: this.state.value.email,
                                        username: this.state.value.username,
                                    }
                                })}
                            />
                        </View>
                    </View>
                    <Button style={[styles.continueBtn, styles.whiteFont, styles.button, gStyle.fontOpenSans]} onPress={this.validate.bind(this)}>
                        CONTINUE
                    </Button>
                    <Button style={[styles.fblogin, styles.whiteFont, styles.button, gStyle.fontOpenSans]} onPress={()=>this.onFBSignUp()}>
                        SIGN UP WITH FACEBOOK
                    </Button>
                </View>
                
                <Button style={[styles.signup, gStyle.fontOpenSans]} onPress={Actions.login}>
                    Already have an account?
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
    },
    continueBtn: {
        backgroundColor: '#F34600',
        padding: 20,
    },
    fblogin: {
        backgroundColor: '#4B62A1',
        padding: 20,
    },
    signup: {
        justifyContent: 'center',
        alignItems: 'center',
        color: 'black',
        fontWeight: '300',
    },
    formStyle: {
        // justifyContent: 'center',
        marginTop: 30,
        flex: 1
    },
    inputs: {
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#F1EAE2',
        borderRadius: 4,
    },
    button: {
        borderRadius: 3,
        color: 'white',
        marginBottom: 20,
    },
    textContainer: {
        padding: 20,
        paddingLeft: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'white',
        backgroundColor: '#FFF',
        justifyContent: 'center',
        
    },
    input: {
        fontSize: 14,
        height: 40,
    },
    whiteFont: {
        color: '#FFF'
    }
});

module.exports = Register;
