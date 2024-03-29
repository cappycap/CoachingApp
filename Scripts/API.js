import React from 'react';
import { AsyncStorage } from 'react-native';

// Useful variables
export const url = 'https://api.coachsync.me';
export const uploadUrl = 'https://db.coachsync.me';
export const key = 'donthackme,imjustadevelopertryingmybest!';
export const stripePublicKey = 'pk_test_51Ibda0Doo38J0s0VtHeC0WxsqtMWNxu6xy9FcAwt9Tch77641I6LeIAmWHcbzVSeiFh6m2smQt3C9OgSYIlo4RAK00ZPlZhqub';
// Helper Functions
export function currentDate() {
  var date = new Date();
  var pad = function(num) { return ('00'+num).slice(-2) };
  date = date.getUTCFullYear()         + '-' +
        pad(date.getUTCMonth() + 1)  + '-' +
        pad(date.getUTCDate())       + ' ' +
        pad(date.getUTCHours())      + ':' +
        pad(date.getUTCMinutes())    + ':' +
        pad(date.getUTCSeconds());
  return date;
}

export function sqlToJsDate(sqlDate) {
  var t = sqlDate.split(/[-:T.Z]/);
  return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5], t[6]));
}

export function parseDateText(date) {

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear() +
                          " " + hours + ":" + minutes +
                          " " + ampm;
    return dateText;
}

export function getTimeSince(milliseconds) {
  var seconds = parseInt(milliseconds/1000);
  var ret = 'now';
  var time = 0;
  if (seconds > 5 && seconds <= 60) {
    ret = (seconds > 1) ? seconds + ' secs' : seconds + ' sec';
  } else if (seconds > 60 && seconds < 3600) {
    time = parseInt(seconds/60);
    ret = (time > 1) ? time + ' mins' : time + ' min';
  } else if (seconds >= 3600 && seconds < 86400) {
    time = parseInt(seconds/3600);
    ret = (time > 1) ? time + ' hours' : time + ' hour';
  } else if (seconds >= 86400 && seconds < 31536000) {
    time = parseInt(seconds/86400);
    ret = (time > 1) ? time + ' days' : time + ' day';
  } else if (seconds >= 31536000) {
    time = parseInt(seconds/31536000);
    ret = (time > 1) ? time + ' yrs' : time + ' yr';
  }
  return ret;
}

export function parseSimpleDateText(date) {

    if (!Object.prototype.toString.call(date) === "[object Date]") {
      date = Date.parse(date);
    }

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dateText = months[date.getMonth()] +
                          " " + date.getDate() +
                          ", " + date.getFullYear();
    return dateText;
}

export function parseTime(date) {

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  const dateText = hours + ":" + minutes + " " + ampm;
  return dateText;
}

export function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function containsSpecialCharacters(str){
    var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
	return regex.test(str);
}

export function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

// API Access Functions
/* Example

export async function check() {

  var ret = false;

  console.log('');
  const res = await fetch(url + '', {
    method:''
  });

  const payload = await res.json();

  if (payload) {
    console.log('');
    ret = true;
  }

  return ret;

}

*/

export async function updateExpoPushToken(id, token, expoPushToken) {

  var ret = false;
  var arr = {Id:id, Token:token, ExpoPushToken:expoPushToken};

  console.log('Updating ExpoPushToken...');
  const res = await fetch(url + '/user/client/update-expo-push-token', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('ExpoPushToken updated!');
    ret = true;
  }

  return ret;

}

export async function updatePromptsCompletedCnt(id, token) {

  var ret = false;
  var arr = {Id:id, Token:token};

  console.log('Updating PromptsCompletedCnt...');
  const res = await fetch(url + '/user/update-prompts-completed-count', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('PromptsCompletedCnt incremented!');
    ret = true;
  }

  return ret;

}

export async function updateConceptsCompletedCnt(id, token) {

  var ret = false;
  var arr = {Id:id, Token:token};

  console.log('Updating ConceptsCompletedCnt...');
  const res = await fetch(url + '/user/update-concepts-completed-count', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('ConceptsCompletedCnt incremented!');
    ret = true;
  }

  return ret;

}

