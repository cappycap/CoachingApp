import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollView, AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onboardingStyles, colors } from '../Scripts/Styles.js';
import { getSurveyArray } from '../Scripts/API.js';
import { Slider, Button, Input, CheckBox } from 'react-native-elements';
import RadioButton from '../Components/RadioButton.js';

export default class OnboardingSurvey extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing : false,
      coachId:0,
      surveyItems: [],
      responses: []
    };
  }

  async componentDidMount() {
    var coach, coachId, items;
    try {
      // Get CoachId and Coach's Onboarding Survey.
      coach = JSON.parse(await AsyncStorage.getItem('Coach'));
      coachId = coach.Id;
      items = await getSurveyArray(coachId);
    } finally {
      var res = [];
      // Build responses array.
      items.map((item, index) => {
        if (item.Type == 0) {
          // This item is a Input.
          res[index] = [-1, ''];
        } else if (item.Type == 1) {
          // This item is a Slider.
          res[index] = [-1, 1];
        } else if (item.Type == 2) {
          // This item is a CheckBox group.
          var boxesLength = item.BoxOptionsArray.split(',').length;
          var arr = [];
          var i;
          for (i = 0;i < boxesLength;i++) {
            arr[i] = false;
          }
          res[index] = [-1, arr];
        } else if (item.Type == 3) {
          // This item is a RadioButton group.
          res[index] = [-1, -1];
        }
      });
      this.setState({coachId:coachId,surveyItems:items,responses:res});
    }
  }

  // These methods add responses as a SurveyItem Id and the response value pairs.
  onChange(id, index, text) {
    var res = this.state.responses;
    res[index] = [id, text];
    this.setState({responses:res});
  }

  onChangeSlider(id, index, text) {
    var res = this.state.responses;
    res[index] = [id, text.toFixed(1)];
    this.setState({responses:res});
  }

  onCheckBoxChange(id, index, boxIndex) {
    var res = this.state.responses;
    res[index][1][boxIndex] = !res[index][1][boxIndex];
    this.setState({responses:res});
  }

  onRadioBoxChange(id, index, boxIndex, checked) {
    var res = this.state.responses;
    if (checked == 'unchecked') {
      res[index] = [id, boxIndex];
    } else {
      res[index] = [id, null];
    }
    this.setState({responses:res});
  };

  onSelect = (item) => {
    var res = this.state.responses;
    var selectedOption = res[item.index][1];
    if (selectedOption && selectedOption.key === item.key) {
      res[item.index][1] = null;
    } else {
      res[item.index][1] = item;
    }
    this.setState({responses:res});
  };

  surveyItems() {
    return (<View style={onboardingStyles.survey}>
      {this.state.surveyItems.map((item, index) => {
        if (item.Type == 0) {
          return (<View style={onboardingStyles.questionContainer}>
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
          return (<View style={onboardingStyles.questionSliderContainer}>
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
                  minimumTrackTintColor={colors.forest}
                />
              </View>
              <View style={onboardingStyles.sliderSetRange}>
                <Text style={onboardingStyles.sliderSetRangeText}>{range[1]}</Text>
              </View>
            </View>
            <Text style={onboardingStyles.sliderValue}>Value: {this.state.responses[index][1]}</Text>
          </View>);
        } else if (item.Type == 2) {
          var boxes = item.BoxOptionsArray.split(',');
          return (<View style={onboardingStyles.questionContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            {
              boxes.map((box, boxIndex) => {
              return (<CheckBox
                  checked={this.state.responses[index][1][boxIndex]}
                  title={box}
                  checkedColor={colors.emerald}
                  uncheckedColor={colors.darkGray}
                  textStyle={{color:colors.darkGray}}
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
            options[i] = {key:i, text:text, index:index};
          }
          return (<View style={onboardingStyles.questionContainer}>
            <Text style={onboardingStyles.itemQuestion}>{item.Question}</Text>
            <View>
              <RadioButton
                  selectedOption={this.state.responses[index][1]}
                  onSelect={this.onSelect}
                  options={options}
                />
            </View>
          </View>);
        }
      })}
    </View>)
  }

  render() {

    return (<ScrollView style={onboardingStyles.trueContainer}>
      <View style={onboardingStyles.container}>
        <View style={onboardingStyles.mainTitle}>
          <Text style={onboardingStyles.mainTitleText}>Onboarding Survey</Text>
        </View>
        { this.surveyItems() }
        <Button
        title='Submit'
        buttonStyle={onboardingStyles.submitButton}
        containerStyle={onboardingStyles.submitButtonContainer}
        onPress={() => this.handlePress()}/>
      </View>
    </ScrollView>);

  }

}
