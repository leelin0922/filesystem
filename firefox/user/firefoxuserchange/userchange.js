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

    document.getElementById('usertitle').style.display = 'block';
    document.getElementById('labeluserpasswd').style.display = 'block';
    document.getElementById('labelnewuserpasswd').style.display = 'block';
    document.getElementById('labelcheckuserpasswd').style.display = 'block';
    document.getElementById('userpasswd').style.display = 'block';
    document.getElementById('newuserpasswd').style.display = 'block';
    document.getElementById('checkuserpasswd').style.display = 'block';

    document.getElementById('setuserpasswd').style.display = 'block';

    document.getElementById('roottitle').style.display = 'block';
    document.getElementById('labelrootpasswd').style.display = 'block';
    document.getElementById('labelnewrootrpasswd').style.display = 'block';
    document.getElementById('labelcheckrootpasswd').style.display = 'block';
    document.getElementById('rootpasswd').style.display = 'block';
    document.getElementById('newrootpasswd').style.display = 'block';
    document.getElementById('checkrootpasswd').style.display = 'block';

    document.getElementById('setrootpasswd').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';

    document.getElementById('usertitle').style.display = 'none';
    document.getElementById('labeluserpasswd').style.display = 'none';
    document.getElementById('labelnewuserpasswd').style.display = 'none';
    document.getElementById('labelcheckuserpasswd').style.display = 'none';
    document.getElementById('userpasswd').style.display = 'none';
    document.getElementById('newuserpasswd').style.display = 'none';
    document.getElementById('checkuserpasswd').style.display = 'none';

    document.getElementById('setuserpasswd').style.display = 'none';

    document.getElementById('roottitle').style.display = 'none';
    document.getElementById('labelrootpasswd').style.display = 'none';
    document.getElementById('labelnewrootrpasswd').style.display = 'none';
    document.getElementById('labelcheckrootpasswd').style.display = 'none';
    document.getElementById('rootpasswd').style.display = 'none';
    document.getElementById('newrootpasswd').style.display = 'none';
    document.getElementById('checkrootpasswd').style.display = 'none';

    document.getElementById('setrootpasswd').style.display = 'none';
  }
}

function setuserpasswd() {
  if(document.getElementById('newuserpasswd').value==document.getElementById('checkuserpasswd').value)
  {
    newpassword=document.getElementById('newuserpasswd').value;
    if(newpassword.length<8)
    {
      alert("Error: Password must contain at least eight characters!");
      return;
    }
    var lowerCaseLetters= /[a-z]/g;
    if(newpassword.match(lowerCaseLetters)) {  
    }
    else
    {
      alert("Error: password must contain at least one lowercase letter (a-z)!");
      return;
    }
    var upperCaseLetters= /[A-Z]/g;
    if(newpassword.match(upperCaseLetters)) {  
    }
    else
    {
      alert("Error: password must contain at least one uppercase letter (A-Z)!");
      return;
    }
    var numbers = /[0-9]/g;
    if(newpassword.match(numbers)) {  
    }
    else
    {
      alert("Error: password must contain at least one numeric character [0-9]!");
      return;
    }
    message = "CheckUserpassword:"+document.getElementById('userpasswd').value;
    port.postMessage(message);
    //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  }
  else
  {
    alert("Error:New Password must same!");
  }
}

function setrootpasswd() {
  if(document.getElementById('newrootpasswd').value==document.getElementById('checkrootpasswd').value)
  {
    newpassword=document.getElementById('newrootpasswd').value;
    if(newpassword.length<8)
    {
      alert("Error: Password must contain at least eight characters!");
      return;
    }
    var lowerCaseLetters= /[a-z]/g;
    if(newpassword.match(lowerCaseLetters)) {  
    }
    else
    {
      alert("Error: password must contain at least one lowercase letter (a-z)!");
      return;
    }
    var upperCaseLetters= /[A-Z]/g;
    if(newpassword.match(upperCaseLetters)) {  
    }
    else
    {
      alert("Error: password must contain at least one uppercase letter (A-Z)!");
      return;
    }
    var numbers = /[0-9]/g;
    if(newpassword.match(numbers)) {  
    }
    else
    {
      alert("Error: password must contain at least one numeric character [0-9]!");
      return;
    }
    message = "CheckRootpassword:"+document.getElementById('rootpasswd').value;
    port.postMessage(message);
    //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  }
  else
  {
    alert("Error:New Password must same!");
  }
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  inputstr=inputstr.replace('"','');
  var stroffset=inputstr.search("ConfirmUserpassword:");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('ConfirmUserpassword:','');
    if(document.getElementById('userpasswd').value==inputstr)
    {
      message = "SetUserpassword:"+document.getElementById('newuserpasswd').value;
      port.postMessage(message);
      alert("Set user password pass!");
      return;
    }
    alert("Error: old password error!");
  }
  var stroffset=inputstr.search("ConfirmRootpassword:");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('ConfirmRootpassword:','');
    if(document.getElementById('rootpasswd').value==inputstr)
    {
      message = "SetRootpassword:"+document.getElementById('newrootpasswd').value;
      port.postMessage(message);
      alert("Set root password pass!");
      return;
    }
    alert("Error: old password error!");
    return;
  }
  var stroffset=inputstr.search("Checkpasswordfail");
  if(stroffset>=0)
  {
    alert("Error: old password error!");
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
  //appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  appendMessage("Failed to connect!!");
  port = null;
  updateUiState();
}

function connect() {
  //var hostName = "com.google.chrome.userchange";
  //appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  var hostName = "userchange";
  appendMessage("Connecting to native messaging host <b>" + hostName + ".json" + "</b>")
  //port = chrome.runtime.connectNative(hostName);
  port = browser.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('setuserpasswd').addEventListener(
      'click', setuserpasswd);
  document.getElementById('setrootpasswd').addEventListener(
      'click', setrootpasswd);
  connect();
  updateUiState();
});