export async function updateConceptVisited(conceptId, clientId, clientToken) {

  var ret = false;
  var arr = {Id:conceptId, ClientId:clientId, Token:clientToken};

  console.log('Marking concept as visited...');
  const res = await fetch(url + '/concept-assoc/mark-as-visited', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Concept updated!');
    ret = true;
  }

  return ret;

}

export async function getTrophy(trophyId, token) {

  var ret = false;

  console.log('Getting trophy...');
  const res = await fetch(url + '/trophy/' + trophyId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Trophy received!');
    ret = payload[0];
  }

  return ret;

}

export async function updateTrophyAssoc(clientId, clientToken, trophyId) {

  var ret = false;
  var arr = {ClientId:clientId, Token:clientToken, TrophyId:trophyId};

  console.log('Updating trophy assoc...');
  const res = await fetch(url + '/trophy-assoc/complete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('TrophyAssoc updated!');
    ret = true;
  }

  return ret;

}

export async function updateTheme(theme, id, token) {

  var ret = false;
  var arr = {Theme:theme, Id:id, Token:token};
  console.log(arr);
  console.log('Updating theme...');
  const res = await fetch(url + '/user/update-theme', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Updated theme!');
    ret = true;
  }

  return ret;

}

export async function createConversation(coachId, clientId, token) {

  var ret = false;
  var arr = {CoachId:coachId, ClientId:clientId, Token:token};
  console.log('Creating conversation...');
  const res = await fetch(url + '/conversation/client-create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Conversation created!');
    ret = true;
  }

  return ret;

}

export async function getOnboarding(coachId, clientToken) {

  var ret = false;

  console.log('Getting onboarding data...');
  const res = await fetch(url + '/onboarding/' + coachId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Onboarding returned!');
    ret = payload[0];
  } else {
    console.log('Onboarding doesnt exist!');
  }

  return ret;

}

export async function updateOnboarding(coachId, clientToken, surveyCompleted, paymentCompleted, contractCompleted) {

  var ret = false;
  var arr = {CoachId:coachId, Token:clientToken, SurveyCompleted:surveyCompleted, PaymentCompleted:paymentCompleted, ContractCompleted:contractCompleted};

  console.log('Updating Onboarding...');
  const res = await fetch(url + '/onboarding/update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Onboarding updated!');
    ret = true;
  }

  return ret;

}

export async function createOnboarding(coachId, clientId, clientToken, onboardingType) {

  var ret = false;
  var arr = {CoachId:coachId, Id:clientId, Token:clientToken, OnboardingType:onboardingType};
  console.log('Creating onboarding data...');
  const res = await fetch(url + '/onboarding/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Onboarding data created!');
    ret = {CoachId:coachId, ClientToken:clientToken, OnboardingType:onboardingType, SurveyCompleted:0, PaymentCompleted:0, ContractCompleted:0};
  }

  return ret;

}

export async function createPromptAssoc(token, clientId, coachId, type, promptId, dueDate) {

  var ret = false;
  var arr = {Token:token, ClientId:clientId, CoachId:coachId, Type:type, PromptId:promptId, DueDate:dueDate};

  console.log('Creating prompt assoc...');
  const res = await fetch(url + '/prompt-assoc/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Prompt assoc created!');
    ret = {Id:payload.insertId, ClientId:clientId, CoachId:coachId, Type:type, PromptId:promptId, Created:currentDate(), DueDate:dueDate};
  }

  return ret;

}


export async function getContractsSigned(clientId, clientToken) {

  var ret = false;

  console.log('Getting signed contracts...');
  const res = await fetch(url + '/contracts-signed/' + clientId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Contracts found!');
    ret = payload;
  }

  return ret;

}

export async function getContractSigned(contractId, clientId, clientToken) {

  var ret = false;

  console.log('Getting signed contract...');
  console.log(url + '/contract-signed/' + contractId + '/' + clientId + '/' + clientToken);
  const res = await fetch(url + '/contract-signed/' + contractId + '/' + clientId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Contract found!');
    ret = payload[0];
  }

  return ret;

}

