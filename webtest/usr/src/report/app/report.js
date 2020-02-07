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
    document.getElementById('Systeminformation').style.display = 'block';
    document.getElementById('Chromiumlabel').style.display = 'inline-block';
    document.getElementById('Chromiumversion').style.display = 'inline-block';
    document.getElementById('Firefoxlabel').style.display = 'inline-block';
    document.getElementById('Firefoxversion').style.display = 'inline-block';
    document.getElementById('Firmwarelabel').style.display = 'inline-block';
    document.getElementById('Firmwareversion').style.display = 'inline-block';
    document.getElementById('cpulabel').style.display = 'inline-block';
    document.getElementById('cputype').style.display = 'inline-block';
    document.getElementById('systemramlabel').style.display = 'inline-block';
    document.getElementById('systemram').style.display = 'inline-block';
    document.getElementById('Storagesizelabel').style.display = 'inline-block';
    document.getElementById('Storagesize').style.display = 'inline-block';
    document.getElementById('Touchcapabilitylabel').style.display = 'inline-block';
    document.getElementById('Touchcapability').style.display = 'inline-block';
    document.getElementById('Resolutionlabel').style.display = 'inline-block';
    document.getElementById('Resolution').style.display = 'inline-block';
    document.getElementById('Usernamelabel').style.display = 'inline-block';
    document.getElementById('Username').style.display = 'inline-block';
    document.getElementById('Passwordlabel').style.display = 'inline-block';
    document.getElementById('Password').style.display = 'inline-block';
    document.getElementById('FTPServerlabel').style.display = 'inline-block';
    document.getElementById('FTPServer').style.display = 'inline-block';
    document.getElementById('Sendtoftp').style.display = 'inline-block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('Systeminformation').style.display = 'none';
    document.getElementById('Chromiumlabel').style.display = 'none';
    document.getElementById('Chromiumversion').style.display = 'none';
    document.getElementById('Firefoxlabel').style.display = 'none';
    document.getElementById('Firefoxversion').style.display = 'none';
    document.getElementById('Firmwarelabel').style.display = 'none';
    document.getElementById('Firmwareversion').style.display = 'none';
    document.getElementById('cpulabel').style.display = 'none';
    document.getElementById('cputype').style.display = 'none';
    document.getElementById('systemramlabel').style.display = 'none';
    document.getElementById('systemram').style.display = 'none';
    document.getElementById('Storagesizelabel').style.display = 'none';
    document.getElementById('Storagesize').style.display = 'none';
    document.getElementById('Touchcapabilitylabel').style.display = 'none';
    document.getElementById('Touchcapability').style.display = 'none';
    document.getElementById('Resolutionlabel').style.display = 'none';
    document.getElementById('Resolution').style.display = 'none';
    document.getElementById('Usernamelabel').style.display = 'none';
    document.getElementById('Username').style.display = 'none';
    document.getElementById('Passwordlabel').style.display = 'none';
    document.getElementById('Password').style.display = 'none';
    document.getElementById('FTPServerlabel').style.display = 'none';
    document.getElementById('FTPServer').style.display = 'none';
    document.getElementById('Sendtoftp').style.display = 'none';
  }
}

function change() {
  document.getElementById('temperature').value=value;
}

function sendNativeMessage() {
  message = document.getElementById('temperature').value;
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  stroffset=inputstr.search("Chromiumversion:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Chromiumversion:','');
    document.getElementById('Chromiumversion').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("Firefoxversion:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Firefoxversion:','');
    document.getElementById('Firefoxversion').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("Firmwareversion:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Firmwareversion:','');
    document.getElementById('Firmwareversion').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("cputype:");
  if(stroffset>=0)
  {
     inputstr=message.replace('cputype:','');
    document.getElementById('cputype').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("systemram:");
  if(stroffset>=0)
  {
     inputstr=message.replace('systemram:','');
    document.getElementById('systemram').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("Storagesize:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Storagesize:','');
    document.getElementById('Storagesize').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("Touchcapability:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Touchcapability:','');
    document.getElementById('Touchcapability').value=inputstr;
    //updateUiState();
    return;
  }
  stroffset=inputstr.search("Resolution:");
  if(stroffset>=0)
  {
     inputstr=message.replace('Resolution:','');
    document.getElementById('Resolution').value=inputstr;
    //updateUiState();
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
  var hostName = "com.google.chrome.report";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function Sendtoftp() {
  message = "Username:"+document.getElementById('Username').value;
  port.postMessage(message);
  message = "Password:"+document.getElementById('Password').value;
  port.postMessage(message);
  message = "FTPServer:"+document.getElementById('FTPServer').value;
  port.postMessage(message);
  message = "Sendtoftp";
  port.postMessage(message);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('Sendtoftp').addEventListener('click', Sendtoftp);
  connect();
  updateUiState();
});
