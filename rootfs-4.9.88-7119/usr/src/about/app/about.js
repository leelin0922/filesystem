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
    document.getElementById('showversion').style.display = 'block';
    document.getElementById('showcpuinfo').style.display = 'block';
    document.getElementById('showcpuspeed').style.display = 'block';
    document.getElementById('showmeminfo').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showversion').style.display = 'none';
    document.getElementById('showcpuinfo').style.display = 'none';
    document.getElementById('showcpuspeed').style.display = 'none';
    document.getElementById('showmeminfo').style.display = 'none';
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
  stroffset=inputstr.search("version:");
  if(stroffset>=0)
  {
    inputstr=message.replace('version:','');
    document.getElementById('version').value=inputstr;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("cpuinfo:");
  if(stroffset>=0)
  {
    inputstr=message.replace('cpuinfo:','');
    document.getElementById('cpuinfo').value=inputstr;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("cpuspeed:");
  if(stroffset>=0)
  {
    inputstr=message.replace('cpuspeed:','');
    document.getElementById('cpuspeed').value=inputstr;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("meminfo:");
  if(stroffset>=0)
  {
    inputstr=message.replace('meminfo:','');
    document.getElementById('meminfo').value=inputstr;
    updateUiState();
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
  var hostName = "com.google.chrome.about";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  connect();
  updateUiState();
});