export async function optOutOfContractAndPrompt(contractSignedId, clientId, clientToken, promptId) {

  var ret = false;
  var arr = {Id:contractSignedId, ClientId:clientId, Token:clientToken, PromptAssocId:promptId};
  console.log('Opting out of contract...');
  const res = await fetch(url + '/contract-signed-prompt/opt-out', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload[0].affectedRows > 0) {
    console.log('Opted out!');
    ret = true;
  }

  return ret;

}

export async function optOutOfContract(contractSignedId, clientId, clientToken) {

  var ret = false;
  var arr = {Id:contractSignedId, ClientId:clientId, Token:clientToken};
  console.log('Opting out of contract...');
  const res = await fetch(url + '/contract-signed/opt-out', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Opted out!');
    ret = true;
  }

  return ret;

}

export async function uploadSignature(token, clientId, clientName, contractId, contractFile, signature, promptAssocId) {

  var ret = false;
  var arr = {PromptAssocId:promptAssocId, Token:token, ClientId:clientId, ClientName:clientName, ContractId:contractId, ContractFile:contractFile, Signature:signature};
  console.log('Uploading signature...');
  const res = await fetch(url + '/contract-signed/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.ContractFile != undefined) {
    console.log('ContractSigned created!');
    const upRes = await fetch(url + '/contract-signed/update-file', {
      method:'POST',
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const upPayload = await upRes.json();
    if (upPayload.passed == true) {
      console.log('Merged files!');
      ret = true;
    } else {
      console.log('Merge failed!');
      ret = false;
    }
  } else {
    console.log('ContractSigned failed!');
    ret = false;
  }

  return ret;

}

/*export async function uploadSignature(token, clientId, contractId, signature) {

  var ret = false;
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];
  let formData = new FormData();
  formData.append('photo', {
    uri: uri,
    name: `${token}_${clientId}_${contractId}.${fileType}`,
    type: `image/${fileType}`,
  });

  console.log('Attempting message attachment upload...');
  const res = await fetch(uploadUrl + '/api/signature', {
    method:'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Upload complete!');
    ret = true;
  }

  return ret;

}*/

export async function getPaymentCharges(coachId, clientId, token) {

  var ret = [];

  console.log('Getting payment charge info...');
  console.log(url + '/payment-charges/' + coachId + '/' + clientId + '/' + token);
  const res = await fetch(url + '/payment-charges/' + coachId + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Payment charges found!');
    ret = payload;
  }

  return ret;

}

export async function getPaymentCharge(paymentId, token, clientId, coachId) {

  var ret = false;

  console.log('Getting payment charge info...');
  const res = await fetch(url + '/payment-charge/' + paymentId + '/' + coachId + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Payment charge found!');
    ret = payload[0];
  }

  return ret;

}

export async function getPayment(paymentId, clientToken) {

  var ret = false;

  console.log('Getting payment...');
  const res = await fetch(url + '/payment/' + paymentId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Payment retrieved!');
    ret = payload[0];
  }

  return ret;

}

export async function createPaymentCharge(paymentId, promptAssocId, cardToken, clientId, clientToken, coachId, title, amount, currency, memo) {

  var ret = false;
  var arr = {PaymentId:paymentId, PromptAssocId:promptAssocId, CardToken:cardToken, ClientId:clientId, Token:clientToken, CoachId:coachId, Title:title, Amount:amount, Currency:currency, Memo:memo};
  console.log('Sending charge...',arr);
  const res = await fetch(url + '/payment-charge/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows > 0) {
    console.log('Charge created!');
    ret = true;
  } else {
    console.log('Charge failed!');
    ret = false;
  }

  return ret;

}

export async function insertReaction(messageId, userId, emoji, token) {

  var ret = false;
  var arr = {MessageId:messageId, UserId:userId, Emoji:emoji, Token:token};

  console.log('Adding reaction...');
  const res = await fetch(url + '/reaction/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Reaction added!');
    ret = true;
  }

  return ret;

}

export async function deleteReaction(id, userId, token) {

  var ret = false;
  var arr = {Id:id, UserId:userId, Token:token};

  console.log('Removing reaction...');
  const res = await fetch(url + '/reaction/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Reaction removed!');
    ret = true;
  }

  return ret;

}

