var React = require('react-native')
var {StyleSheet} = React

var globalStyle = StyleSheet.create({
	fontOpenSans: {
		fontFamily: 'OpenSans',
        fontWeight: '600',
	},
	inputContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderWidth: 1,
        borderBottomColor: '#F1EAE2',
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    lastInput: {
        borderWidth: 0,
    },
})

module.exports = globalStyle