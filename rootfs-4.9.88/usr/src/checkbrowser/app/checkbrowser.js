// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
var oldtest=null;
var counter=0;
var myTimer=null;
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
  } else {
    document.getElementById('connect-button').style.display = 'block';
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
  stroffset=inputstr.search("webpage:");
  if(stroffset>=0)
  {
    inputstr=message.replace('webpage:','');
    document.getElementById('startuppage').value=inputstr;
    gethomepage=1;
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
  var hostName = "com.google.chrome.checkbrowser";
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
  counter--;
  if(counter<0)
  {
    clearTimeout(myTimer);
    myTimer = null;
    chrome.tabs.update({ url: document.getElementById('startuppage').value});
    return;
  }
  else
  {
    if(gethomepage==0 && counter<5)
    {
      //chrome.tabs.update({ url: 'chrome://apps' });
      clearTimeout(myTimer);
      myTimer = null;
      chrome.tabs.update({ url: 'chrome-extension://ngkflanckphikledkbnbocalfbfkeaij/startuppage.html' });
      return;
    }
  }
  document.getElementById("myHeader").innerHTML = "Open homepage in " +counter.toString() + " seconds!" ;
  myTimer = setTimeout(function(){ startTime() }, 1000);
}

function fapply() {
  //chrome.tabs.update({ url: 'chrome://apps' });
  if(myTimer!=null)
  {
    clearTimeout(myTimer);
    myTimer = null;
  }
  chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
  //chrome.tabs.update({ url: 'https://www.google.com/_/chrome/newtab' });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('apply').addEventListener('click', fapply);
  connect();
  updateUiState();
  counter=6;
  gethomepage=0;
  startTime();
});
