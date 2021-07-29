// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
var gethomepage=0;
var startfirefox=0;
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
    document.getElementById('apply').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('apply').style.display = 'none';
  }
}

function sendNativeMessage() {
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  stroffset=inputstr.search("webpage:");
  if(stroffset>=0)
  {
    inputstr=message.replace('webpage:','');
    document.getElementById('startuppage').value=inputstr;
    gethomepage=1;
    return;
  }
  stroffset=inputstr.search("startupfirefox");
  if(stroffset>=0)
  {
    startfirefox=1;
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

function startTimefirefox() {
  counter++;
  if(counter>20)
  {
    clearTimeout(myTimer);
    updateUiState();
    document.getElementById('apply').disabled= false;
    return;
  }
  myTimer = setTimeout(function(){ startTimefirefox() }, 1000);
}

function startTime() {
  counter--;
  clearTimeout(myTimer);
  if(counter<0)
  {
    clearTimeout(myTimer);
    if(startfirefox==0)
    {
      chrome.tabs.update({ url: document.getElementById('startuppage').value});
      return;
    }
    else
    {
      document.getElementById('apply').disabled= true;
      port.postMessage("runfirefox");
      counter=0;
      appendMessage("Please wait, Firefox is loading now.")
      startTimefirefox();
      //chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
      return;
    }
  }
  else
  {
    clearTimeout(myTimer);
    if(gethomepage==0 && counter<5)
    {
      //chrome.tabs.update({ url: 'chrome://apps' });
      clearTimeout(myTimer);
      chrome.tabs.update({ url: 'chrome-extension://ngkflanckphikledkbnbocalfbfkeaij/startuppage.html' });
      return;
    }
  }
  document.getElementById("myHeader").innerHTML = "Open homepage in " +counter.toString() + " seconds!" ;
  myTimer = setTimeout(function(){ startTime() }, 1000);
}

function apply() {
  //chrome.tabs.update({ url: 'chrome://apps' });
  clearTimeout(myTimer);
  chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
  //chrome.tabs.update({ url: 'https://www.google.com/_/chrome/newtab' });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('apply').addEventListener('click', apply);
  connect();
  updateUiState();
  counter=6;
  gethomepage=0;
  startTime();
});
