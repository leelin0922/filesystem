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
    if(document.getElementById('ALS').value==1)
    {
      document.getElementById('input-text').style.display = 'none';
      document.getElementById('send-message-button').style.display = 'none';
      document.getElementById('range').style.display = 'none';
      document.getElementById('ALS-ON').style.display = 'none';
      document.getElementById('ALS-OFF').style.display = 'block';
    }
    else
    {
      document.getElementById('input-text').style.display = 'block';
      document.getElementById('send-message-button').style.display = 'block';
      document.getElementById('range').style.display = 'block';
      document.getElementById('ALS-ON').style.display = 'block';
      document.getElementById('ALS-OFF').style.display = 'none';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('input-text').style.display = 'none';
    document.getElementById('send-message-button').style.display = 'none';
    document.getElementById('range').style.display = 'none';
    document.getElementById('ALS-ON').style.display = 'none';
    document.getElementById('ALS-OFF').style.display = 'none';
  }
}

function change() {
  var value = document.getElementById('range').value ;
  document.getElementById('input-text').value=value;
}

function ALSON() {
  document.getElementById('ALS').value= 1;
  port.postMessage("ALSON");
  updateUiState();
}

function ALSOFF() {
  document.getElementById('ALS').value= 0;
  port.postMessage("ALSOFF");
  updateUiState();
}

function sendNativeMessage() {
  message = document.getElementById('input-text').value;
  stroffset=parseInt(message );
  if(stroffset<1)
  {
    message ="1";
    document.getElementById('input-text').value=message;
  }
  if(stroffset>100)
  {
    message ="100";
    document.getElementById('input-text').value=message;
  }
  port.postMessage(message);

  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  var stroffset=inputstr.search("ALSON");
  if(stroffset>=0)
  {
    document.getElementById('ALS').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("ALSOFF");
  if(stroffset>=0)
  {
    document.getElementById('ALS').value=0;
    updateUiState();
    return;
  }
  stroffset=parseInt(inputstr);
  if(stroffset >0 && stroffset<101)
  {
    document.getElementById('input-text').value=stroffset ;
    document.getElementById('range').value= stroffset ;
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
  //appendMessage("Failed to connect: " + browser.runtime.lastError.message);
  appendMessage("Failed to connect!!");
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "brightness";
  appendMessage("Connecting to native messaging host <b>" + hostName  + ".json" + "</b>")
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
  var addevent = document.getElementById('range');
  addevent .addEventListener('input', change);
  var addevent = document.getElementById('ALS-ON');
  addevent .addEventListener('click', ALSON);
  var addevent = document.getElementById('ALS-OFF');
  addevent .addEventListener('click', ALSOFF);
  connect();
  updateUiState();
});
