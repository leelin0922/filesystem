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
    document.getElementById('send-message-button').style.display = 'block';
    document.getElementById('ipaddr').style.display = 'block';
    document.getElementById('netmask').style.display = 'block';
    document.getElementById('gateway').style.display = 'block';
    document.getElementById('nameservers').style.display = 'block';
    document.getElementById('showipaddr').style.display = 'block';
    document.getElementById('shownetmask').style.display = 'block';
    document.getElementById('showgateway').style.display = 'block';
    document.getElementById('shownameservers').style.display = 'block';
    document.getElementById('showType').style.display = 'block';
    document.getElementById('showmanual').style.display = 'block';
    document.getElementById('showdhcp').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('send-message-button').style.display = 'none';
    document.getElementById('ipaddr').style.display = 'none';
    document.getElementById('netmask').style.display = 'none';
    document.getElementById('gateway').style.display = 'none';
    document.getElementById('nameservers').style.display = 'none';
    document.getElementById('showipaddr').style.display = 'none';
    document.getElementById('shownetmask').style.display = 'none';
    document.getElementById('showgateway').style.display = 'none';
    document.getElementById('shownameservers').style.display = 'none';
    document.getElementById('showType').style.display = 'none';
    document.getElementById('showmanual').style.display = 'none';
    document.getElementById('showdhcp').style.display = 'none';
  }
}

function manual() {
    document.getElementById('manual').checked = true;
    document.getElementById('dhcp').checked = false;
  updateUiState();
}

function dhcp() {
    document.getElementById('manual').checked = false;
    document.getElementById('dhcp').checked = true;
  updateUiState();
}

function sendNativeMessage() {
  message = "ipaddr"+document.getElementById('ipaddr').value;
  port.postMessage(message);
  message = "netmask"+document.getElementById('netmask').value;
  port.postMessage(message);
  message = "gateway"+document.getElementById('gateway').value;
  port.postMessage(message);
  message = "nameservers"+document.getElementById('nameservers').value;
  port.postMessage(message);
  if(document.getElementById('dhcp').checked==true)
  {
    message ='dhcp';
  }
  else
  {
    message ='manual';
  }
  port.postMessage(message);
  message ='exec-command';
  port.postMessage(message);
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  inputstr=inputstr.replace('"','');
  var stroffset=inputstr.search("ipaddr");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('ipaddr','');
    document.getElementById('ipaddr').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("netmask");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('netmask','');
    document.getElementById('netmask').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("gateway");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('gateway','');
    document.getElementById('gateway').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("nameservers");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('nameservers','');
    inputstr=inputstr.replace(']','');
    document.getElementById('nameservers').value=inputstr;
    return;
  }
  var stroffset=inputstr.search("manual");
  if(stroffset>=0)
  {
    document.getElementById('manual').checked = true;
    document.getElementById('dhcp').checked = false;
    return;
  }
  var stroffset=inputstr.search("dhcp");
  if(stroffset>=0)
  {
    document.getElementById('dhcp').checked = true;
    document.getElementById('manual').checked = false;
    return;
  }
  //appendMessage("Received message: <b>" + JSON.stringify(inputstr) + "</b>");
}

function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "com.google.chrome.network";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('send-message-button').addEventListener(
      'click', sendNativeMessage);
  document.getElementById('manual').addEventListener(
      'click', manual);
  document.getElementById('dhcp').addEventListener(
      'click', dhcp);
  connect();
  updateUiState();
});
