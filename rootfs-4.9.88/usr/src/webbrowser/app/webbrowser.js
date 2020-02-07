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
    document.getElementById('showType').style.display = 'block';
    document.getElementById('showsetup').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showType').style.display = 'none';
    document.getElementById('showsetup').style.display = 'none';
  }
}

function sendNativeMessage() {
  //message = document.getElementById('temperature').value;
  //port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  stroffset=inputstr.search("webbrowser:");
  if(stroffset>=0)
  {
    inputstr=message.replace('webbrowser:','');
    if(inputstr == '1')
    {
      fChromium();
      return;
    }
    if(inputstr == '2')
    {
      fFirefox();
      return;
    }
    fNONE();
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
  var hostName = "com.google.chrome.webbrowser";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function fChromium() {
    document.getElementById('Chromium').checked = true;
    document.getElementById('Firefox').checked = false;
    document.getElementById('NONE').checked = false;
    document.getElementById('status').value="1";
    updateUiState();
}

function fFirefox() {
    document.getElementById('Chromium').checked = false;
    document.getElementById('Firefox').checked = true;
    document.getElementById('NONE').checked = false;
    document.getElementById('status').value="2";
    updateUiState();
}

function fNONE() {
    document.getElementById('Chromium').checked = false;
    document.getElementById('Firefox').checked = false;
    document.getElementById('NONE').checked = true;
    document.getElementById('status').value="0";
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
    document.getElementById('apply').innerHTML=oldtext;
    document.getElementById('apply').disabled= false;
    return;
  }
  document.getElementById("apply").innerHTML = "sync....(" +counter.toString() + ")" ;
  var t = setTimeout(function(){ startTime() }, 1000);
}

function fapply() {
  var i=0;
  message = "webbrowser=" + document.getElementById('status').value;
  port.postMessage(message);
  oldtext=document.getElementById('apply').innerHTML;
  document.getElementById('apply').disabled= true;
  counter=0;
  startTime();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('Chromium').addEventListener('click', fChromium);
  document.getElementById('Firefox').addEventListener('click', fFirefox);
  document.getElementById('NONE').addEventListener('click', fNONE);
  document.getElementById('apply').addEventListener('click', fapply);
  connect();
  updateUiState();
});
