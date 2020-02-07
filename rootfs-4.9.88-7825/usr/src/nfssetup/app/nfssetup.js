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
    document.getElementById('emmcerase').style.display = 'block';
    document.getElementById('showdeviceipaddr').style.display = 'block';
    document.getElementById('showserveripaddr').style.display = 'block';
    document.getElementById('shownfsroot').style.display = 'block';
    document.getElementById('setup').style.display = 'block';
    document.getElementById('rebootfromnfs').style.display = 'block';
    document.getElementById('labeluserpasswd').style.display = 'none';
    document.getElementById('checkpassword').style.display = 'none';
    }
    else
    {
      document.getElementById('emmcerase').style.display = 'none';
      document.getElementById('showdeviceipaddr').style.display = 'none';
      document.getElementById('showserveripaddr').style.display = 'none';
      document.getElementById('shownfsroot').style.display = 'none';
      document.getElementById('setup').style.display = 'none';
      document.getElementById('rebootfromnfs').style.display = 'none';
      document.getElementById('labeluserpasswd').style.display = 'block';
      document.getElementById('checkpassword').style.display = 'block';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showdeviceipaddr').style.display = 'none';
    document.getElementById('showserveripaddr').style.display = 'none';
    document.getElementById('shownfsroot').style.display = 'none';
    document.getElementById('setup').style.display = 'none';
    document.getElementById('labeluserpasswd').style.display = 'none';
    document.getElementById('checkpassword').style.display = 'none';
    document.getElementById('rebootfromnfs').style.display = 'none';
  }
}

function nfssetup() {
  message = "ipaddr:"+document.getElementById('ipaddr').value;
  port.postMessage(message);
  message = "serverip:"+document.getElementById('serverip').value;
  port.postMessage(message);
  message = "nfsroot:"+document.getElementById('nfsroot').value;
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function rebootfromnfs() {
  message ='exec-command';
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function emmcerase() {
  message ='emmc-erase';
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function checkpassword() {
  message = "checkpassword:"+document.getElementById('userpasswd').value;
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function sendNativeMessage() {
  //message = document.getElementById('temperature').value;
  //port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
 var inputstr=message.replace('"','');
  inputstr=inputstr.replace('"','');
  var stroffset=inputstr.search("ipaddr=");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('ipaddr=','');
    document.getElementById('ipaddr').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("serverip=");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('serverip=','');
    document.getElementById('serverip').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("nfsroot=");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('nfsroot=','');
    document.getElementById('nfsroot').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("checkpassword=pass");
  if(stroffset>=0)
  {
    document.getElementById('status').value=1;
    updateUiState();
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(inputstr) + "</b>");
}

function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "com.google.chrome.nfssetup";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  var addevent = document.getElementById('emmcerase');
  addevent .addEventListener('click', emmcerase);
  var addevent = document.getElementById('setup');
  addevent .addEventListener('click', nfssetup);
  var addevent = document.getElementById('checkpassword');
  addevent .addEventListener('click', checkpassword);
  var addevent = document.getElementById('rebootfromnfs');
  addevent .addEventListener('click', rebootfromnfs);
  document.getElementById('status').value=0;
  connect();
  updateUiState();
});
