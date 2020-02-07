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

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
    if(document.getElementById('status').value==1)
    {
      document.getElementById('StartRun').style.display = 'none';
      document.getElementById('StopRun').style.display = 'block';
      document.getElementById('onoffcounter').style.display = 'block';
    }
    else
    {
      document.getElementById('StartRun').style.display = 'block';
      document.getElementById('StopRun').style.display = 'none';
      document.getElementById('onoffcounter').style.display = 'none';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('onoffcounter').style.display = 'none';
    document.getElementById('StartRun').style.display = 'none';
    document.getElementById('StopRun').style.display = 'none';
  }
}

function change() {
  document.getElementById('temperature').value=value;
}

function StartRun() {
  document.getElementById('status').value= 1;
  port.postMessage("START");
  updateUiState();
}

function StopRun() {
  document.getElementById('status').value= 0;
  port.postMessage("STOP");
  updateUiState();
}

function sendNativeMessage() {
  message = document.getElementById('temperature').value;
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  var stroffset=inputstr.search("START");
  if(stroffset>=0)
  {
    document.getElementById('status').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("STOP");
  if(stroffset>=0)
  {
    document.getElementById('status').value=0;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("counter");
  if(stroffset>=0)
  {
     inputstr=message.replace('counter','');
    document.getElementById('onoffcounter').value=inputstr ;
    updateUiState();
    //port.postMessage("continue");
    return;
  }
}

function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "com.google.chrome.onoff";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  var addevent = document.getElementById('StartRun');
  addevent .addEventListener('click', StartRun);
  var addevent = document.getElementById('StopRun');
  addevent .addEventListener('click', StopRun);
  connect();
  updateUiState();
});
