'use strict';

var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Actions = require('react-native-router-flux').Actions;
import NavigationBar from 'react-native-navbar';
var {gStyle, } = require('./Global');

class About extends React.Component {
    render(){
        const leftButtonConfig = {
            title: '<-',
            handler: function () {
                Actions.pop();
            },
        };
        const titleConfig = {
            title: 'About',
            tintColor: '#0066CD',
        };
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={titleConfig}
                    leftButton={leftButtonConfig} />
                <View style={styles.container}>
                    <Text style={[styles.txtTitle, gStyle.fontOpenSans]}>About Mike</Text>
                    <Text style={[styles.txtContent, gStyle.fontOpenSans]}>
                        Portland ugh fashion axe Helvetica, YOLO Echo Park Austin gastropub roof party. 
                        Meggings cred before they sold out messenger bag, ugh fashion axe Pitchfork tousled freegan asymmetrical literally twee Thundercats.{'\n'}
                        Whatever Blue Bottle Neutra irony 8-bit. Kogiethnic ugh fashion axe bicycle rights.
                        Gluten-free Odd Future American Apparel pour-over umami drinking vinegar Truffaut.
                    </Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F4EE',
        padding: 40,
    },
    txtTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    txtContent: {
        marginTop: 10,
        textAlign: 'left',
    },
});

module.exports = About;