export async function uploadAvatar(uri, token) {

  var ret = false;
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];
  let formData = new FormData();
  var ts = Math.floor(Math.random() * (999999 - 0 + 1)) + 0;
  ts = ts.toString();
  formData.append('photo', {
    uri: uri,
    name: `${token}_${ts}.${fileType}`,
    type: `image/${fileType}`,
  });

  console.log('Attempting avatar upload...');
  const res = await fetch(uploadUrl + '/api/avatar', {
    method:'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Upload complete!');
    ret = true;
  }

  return ret;

}

export async function uploadMessageImage(uri, token, id) {

  var ret = false;
  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];
  let formData = new FormData();
  formData.append('photo', {
    uri: uri,
    name: `${token}_${id}.${fileType}`,
    type: `image/${fileType}`,
  });

  console.log('Attempting message attachment upload...');
  const res = await fetch(uploadUrl + '/api/message-attachment', {
    method:'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Upload complete!');
    ret = true;
  }

  return ret;

}

export async function createMessage(token, conversationId, clientId, text, title) {

  var ret = false;
  var arr = {Token:token, ConversationId:conversationId, UserId:clientId, Text:text, Title:title};
  console.log('Uploading message...');
  const res = await fetch(url + '/message/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.insertId > 1) {
    console.log('Message uploaded!');
    ret = payload.insertId;
  }

  return ret;

}

export async function getMessages(conversationId, clientId, token) {

  var ret = false;

  console.log('Getting chat messages...');
  console.log(url + '/messages/' + conversationId + '/' + clientId + '/' + token);
  const res = await fetch(url + '/messages/' + conversationId + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();
  console.log(payload)
  if (payload.length > 0) {
    console.log('Messages received!');
    ret = payload;
  } else {
    console.log('No messages found.');
  }

  return ret;

}

export async function getConversations(coachId, clientId, clientToken) {

  var ret = false;

  console.log('Getting conversations...');
  const res = await fetch(url + '/conversations/' + coachId + '/' + clientId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();
  console.log('convos:',payload)
  if (payload.length > 0) {
    console.log('Conversations retrieved!');
    ret = payload;
  } else {
    console.log('Conversations not found!');
  }

  return ret;

}

export async function getTrophyAssocs(clientId, coachId, token) {

  var ret = false;

  console.log('Getting TrophyAssocs...');
  const res = await fetch(url + '/trophy-assocs/' + clientId + '/' + coachId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('TrophyAssocs found!');
    ret = JSON.parse(JSON.stringify(payload));
  }

  return ret;

}

export async function deleteUser(id, token, password) {

  var ret = false;
  var arr = {Id:id, Token:token, Password:password};

  console.log('Attempting user deletion...');
  const res = await fetch(url + '/user/delete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Deletion successful!');
    ret = true;
  }

  return ret;

}

export async function updatePassword(id, token, password) {

  var ret = false;
  var arr = {Token:token, NewPassword:password, Id:id};

  console.log('Updating password...');
  const res = await fetch(url + '/user/update-password', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Password updated!');
    ret = true;
  }

  return ret;

}

export async function refreshUser(token) {

  var ret = false;

  console.log('Refreshing user data...');
  const res = await fetch(url + '/user/token/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Got user!');
    ret = payload[0];
  }

  return ret;

}

export async function createFeatureRequest(token, clientId, description) {

  var ret = false;
  var arr = {Token:token, ClientId:clientId, Description:description};

  console.log('Attempting feature request upload...');
  const res = await fetch(url + '/feature-request/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Feature request uploaded.');
    ret = true;
  }

  return ret;

}

export async function createBugReport(token, clientId, pageText, description) {

  var ret = false;
  var arr = {Token:token, ClientId:clientId, PageText:pageText, Description:description};

  console.log('Attempting bug report upload...');
  const res = await fetch(url + '/bug-report/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Bug report uploaded.');
    ret = true;
  }

  return ret;

}

export async function getSurveyResponses(surveyId, clientId, token) {

  var ret = false;

  console.log('Getting previous responses...');
  const res = await fetch(url + '/survey-item-responses/' + surveyId + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Responses received!');
    ret = payload;
  }

  return ret;

}
export async function updatePromptAssoc(token, clientId, coachId, promptId) {

  var ret = false;
  var arr = {Token: token, ClientId:clientId, CoachId:coachId, Id:promptId};

  console.log('Setting PromptAssoc as completed...');
  const res = await fetch(url + '/prompt-assoc/mark-as-complete', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log('Set as completed!');
    ret = true;
  }

  return ret;

}

