// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;

var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}

function appendMessage(text) {
  document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}

function replaceMessage(text) {
  document.getElementById('response').innerHTML =  text ;
}

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
    document.getElementById('send-message-button').style.display = 'block';
    document.getElementById('myTime').style.display = 'block';
    document.getElementById('myDate').style.display = 'block';
    document.getElementById('showtitle').style.display = 'block';
    document.getElementById('timezonelist').style.display = 'block';
    document.getElementById('set-ntp-yes').style.display = 'block';
    document.getElementById('settimezone').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('send-message-button').style.display = 'none';
    document.getElementById('myTime').style.display = 'none';
    document.getElementById('myDate').style.display = 'none';
    document.getElementById('showtitle').style.display = 'none';
    document.getElementById('timezonelist').style.display = 'none';
    document.getElementById('set-ntp-yes').style.display = 'none';
    document.getElementById('settimezone').style.display = 'none';
  }
}

function sendNativeMessage() {
  message = "Date" + document.getElementById('myDate').value;
  port.postMessage(message );
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  message = "Time" + document.getElementById('myTime').value;
  port.postMessage(message );
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  message = "exec-command";
  port.postMessage(message );
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  message = "GMT" + document.getElementById('timezonelist').value;
  port.postMessage("GMT+0000" );
  port.postMessage("hwclock" );
  port.postMessage(message );
}

function sendtimezone() {
  message = "GMT" + document.getElementById('timezonelist').value;
  port.postMessage(message );
  //document.getElementById('timezonelist').value="+0000";
}

function setntpyes() {
  //message = "GMT" + document.getElementById('timezonelist').value;
  port.postMessage("set-ntp-yes");
  //document.getElementById('timezonelist').value="+0000";
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  var stroffset=-1;
  stroffset=message.search("Date");
  if(stroffset>=0)
  {
     inputstr=inputstr.replace('Date','');
    document.getElementById('myDate').value= inputstr;
    updateUiState();
    return;
  }
  stroffset=message.search("Time");
  if(stroffset>=0)
  {
     inputstr=inputstr.replace('Time','');
    document.getElementById('myTime').value= inputstr;
    updateUiState();
    return;
  }
  stroffset=message.search("GMT");
  if(stroffset>=0)
  {
     inputstr=inputstr.replace('GMT','');
    document.getElementById("timezonelist").value = inputstr;
    updateUiState();
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  //replaceMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
  //appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  appendMessage("Failed to connect!!");
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "datetime";
  appendMessage("Connecting to native messaging host <b>" + hostName + ".json" + "</b>")
  port = browser.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('send-message-button').addEventListener(
      'click', sendNativeMessage);
  document.getElementById('settimezone').addEventListener(
      'click', sendtimezone);
  document.getElementById('set-ntp-yes').addEventListener(
      'click', setntpyes);
  connect();
  updateUiState();
});
