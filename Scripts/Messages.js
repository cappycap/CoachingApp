import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RefreshControl, Animated, Image, TouchableOpacity, AsyncStorage, ScrollView, ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, messagesStyles } from './Styles.js';
import { getConversations, sqlToJsDate, getTimeSince } from './API.js';
import { NavProfileRight } from './TopNav.js';
const io = require('socket.io-client');
import { SafeAreaView } from 'react-native-safe-area-context';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: true,
      opacity: new Animated.Value(0),
      conversations: [],
      socket: null,
      client: {},
      pullRefresh:false
    };
  }
  
  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  componentDidMount() {
    this.refreshConversations();
    console.log('Mounting socket...');
    this.configureSocket();
  }

  async refreshConversations() {
    var client = JSON.parse(await AsyncStorage.getItem('Client'));
    var coach = JSON.parse(await AsyncStorage.getItem('Coach'));
    var conversations = await getConversations(coach.Id, client.Id, client.Token);
    this.setState({refreshing:false,conversations:conversations,client:client});
  }

  configureSocket = () => {
    var { conversations } = this.state;
    var socket = io("https://messages.coachsync.me/");
    socket.on('connect', () => {
      console.log()
    })
    socket.on('get-conversations', (data) => {
      this.refreshConversations();
    })
  }

  findUser(id) {
    return function (response) {
      return response[0].Id === id;
    };
  }

  onRefresh = () => {
    this.setState({pullRefresh:true});
    this.refreshConversations();
    wait(1000).then(() => this.setState({pullRefresh:false}));
  }

  render() {

    var { refreshing, pullRefresh, conversations, client } = this.state;

    if (conversations.length === 0) {
      return (<SafeAreaView>
        <NavProfileRight navRight={() => this.props.navigation.navigate('ClientProfile')} />
        <ActivityIndicator size="large" color={colors.forest} style={{marginTop:25}} />
      </SafeAreaView>);
    } else {
      return (<SafeAreaView>
        <NavProfileRight navRight={() => this.props.navigation.navigate('ClientProfile')} />
        <ScrollView contentContainerStyle={messagesStyles.scrollView}
          refreshControl={
            <RefreshControl
              tintColor={colors.forest}
              colors={[colors.forest,colors.emerald]}
              refreshing={pullRefresh}
              onRefresh={this.onRefresh}/>
          }>
          {conversations.map((convo, i) => {

            // Build info for conversation.
            var convoUserId = (convo.LastSenderId == 0 || convo.LastSenderId == client.Id) ? convo.CoachId : convo.LastSenderId;
            var filt = JSON.parse(JSON.stringify(convo.Users));
            var convoUser = filt.filter(this.findUser(convoUserId));
            convoUser = convoUser[0][0];
            var convoUserName = convoUser.FirstName + ' ' + convoUser.LastName;
            var totalMembers = convo.Users.length;
            console.log('totalMembers:',totalMembers);
            if (totalMembers > 2) {
              convoUserName = convo.Users[0][0].FirstName + ' and ' + convo.Users[1][0].FirstName;
              var iterator = 0;
              var usersFound = 0;
              var otherMembers = totalMembers - 3;
              console.log('otherMembers:',otherMembers);
              if (totalMembers > 3) {
                while (iterator < totalMembers) {
                  if (convo.Users[iterator][0].Id != client.Id) {
                    if (usersFound == 0) {
                      convoUserName = convo.Users[iterator][0].FirstName + ', ';
                    } else {
                      // How many extra people are there?
                      if (usersFound == 1) {
                        convoUserName = convoUserName + convo.Users[iterator][0].FirstName;
                      } else {
                        convoUserName = convoUserName + ', +' + otherMembers + ' more';
                        iterator = totalMembers;
                      }
                    }
                    iterator++;
                    usersFound++;
                  } else {
                    iterator++;
                  }
                }
              }
            }

            // Get latest message.
            var lastSenderMessage = 'No messages yet.';
            var lastSender = {};
            if (convo.LastSenderMessage != '') {
              lastSender = filt.filter(this.findUser(convo.LastSenderId));
              lastSender = lastSender[0][0];
              var name = (lastSender.Id == client.Id) ? 'You' : lastSender.FirstName;
              var msg = (convo.LastSenderMessage.length > 25) ? convo.LastSenderMessage.substring(0,25) + '...' : convo.LastSenderMessage;
              lastSenderMessage = name + ': ' + msg;
              if (lastSender.Id == client.Id) {
                lastSender = convoUser;
              }
            } else if (convo.LastSenderId != 0) {
              lastSender = filt.filter(this.findUser(convo.LastSenderId));
              lastSender = lastSender[0][0];
              var name = (lastSender.Id == client.Id) ? 'You' : lastSender.FirstName;
              lastSenderMessage = name + ": Image Attachment";
              if (lastSender.Id == client.Id) {
                lastSender = convoUser;
              }
            } else {
              lastSender = convoUser;
            }

            // Calculate time since last message.
            var cur = new Date();
            var created = sqlToJsDate(convo.LastSenderCreated);
            var convoTime = getTimeSince(Math.abs(cur - created));

            return(<TouchableOpacity key={i} onPress={() => this.props.navigation.navigate('ViewMessageThread', { conversation: convo, title: convoUserName })}style={messagesStyles.convo}>
              <View style={messagesStyles.convoAvatar}>
                <Animated.Image
                  onLoad={this.onLoad}
                  source={{ uri: lastSender.Avatar }}
                  resizeMode="cover"
                  style={{
                    opacity: this.state.opacity,
                    flex:1,
                    width:60,
                    height:60,
                    borderRadius:100,
                    transform: [
                      {
                        scale: this.state.opacity.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.85, 1],
                        })
                      },
                    ],
                  }}
                />
              </View>
              <View style={messagesStyles.convoInfo}>
                <View style={messagesStyles.convoInfoTop}>
                  <Text style={messagesStyles.convoUser}>{convoUserName}</Text>
                  <Text style={messagesStyles.convoTime}>{convoTime}</Text>
                </View>
                <Text style={messagesStyles.lastMessage}>{lastSenderMessage}</Text>
              </View>
            </TouchableOpacity>);
          })}
        </ScrollView>
      </SafeAreaView>);
    }
  }

}