export async function getConcepts(coachId, clientId) {

  var ret = false;

  console.log('Getting concepts...');
  const res = await fetch(url + '/concept-assoc/both/' + clientId + '/' + coachId + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Concepts received!');
    ret = payload;
  }

  return ret;

}

export async function getPromptResponse(id, clientId, token) {

  var ret = false;

  console.log('Getting prompt response...');
  console.log(url + '/prompt-response/' + id + '/' + clientId + '/' + token);
  const res = await fetch(url + '/prompt-response/' + id + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Found prompt response!');
    ret = payload;
  }

  return ret;

}

export async function updatePromptResponse(id, promptAssocId, text) {

  var ret = false;
  var arr = {Token:key, Id:id, PromptAssocId:promptAssocId, Text:text};
  console.log('Updating prompt response...');
  const res = await fetch(url + '/prompt-response/update', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows === 1) {
    console.log('Updated successfully!');
    ret = true;
  }

  return ret;

}

export async function createPromptResponse(promptAssocId, text) {

  var ret = false;
  var arr = {Token:key, PromptAssocId: promptAssocId, Text:text};
  console.log('Uploading prompt response...');
  const res = await fetch(url + '/prompt-response/create', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows === 1) {
    console.log('Created successfully!');
    ret = true;
  }

  return ret;

}

export async function getPrompts(coachId, clientId, clientToken) {

  var ret = [];

  console.log('Getting prompts for client...');
  const res = await fetch(url + '/prompt-assoc/both/' + clientId + '/' + coachId + '/' + clientToken, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Prompts received!');
    ret = payload;
  }

  return ret;

}

export async function getFeed(coachId) {

  var ret = false;

  console.log('Getting coach feed...');
  const res = await fetch(url + '/feed/all/' + coachId + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Feed retrieved!');
    ret = JSON.parse(JSON.stringify(payload));
  }

  return ret;

}

export async function getLinkItems(coachId) {

  var ret = false;

  console.log('Getting coach links...');
  const res = await fetch(url + '/link-item/' + coachId + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length > 0) {
    console.log('Links retrieved!');
    ret = JSON.parse(JSON.stringify(payload));
  }

  return ret;

}

export async function getOnboardingContract(coachId) {

  var ret = false;

  console.log('Retrieving contract info...');
  const res = await fetch(url + '/contract/' + coachId + '/1/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length === 1) {
    console.log('Contract found. Give to user...');
    ret = payload[0];
  }

  return ret;


}

export async function getOnboardingPayment(coachId) {

  var ret = false;

  const res = await fetch(url + '/payment/onboarding/'+ coachId + '/'+  key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length === 1) {
    console.log('Payment prompt found. Give to user...');
    ret = payload[0];
  }

  return ret;

}

export async function checkOnboardingSurveyCompleted(clientId, token) {

  var ret = false;

  console.log('Checking if survey was completed already...');
  const res = await fetch(url + '/survey-item-responses/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();
  if (payload.length >= 1) {
    console.log('Survey was completed already!');
    ret = true;
  } else {
    console.log('Survey has not been completed.');
  }

  return ret;

}

export async function updateOnboardingCompleted(id, token) {

  var ret = false;
  var arr = {Id:id, Token:token};

  console.log('completing:',arr)

  console.log('Updating OnboardingCompleted...');
  const res = await fetch(url + '/user/client/complete-onboarding', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });
  
  const payload = await res.json();

  if (payload.affectedRows === 1) {
    console.log('Updated successfully!');
    ret = true;
  }

  return ret;

}

