import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Animated, TouchableWithoutFeedback, Keyboard, TextInput, Modal, StyleSheet, Text, View, AsyncStorage, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { splashStyles } from '../Scripts/Styles.js';
import { Button, Input } from 'react-native-elements';
import { createConversation, createOnboarding, checkOnboardingId, userInPair, createPair } from '../Scripts/API.js';

// Splash screen for checking user status on app load.
export default class CoachIdCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      inputValue:'',
      inputStyle:splashStyles.input,
      inputError:'',
      opacity: new Animated.Value(0)
    };
  }

  componentDidMount = () => AsyncStorage.getItem('Coach').then((val) => this.handleValue(val));

  async handleValue(val) {
    if (val !== null) {
      this.props.navigation.navigate('OnboardingSurvey');
    } else {
      this.setState({modalVisible:true});
    }
  }

  onChange(text, submitRef) {
    this.setState({inputValue:text,inputStyle:splashStyles.input,inputError:''});
  }

  async onSubmit() {

    // Check if valid Coach ID.
    var ret = JSON.parse(await checkOnboardingId(this.state.inputValue));
    var client = JSON.parse(await AsyncStorage.getItem('Client'));
    if (ret != null) {
      var { id, token } = this.props.route.params;
      // User entered a correct ID. Associate Coach with client.
      this.setState({modalVisible:false});
      var notInPair = JSON.parse(await userInPair(ret.Id, id, token));
      if (notInPair) {
        var created = await createPair(ret.Id, id, token);
        var onboardingCreated = await createOnboarding(ret.Id, client.Id, token, ret.OnboardingType);
        var conversationCreated = await createConversation(ret.Id, id, token);
      }
      await AsyncStorage.setItem('Coach', JSON.stringify(ret));
      client.CoachId = ret.Id;
      await AsyncStorage.setItem('Client', JSON.stringify(client));
      this.props.navigation.navigate('OnboardingSurvey');
    } else {
      this.setState({inputError:'Incorrect Coach ID!',inputStyle:splashStyles.inputError});
    }

  }

  showError() {

    if (this.state.inputError !== '') {
      return (<Text style={splashStyles.error}>{this.state.inputError}</Text>);
    } else {
      return null;
    }

  }

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  render() {

    const submitRef = React.createRef();

    return (<View style={splashStyles.actualContainer}>
      <Modal
          animationType="slide"
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setState({modalVisible:false}) }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={splashStyles.modalContainer}>
            <Animated.Image
              onLoad={this.onLoad}
              source={require('../assets/splash.png')}
              resizeMode="contain"
              style={[
                {
                  opacity: this.state.opacity,
                  transform: [
                    {
                      scale: this.state.opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.85, 1],
                      })
                    },
                  ],
                },
                splashStyles.image
              ]}
            />
            <Text style={splashStyles.welcome}>Welcome, {this.props.route.params.name}!</Text>
            <Text style={splashStyles.title}>Enter Coach ID:</Text>
            <Input
              containerStyle={this.state.inputStyle}
              style={{textAlign:'center',paddingTop:25}}
              inputContainerStyle={splashStyles.inputContainerStyle}
              keyboardType='number-pad'
              onChangeText={text => this.onChange(text)}
              value={this.state.inputValue}
              ref={submitRef}
            />
            {this.showError()}
            <Button
              containerStyle={splashStyles.buttonContainer}
              buttonStyle={splashStyles.button}
              title="Submit"
              onPress={() => this.onSubmit()}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>);

  }

}
