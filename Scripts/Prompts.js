import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RefreshControl, ActivityIndicator, TouchableOpacity, AsyncStorage, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavCenterTextProfileRight } from './TopNav.js';
import { getPrompts, sqlToJsDate, parseDateText, parseSimpleDateText } from '../Scripts/API.js';
import { promptsStyles, colors, windowHeight } from './Styles.js';
import { SafeAreaView } from 'react-native-safe-area-context';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default class Prompts extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing : true,
      prompts: [],
      pullRefresh: false,
    };
  }

  async getData() {
    var coach = JSON.parse(await AsyncStorage.getItem('Coach'));
    var client = JSON.parse(await AsyncStorage.getItem('Client'));
    var prompts = await getPrompts(coach.Id, client.Id, client.Token);
    this.setState({prompts:prompts,refreshing:false,pullRefresh:false});
  }

  onRefresh = () => {
    this.setState({pullRefresh:true});
    this.getData();
    wait(1000).then(() => this.setState({pullRefresh:false}));
  }

  async componentDidMount() {
    this.getData();
  }

  openPrompt(prompt) {
    console.log(prompt);
    if (prompt.Type == 3) {
      this.props.navigation.navigate('Contract', { prompt:prompt, nav:'Prompt', onGoBack: () => this.getData() });
    } else if (prompt.Type == 2) {
      this.props.navigation.navigate('Payment', { prompt:prompt, nav:'Prompt', onGoBack: () => this.getData() });
    } else if (prompt.Type == 1) {
      this.props.navigation.navigate('ViewPromptSurvey', { prompt:prompt, onGoBack: () => this.getData() });
    } else if (prompt.Type == 0) {
      this.props.navigation.navigate('ViewPrompt', { prompt:prompt, onGoBack: () => this.getData() });
    }
  }

  showPrompts(prompts) {

    if (prompts == false) {
      if (this.state.refreshing == true) {
        return (<ActivityIndicator size="large" color={colors.forest} style={{marginTop:25}} />);
      } else {
        return(<View style={promptsStyles.promptsContainer}>
            <Text style={promptsStyles.emptyText}>No prompts yet!</Text>
          </View>);
      }
    } else {
      return(<View style={promptsStyles.promptsContainer}>
        {prompts.map((prompt, promptIndex) => {
          var due = sqlToJsDate(prompt.DueDate);
          if (promptIndex == 0) {
            console.log('\ndb due date:',prompt.DueDate)
            console.log('\ndb created:',prompt.Created)
          }
          var overdueText = '';
          var overdueStyle = {height:0};
          var displayInfo, displayStyle;
          if (prompt.Completed == 0) {
            var cur = new Date();
            if (cur > due) {
              overdueText = 'Overdue!';
              overdueStyle = promptsStyles.overdueText;
            }
            displayInfo = 'Due: ' + parseDateText(due);
            displayStyle = promptsStyles.promptInfo;
          } else if (prompt.Completed == 1) {
            var completed = sqlToJsDate(prompt.CompletedDate);
            displayInfo = 'Completed ' + parseSimpleDateText(completed);
            displayStyle = promptsStyles.promptInfoCompleted;
          } else if (prompt.Completed == 2) {
            var completed = sqlToJsDate(prompt.CompletedDate);
            displayInfo = 'Opted out ' + parseSimpleDateText(completed);
            displayStyle = promptsStyles.promptInfoOptedOut;
          }
          if (prompt.Type == 0) {
            // Item is a Prompt.
            if (prompt.Prompt[0][0].PromptType == 0) {
              // Prompt is Text only.
              prompt.IconName = 'create';
            } else if (prompt.Prompt[0][0].PromptType == 1 || prompt.Prompt[0][0].PromptType == 2 || prompt.Prompt[0][0].PromptType == 3) {
              // Prompt includes Video.
              prompt.IconName = 'film';
            }
          } else if (prompt.Type == 1) {
            // Item is a Survey.
            prompt.IconName = 'clipboard';
          } else if (prompt.Type == 2) {
            // Item is a Payment.
            prompt.IconName = 'wallet';
          } else if (prompt.Type == 3) {
            // Item is a Contract.
            prompt.IconName = 'document-text';
          }
          var key = prompt.Id + '_' + prompt.Prompt[0][0].Id;
          return (<TouchableOpacity
            onPress={() => this.openPrompt(prompt)}
            key={key}
            style={promptsStyles.prompt}>
            <View style={promptsStyles.promptIconContainer}>
              <IonIcon name={prompt.IconName} size={40} color={colors.blueGray} />
              <Text style={overdueStyle}>{overdueText}</Text>
            </View>
            <View style={promptsStyles.promptBodyContainer}>
              <Text style={promptsStyles.promptHeader}>{prompt.Prompt[0][0].Title}</Text>
              <Text style={displayStyle}>{displayInfo}</Text>
            </View>
            <View style={promptsStyles.promptOpenIcon}>
              <IonIcon name='chevron-forward' size={30} color={colors.blueGray} />
            </View>
          </TouchableOpacity>);
        })}
      </View>);
    }
  }

  render() {

    var { prompts, pullRefresh } = this.state;

    return (<SafeAreaView>
      <NavCenterTextProfileRight text='Prompts' navRight={() => this.props.navigation.navigate('ClientProfile')} />
      <ScrollView contentContainerStyle={promptsStyles.container}
      refreshControl={
        <RefreshControl
          tintColor={colors.forest}
          colors={[colors.forest,colors.emerald]}
          refreshing={pullRefresh}
          onRefresh={this.onRefresh}/>
      }>
        <View style={promptsStyles.mainContainer}>
          {this.showPrompts(prompts)}
        </View>
      </ScrollView>
    </SafeAreaView>);
  }

}