// Upload survey responses.
export async function uploadResponses(responses, token, promptAssocId) {

  var ret = false;

  var body = {Token:token, Responses:responses, PromptAssocId:promptAssocId};

  console.log('Uploading survey responses...')
  const res = await fetch(url + '/survey-item-responses/create', {
    method:'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.Success === 1) {
    console.log('Responses uploaded!');
    ret = true;
  }

  return ret;

}

// Create client account.
export async function createAccount(client) {

  var ret = null;

  console.log('Attempting account creation...');
  const res = await fetch(url + '/user/client/create', {
    method:'POST',
    body: JSON.stringify(client),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.hasOwnProperty('insertId')) {
    console.log('Creation passed!');
    ret = payload.insertId;
  }

  return ret;

}

// Check if email is taken.
export async function emailCheck(email) {

  var ret = true;

  if (email === '') {
    email = 'blankEmail';
  }

  console.log('Checking for existing email...');
  const res = await fetch(url + '/user/email/' + email + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length === 0) {
    console.log('Email not taken!');
    ret = false;
  }

  return ret;

}

// Return basic info about a coach.
export async function getCoach(coachId, token) {

  var ret = false;

  console.log('Getting coach info...');
  const res = await fetch(url + '/user/coach/' + coachId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length === 1) {
    console.log('Coach info returned!');
    ret = payload[0];
  }

  return ret;

}

// Returns all info about client on success.
export async function loginCheck(email, password) {

  var ret = null;

  console.log('Attempting login...');
  console.log('em:',email,'\npw:',password)
  const res = await fetch(url + '/user/login-check/' + email + '/' + password + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();
  console.log(payload)
  if (payload.length == 1) {
    console.log('Login check passed!');
    ret = JSON.stringify(payload[0]);
  }

  return ret;

}

export async function createPair(coachId, clientId, token) {

  var ret = false;
  var arr = {Token:token, CoachId:coachId, Id:clientId};

  console.log('Attempting to create pair...');
  const res = await fetch(url + '/user/client/create-pair', {
    method:'POST',
    body: JSON.stringify(arr),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  });

  const payload = await res.json();

  if (payload.affectedRows == 1) {
    console.log("User updated!");
    console.log("Attempting TrophyAssocs creations...");

    var trophyArr = {CoachId:coachId, ClientId:clientId, Token:token};
    const trophyRes = await fetch(url + '/trophy-assocs/create', {
      method:'POST',
      body: JSON.stringify(trophyArr),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const trophyPayload = await trophyRes.json();

    if (trophyPayload.Success === true) {
      console.log('TrophyAssocs created!');
      ret = true;
    }

  }

  return ret;

}

export async function userInPair(coachId, clientId, token) {

  var ret = false;
  console.log('Checking if user is in pair...');
  const res = await fetch(url + '/user/client/pair/' + coachId + '/' + clientId + '/' + token, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length == 0) {
    console.log('User is not in pair!');
    ret = true;
  } else {
    console.log('User is in pair!');
  }

  return ret;

}

export async function checkOnboardingId(id) {

  var ret = null;

  if (id == '') {
    id = 'blabla';
  }

  console.log('Checking OnboardingId...');
  const res = await fetch(url + '/user/onboarding-id/' + id + '/' + key, {
    method:'GET'
  });

  const payload = await res.json();

  if (payload.length == 1) {
    console.log('OnboardingId passed!');
    ret = JSON.stringify(payload[0]);
  } else {
    console.log('OnboardingId does not exist.');
  }

  return ret;

}

export async function getSurveyArray(surveyId) {

  var ret = false;

  console.log('Getting survey items...');
  const itemsRes = await fetch(url + '/survey-items/' + surveyId + '/' + key, {
    method:'GET'
  });

  const itemsPayload = await itemsRes.json();

  if (itemsPayload.length > 0) {
    console.log('Items found!');
    ret = JSON.parse(JSON.stringify(itemsPayload));
  }


  return ret;

}

export async function getOnboardingSurveyArray(coachId) {

  const surveyRes = await fetch(url + '/survey/onboarding/' + coachId + '/' + key, {
    method:'GET'
  });

  const surveyPayload = await surveyRes.json();

  var items = []
  
  if (surveyPayload.length > 0) {
    var surveyId = JSON.stringify(surveyPayload[0]['Id']);

    const itemsRes = await fetch(url + '/survey-items/' + surveyId + '/' + key, {
      method:'GET'
    });

    const itemsPayload = await itemsRes.json();

    items = JSON.parse(JSON.stringify(itemsPayload));
  }

  return items;

}
