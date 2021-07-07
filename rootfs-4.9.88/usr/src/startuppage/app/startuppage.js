// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
var oldtest=null;
var counter=0;
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
    document.getElementById('showsetup').style.display = 'block';
    document.getElementById('apply').style.display = 'inline-block';
    document.getElementById('setup').style.display = 'inline-block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showsetup').style.display = 'none';
    document.getElementById('apply').style.display = 'none';
    document.getElementById('setup').style.display = 'none';
  }
}

function sendNativeMessage() {
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  stroffset=inputstr.search("webpage:");
  if(stroffset>=0)
  {
    inputstr=message.replace('webpage:','');
    document.getElementById('startuppage').value=inputstr;
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "com.google.chrome.startuppage";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function alertFunc() {
  var currentTime = new Date().getTime();
  while (currentTime + miliseconds >= new Date().getTime()) {
  }
}

function startTime() {
  counter++;
  if(counter>5)
  {
    //port.postMessage("restart");
    document.getElementById('apply').innerHTML=oldtext;
    document.getElementById('apply').disabled= false;
    return;
  }
  document.getElementById("apply").innerHTML = "sync....(" +counter.toString() + ")" ;
  var t = setTimeout(function(){ startTime() }, 1000);
}

function fapply() {
  var i=0;
  message = "startuppage=" + document.getElementById('startuppage').value;
  port.postMessage(message);
  oldtext=document.getElementById('apply').innerHTML;
  document.getElementById('apply').disabled= true;
  counter=0;
  startTime();
}
function setup() {
  //port.postMessage("restart");
  //chrome.tabs.update({ url: 'chrome://apps' });
  chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
  //chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('apply').addEventListener('click', fapply);
  document.getElementById('setup').addEventListener('click', setup);
  connect();
  updateUiState();
});
