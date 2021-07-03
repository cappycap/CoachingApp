import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollView, AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onboardingStyles, colorsPerm } from '../Scripts/Styles.js';
import { updateOnboarding, createOnboarding, getOnboarding, getOnboardingSurveyArray, uploadResponses, updateOnboardingCompleted, getOnboardingPayment } from '../Scripts/API.js';
import { Slider, Button, Input, CheckBox } from 'react-native-elements';
import RadioButton from '../Components/RadioButton.js';

export default class OnboardingSurvey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing : false,
      coach:{},
      client:{},
      errorText: '',
      surveyItems: [],
      responses: []
    };
  }

  async componentDidMount() {
    var coach, client, items, onboarding;
    try {
      // Get CoachId and Coach.
      coach = JSON.parse(await AsyncStorage.getItem('Coach'));
      client = JSON.parse(await AsyncStorage.getItem('Client'));
      // Get or create onboarding status information.
      onboarding = await getOnboarding(coach.Id, client.Token);
      console.log('onboarding:',onboarding)
      if (onboarding == false) {
        onboarding = await createOnboarding(coach.Id, client.Token, coach.OnboardingType);
      }
      // Check if this is completed already.
      if (onboarding.SurveyCompleted == 1 || onboarding.OnboardingType == 0) {
        var isEither = (onboarding.OnboardingType == 1 || onboarding.OnboardingType == 3) ? true: false;
        if (onboarding.OnboardingType == 0) {
          // Update OnboardingCompleted for Client.
          if (client.OnboardingCompleted === 0) {
            var updated = await updateOnboarding(coach.Id, client.Token, 1, onboarding.PaymentCompleted, onboarding.ContractCompleted);
            var updateSuccess = await updateOnboardingCompleted(client.Id, client.Token);
            client.OnboardingCompleted = 1;
            await AsyncStorage.setItem('Client', JSON.stringify(client));
          }
          this.props.navigation.navigate('Main');
        } else if (onboarding.OnboardingType == 2 && onboarding.PaymentCompleted == 0) {
          this.props.navigation.navigate('OnboardingPayment');
        } else if (onboarding.OnboardingType == 3 && onboarding.PaymentCompleted == 0) {
          this.props.navigation.navigate('OnboardingPayment');
        } else if (isEither && onboarding.ContractCompleted == 0) {
          this.props.navigation.navigate('OnboardingContract');
        }
      }
    } finally {
      items = await getOnboardingSurveyArray(coach.Id);
      var res = [];
      // Build responses array.
      items.map((item, index) => {
        if (item.Type == 0) {
          // This item is a Input.
          res[index] = [-1, '', client.Id];
        } else if (item.Type == 1) {
          // This item is a Slider.
          res[index] = [-1, 1, client.Id];
        } else if (item.Type == 2) {
          // This item is a CheckBox group.
          var boxesLength = item.BoxOptionsArray.split(',').length;
          var arr = [];
          var i;
          for (i = 0;i < boxesLength;i++) {
            arr[i] = false;
          }
          res[index] = [-1, arr, client.Id];
        } else if (item.Type == 3) {
          // This item is a RadioButton group.
          res[index] = [-1, '', client.Id, null];
        }
      });
      this.setState({coach:coach,surveyItems:items,responses:res,client:client,onboarding:onboarding});
    }
  }

  // These methods add responses as a SurveyItem Id and the response value pairs.
  onChange(id, index, text) {
    var res = this.state.responses;
    res[index] = [id, text, res[index][2]];
    this.setState({responses:res});
  }

  onChangeSlider(id, index, text) {
    var res = this.state.responses;
    res[index] = [id, parseFloat(text.toFixed(2)), res[index][2]];
    this.setState({responses:res});
  }

  onCheckBoxChange(id, index, boxIndex) {
    var res = this.state.responses;
    var newArr = res[index][1];
    newArr[boxIndex] = !res[index][1][boxIndex];
    res[index] = [id, newArr, res[index][2]];
    this.setState({responses:res});
  }

  onSelect = (item) => {
    var res = this.state.responses;
    var selectedOption = res[item.index][1];
    if (selectedOption && selectedOption.key === item.key) {
      res[item.index][3] = null;
      res[item.index][1] = '';
      res[item.index][0] = item.id;
    } else {
      res[item.index][3] = item;
      res[item.index][1] = item.text;
      res[item.index][0] = item.id;
    }
    this.setState({responses:res});
  };

  surveyItems() {
    return (<View style={onboardingStyles.survey}>
      {this.state.surveyItems.map((item, index) => {
        if (item.Type == 0) {
          return (<View key={item.Id} style={onboardingStyles.questionContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            <Input
              onChangeText={text => this.onChange(item.Id, index, text)}
              value={this.state.responses[index][1]}
              keyboardType={item.KeyboardType}
              multiline={true}
              textAlign='center'
            />
          </View>);
        } else if (item.Type == 1) {
          var range = item.SliderRange.split(',');
          return (<View key={item.Id} style={onboardingStyles.questionSliderContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            <View style={onboardingStyles.sliderSet}>
              <View style={onboardingStyles.sliderSetRange}>
                <Text style={onboardingStyles.sliderSetRangeText}>{range[0]}</Text>
              </View>
              <View style={onboardingStyles.sliderContainer}>
                <Slider
                  onValueChange={value => {
                    clearTimeout(this.sliderTimeoutId)
                    this.sliderTimeoutId = setTimeout(() => {
                      this.onChangeSlider(item.Id, index, value)
                    }, 100)
                  }}
                  value={this.state.responses[index][1]}
                  minimumValue={parseInt(range[0])}
                  maximumValue={parseInt(range[1])}
                  thumbStyle={onboardingStyles.sliderThumb}
                  minimumTrackTintColor={colorsPerm.forest}
                />
              </View>
              <View style={onboardingStyles.sliderSetRange}>
                <Text style={onboardingStyles.sliderSetRangeText}>{range[1]}</Text>
              </View>
            </View>
            <Text style={onboardingStyles.sliderValue}>Value: {parseFloat(this.state.responses[index][1]).toFixed(1)}</Text>
          </View>);
        } else if (item.Type == 2) {
          var boxes = item.BoxOptionsArray.split(',');
          return (<View key={item.Id} style={onboardingStyles.questionContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            {
              boxes.map((box, boxIndex) => {
              return (<CheckBox
                  key={box}
                  checked={this.state.responses[index][1][boxIndex]}
                  title={box}
                  checkedColor={colorsPerm.emerald}
                  uncheckedColor={colorsPerm.darkGray}
                  textStyle={{color:colorsPerm.darkGray}}
                  containerStyle={onboardingStyles.checkBoxButtonContainer}
                  onPress={() => this.onCheckBoxChange(item.Id, index, boxIndex)}
                />);
            })}
          </View>);
        } else if (item.Type == 3) {
          var boxes = item.BoxOptionsArray.split(',');
          var i; var options = [];
          for (i = 0; i < boxes.length; i++) {
            var text = boxes[i];
            options[i] = {key:i, text:text, index:index, id:item.Id};
          }
          return (<View key={item.Id} style={onboardingStyles.questionContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            <View>
              <RadioButton
                  selectedOption={this.state.responses[index][3]}
                  onSelect={this.onSelect}
                  options={options}
                />
            </View>
          </View>);
        }
      })}
    </View>)
  }

  checkResponses(responses) {
    var ret = true;
    responses.map((response) => {
      if (response[0] === -1) {
        ret = false;
      }
    });
    return ret;
  }

  async handlePress() {

    var { responses, client, coach, responses, onboarding } = this.state;
    var everythingFilled = this.checkResponses(responses);
    if (everythingFilled) {
      var uploaded = await uploadResponses(responses, client.Token);
      if (uploaded) {
        // Mark survey as completed.
        var updated = await updateOnboarding(coach.Id, client.Token, 1, onboarding.PaymentCompleted, onboarding.ContractCompleted);
        // Decide where to go next.
        var isEither = (onboarding.OnboardingType == 1 || onboarding.OnboardingType == 3) ? true : false;
        if (onboarding.OnboardingType == 0) {
          // Update OnboardingCompleted for Client.
          if (client.OnboardingCompleted === 0) {
            var updateSuccess = await updateOnboardingCompleted(client.Id, client.Token);
            client.OnboardingCompleted = 1;
            await AsyncStorage.setItem('Client', JSON.stringify(client));
          }
          this.props.navigation.navigate('Main');
        } else if (onboarding.OnboardingType == 2 && onboarding.PaymentCompleted == 0) {
          this.props.navigation.navigate('OnboardingPayment');
        } else if (onboarding.OnboardingType == 3 && onboarding.PaymentCompleted == 0) {
          this.props.navigation.navigate('OnboardingPayment', { both:true });
        } else if (isEither && onboarding.ContractCompleted == 0) {
          this.props.navigation.navigate('OnboardingContract');
        }
      } else {
        console.log("Error uploading!");
        // Let user know they need to resubmit
        this.setState({errorText:'There was an error uploading your answers. Try hitting submit again!'});
      }
    }

  }

  render() {

    return (<SafeAreaView><ScrollView style={onboardingStyles.trueContainer}>
      <View style={onboardingStyles.actualContainer}>
        <View style={onboardingStyles.mainTitle}>
          <Text style={onboardingStyles.mainTitleText}>Onboarding Survey</Text>
        </View>
        { this.surveyItems() }
        <Text style={onboardingStyles.errorText}>{this.state.errorText}</Text>
        <Button
        title='Submit'
        buttonStyle={onboardingStyles.submitButton}
        containerStyle={onboardingStyles.submitButtonContainer}
        onPress={() => this.handlePress()}/>
      </View>
    </ScrollView></SafeAreaView>);

  }

}
