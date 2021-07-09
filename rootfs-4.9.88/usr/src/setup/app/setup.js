// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
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
    if(document.getElementById('authored').value==0)
    {
      document.getElementById('labelusername').style.display = 'block';
      document.getElementById('labeluserpasswd').style.display = 'block';
      document.getElementById('comfirm').style.display = 'block';
      document.getElementById('gohomepage').style.display = 'block';
      document.getElementById('brightness').style.display = 'none';
      document.getElementById('datetime').style.display = 'none';
      document.getElementById('userchange').style.display = 'none';
      document.getElementById('homepage').style.display = 'none';
      document.getElementById('network').style.display = 'none';
      document.getElementById('checkbrowser').style.display = 'none';
      document.getElementById('terminal').style.display = 'none';
      document.getElementById('firefox').style.display = 'none';

      document.getElementById('chromiumexit').style.display = 'none';
      document.getElementById('usbstorage').style.display = 'none';
      document.getElementById('desktoprestart').style.display = 'none';
      document.getElementById('systemreboot').style.display = 'none';
      document.getElementById('sshdsocket').style.display = 'none';
    }
    else
    {
      document.getElementById('labelusername').style.display = 'none';
      document.getElementById('labeluserpasswd').style.display = 'none';
      document.getElementById('comfirm').style.display = 'none';
      document.getElementById('gohomepage').style.display = 'none';
      document.getElementById('brightness').style.display = 'inline-block';
      document.getElementById('datetime').style.display = 'inline-block';
      document.getElementById('userchange').style.display = 'inline-block';
      document.getElementById('homepage').style.display = 'inline-block';
      document.getElementById('network').style.display = 'inline-block';
      document.getElementById('checkbrowser').style.display = 'inline-block';
      document.getElementById('terminal').style.display = 'inline-block';
      document.getElementById('firefox').style.display = 'inline-block';

      document.getElementById('chromiumexit').style.display = 'inline-block';
      document.getElementById('usbstorage').style.display = 'inline-block';
      document.getElementById('desktoprestart').style.display = 'inline-block';
      document.getElementById('systemreboot').style.display = 'inline-block';
      document.getElementById('sshdsocket').style.display = 'inline-block';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('labelusername').style.display = 'none';
    document.getElementById('labeluserpasswd').style.display = 'none';
    document.getElementById('comfirm').style.display = 'none';
    document.getElementById('brightness').style.display = 'none';
    document.getElementById('datetime').style.display = 'none';
    document.getElementById('userchange').style.display = 'none';
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('network').style.display = 'none';
    document.getElementById('checkbrowser').style.display = 'none';
    document.getElementById('terminal').style.display = 'none';
    document.getElementById('firefox').style.display = 'none';

    document.getElementById('chromiumexit').style.display = 'none';
    document.getElementById('usbstorage').style.display = 'none';
    document.getElementById('desktoprestart').style.display = 'none';
    document.getElementById('systemreboot').style.display = 'none';
    document.getElementById('sshdsocket').style.display = 'none';
  }
  if(    document.getElementById('usbstorageflag').value == 1)
  {
    document.getElementById('usbstorage').innerHTML= 'To disable USB storage';
  }
  else
  {
    document.getElementById('usbstorage').innerHTML= 'To enable USB storage';
  }
  if(  document.getElementById('sshdsocketflag').value == 1)
  {
    document.getElementById('sshdsocket').innerHTML= 'To disable sshd.socket';
  }
  else
  {
    document.getElementById('sshdsocket').innerHTML= 'To enable sshd.socket';
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
  stroffset=inputstr.search("NoAuthored");
  if(stroffset>=0)
  {
    document.getElementById('authored').value= 0;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("HadAuthored");
  if(stroffset>=0)
  {
    document.getElementById('authored').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("Checkpasswordfail");
  if(stroffset>=0)
  {
    document.getElementById('authored').value= 0;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("Checkpasswordpass");
  if(stroffset>=0)
  {
    document.getElementById('authored').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("version:");
  if(stroffset>=0)
  {
    inputstr=message.replace('version:','');
    document.getElementById('version').value=inputstr;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("usbstorageisdisable");
  if(stroffset>=0)
  {
    document.getElementById('usbstorageflag').value= 0;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("usbstorageisenable");
  if(stroffset>=0)
  {
    document.getElementById('usbstorageflag').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("sshdsocketisenable");
  if(stroffset>=0)
  {
    document.getElementById('sshdsocketflag').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("sshdsocketisdisable");
  if(stroffset>=0)
  {
    document.getElementById('sshdsocketflag').value= 0;
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
  var hostName = "com.google.chrome.setup";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function comfirm() {
  message = "username:"+document.getElementById('username').value;
  port.postMessage(message);
  message = "userpasswd:"+document.getElementById('userpasswd').value;
  port.postMessage(message);
  port.postMessage("checkpassword");
}

function brightness() {
  chrome.tabs.update({ url: ' chrome-extension://kokbmofbkaoannepaeobhfklmafefppc/brightness.html' });
}

function datetime() {
  chrome.tabs.update({ url: ' chrome-extension://kcciihimnolailelllbcnialoginipmi/datetime.html' });
}

function userchange() {
  chrome.tabs.update({ url: ' chrome-extension://blblinjchgcdgfmaflhliecpbgemdmci/userchange.html' });
}

function homepage() {
  chrome.tabs.update({ url: ' chrome-extension://ngkflanckphikledkbnbocalfbfkeaij/startuppage.html' });
}

function network() {
  chrome.tabs.update({ url: ' chrome-extension://pjmlffccadkfjahmpodohbdpacihaokh/network.html' });
}

function checkbrowser() {
  chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

function chromiumexit() {
  port.postMessage("chromiumexit");
}

function usbstorage() {
  if(  document.getElementById('usbstorageflag').value == 0)
  {
    port.postMessage("enableusbstorage");
  }
  else
  {
    port.postMessage("disableusbstorage");
  }
}

function desktoprestart() {
  port.postMessage("desktoprestart");
}

function systemreboot() {
  port.postMessage("systemreboot");
}

function gohomepage() {
  //port.postMessage("restart");
  chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

function startTimeterminal() {
  counter++;
  if(counter>5)
  {
    document.getElementById('terminal').disabled= false;
    return;
  }
  var t = setTimeout(function(){ startTimeterminal() }, 1000);
}

function startTimefirefox() {
  counter++;
  if(counter>15)
  {
    document.getElementById('firefox').disabled= false;
    return;
  }
  var t = setTimeout(function(){ startTimefirefox() }, 1000);
}

function terminal() {
  document.getElementById('terminal').disabled= true;
  port.postMessage("terminal");
  counter=0;
  startTimeterminal();
}

function firefox() {
  document.getElementById('firefox').disabled= true;
  port.postMessage("firefox");
  counter=0;
  startTimefirefox();
}

function sshdsocket() {
  if(  document.getElementById('sshdsocketflag').value == 0)
  {
    port.postMessage("enablesshdsocket");
  }
  else
  {
    port.postMessage("disablesshdsocket");
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('comfirm').addEventListener(
      'click', comfirm);
  document.getElementById('brightness').addEventListener(
      'click', brightness);
  document.getElementById('datetime').addEventListener(
      'click', datetime);
  document.getElementById('userchange').addEventListener(
      'click', userchange);
  document.getElementById('homepage').addEventListener(
      'click', homepage);
  document.getElementById('gohomepage').addEventListener(
      'click', gohomepage);
  document.getElementById('network').addEventListener(
      'click', network);
  document.getElementById('checkbrowser').addEventListener(
      'click', checkbrowser);
  document.getElementById('terminal').addEventListener(
      'click', terminal);
  document.getElementById('firefox').addEventListener(
      'click', firefox);

  document.getElementById('chromiumexit').addEventListener(
      'click', chromiumexit);
  document.getElementById('usbstorage').addEventListener(
      'click', usbstorage);
  document.getElementById('desktoprestart').addEventListener(
      'click', desktoprestart);
  document.getElementById('systemreboot').addEventListener(
      'click', systemreboot);
  document.getElementById('sshdsocket').addEventListener(
      'click', sshdsocket);
  document.getElementById('authored').value= 0;
  document.getElementById('usbstorageflag').value= 0;
  document.getElementById('sshdsocketflag').value= 0;
  connect();
  updateUiState();
});
