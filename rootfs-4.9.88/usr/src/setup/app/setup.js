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

function clearMessage(text) {
  document.getElementById('response').innerHTML = "";
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

      document.getElementById('showversion').style.display = 'none';
      document.getElementById('brightness').style.display = 'none';
      document.getElementById('datetime').style.display = 'none';
      document.getElementById('userchange').style.display = 'none';
      document.getElementById('homepage').style.display = 'none';
      document.getElementById('network').style.display = 'none';
      document.getElementById('checkbrowser').style.display = 'none';
      document.getElementById('terminal').style.display = 'none';
      document.getElementById('firefox').style.display = 'none';

      document.getElementById('chromiumexit').style.display = 'none';
      document.getElementById('startfirefox').style.display = 'none';
      document.getElementById('desktoprestart').style.display = 'none';
      document.getElementById('systemreboot').style.display = 'none';
      document.getElementById('sshdsocket').style.display = 'none';
      document.getElementById('usbstorage').style.display = 'none';
    }
    else
    {
      document.getElementById('labelusername').style.display = 'none';
      document.getElementById('labeluserpasswd').style.display = 'none';
      document.getElementById('comfirm').style.display = 'none';
      document.getElementById('gohomepage').style.display = 'none';

      document.getElementById('showversion').style.display = 'block';
      document.getElementById('brightness').style.display = 'inline-block';
      document.getElementById('datetime').style.display = 'inline-block';
      document.getElementById('userchange').style.display = 'inline-block';
      document.getElementById('homepage').style.display = 'inline-block';
      document.getElementById('network').style.display = 'inline-block';
      document.getElementById('checkbrowser').style.display = 'inline-block';
      document.getElementById('terminal').style.display = 'inline-block';
      document.getElementById('firefox').style.display = 'inline-block';

      document.getElementById('chromiumexit').style.display = 'inline-block';
      document.getElementById('startfirefox').style.display = 'inline-block';
      document.getElementById('desktoprestart').style.display = 'inline-block';
      document.getElementById('systemreboot').style.display = 'inline-block';
      document.getElementById('sshdsocket').style.display = 'inline-block';
      document.getElementById('usbstorage').style.display = 'inline-block';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showversion').style.display = 'none';
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
    document.getElementById('startfirefox').style.display = 'none';
    document.getElementById('desktoprestart').style.display = 'none';
    document.getElementById('systemreboot').style.display = 'none';
    document.getElementById('sshdsocket').style.display = 'none';
    document.getElementById('usbstorage').style.display = 'none';
  }
  if(document.getElementById('usbstorageflag').value == 1)
  {
    document.getElementById('usbstorage').innerHTML= 'Disable USB Storage';
  }
  else
  {
    document.getElementById('usbstorage').innerHTML= 'Enable USB Storage';
  }
  if(document.getElementById('sshdsocketflag').value == 1)
  {
    document.getElementById('sshdsocket').innerHTML= 'Disable sshd.socket';
  }
  else
  {
    document.getElementById('sshdsocket').innerHTML= 'Enable sshd.socket';
  }
  if(document.getElementById('startfirefoxflag').value == 1)
  {
    document.getElementById('startfirefox').innerHTML= 'Disable Firefox';
  }
  else
  {
    document.getElementById('startfirefox').innerHTML= 'Enable Firefox';
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
  stroffset=inputstr.search("enabledstartfirefox");
  if(stroffset>=0)
  {
    document.getElementById('startfirefoxflag').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("disabledstartfirefox");
  if(stroffset>=0)
  {
    document.getElementById('startfirefoxflag').value= 0;
    updateUiState();
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function lockbutton() {
  document.getElementById('brightness').disabled= true;
  document.getElementById('datetime').disabled= true;
  document.getElementById('userchange').disabled= true;
  document.getElementById('homepage').disabled= true;
  document.getElementById('network').disabled= true;
  document.getElementById('checkbrowser').disabled= true;
  document.getElementById('terminal').disabled= true;
  document.getElementById('firefox').disabled= true;
  document.getElementById('chromiumexit').disabled= true;
  document.getElementById('startfirefox').disabled= true;
  document.getElementById('desktoprestart').disabled= true;
  document.getElementById('systemreboot').disabled= true;
  document.getElementById('sshdsocket').disabled= true;
  document.getElementById('usbstorage').disabled= true;
}

function unlockbutton() {
  document.getElementById('brightness').disabled= false;
  document.getElementById('datetime').disabled= false;
  document.getElementById('userchange').disabled= false;
  document.getElementById('homepage').disabled= false;
  document.getElementById('network').disabled= false;
  document.getElementById('checkbrowser').disabled= false;
  document.getElementById('terminal').disabled= false;
  document.getElementById('firefox').disabled= false;
  document.getElementById('chromiumexit').disabled= false;
  document.getElementById('startfirefox').disabled= false;
  document.getElementById('desktoprestart').disabled= false;
  document.getElementById('systemreboot').disabled= false;
  document.getElementById('sshdsocket').disabled= false;
  document.getElementById('usbstorage').disabled= false;
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
  lockbutton();
  message = "username:"+document.getElementById('username').value;
  port.postMessage(message);
  message = "userpasswd:"+document.getElementById('userpasswd').value;
  port.postMessage(message);
  port.postMessage("checkpassword");
  unlockbutton();
}

function brightness() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://kokbmofbkaoannepaeobhfklmafefppc/brightness.html' });
  unlockbutton();
}

function datetime() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://kcciihimnolailelllbcnialoginipmi/datetime.html' });
  unlockbutton();
}

function userchange() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://blblinjchgcdgfmaflhliecpbgemdmci/userchange.html' });
  unlockbutton();
}

function homepage() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://ngkflanckphikledkbnbocalfbfkeaij/startuppage.html' });
  unlockbutton();
}

function network() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://pjmlffccadkfjahmpodohbdpacihaokh/network.html' });
  unlockbutton();
}

function checkbrowser() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
  unlockbutton();
}

function chromiumexit() {
  lockbutton();
  port.postMessage("chromiumexit");
  unlockbutton();
}

function usbstorage() {
  lockbutton();
  if(document.getElementById('usbstorageflag').value == 0)
  {
    port.postMessage("enableusbstorage");
  }
  else
  {
    port.postMessage("disableusbstorage");
  }
  unlockbutton();
}

function desktoprestart() {
  lockbutton();
  port.postMessage("desktoprestart");
  unlockbutton();
}

function systemreboot() {
  lockbutton();
  port.postMessage("systemreboot");
  unlockbutton();
}

function gohomepage() {
  lockbutton();
  chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
  unlockbutton();
}

function startTimeterminal() {
  counter++;
  if(counter>5)
  {
    unlockbutton();
    return;
  }
  var t = setTimeout(function(){ startTimeterminal() }, 1000);
}

function startTimefirefox() {
  counter++;
  if(counter>20)
  {
    unlockbutton();
    clearMessage();
    //document.getElementById('username').value="";
    //document.getElementById('userpasswd').value="";
    //port.postMessage("removeauthored");
    //document.getElementById('authored').value= 0;
    updateUiState();
    return;
  }
  var t = setTimeout(function(){ startTimefirefox() }, 1000);
}

function terminal() {
  lockbutton();
  port.postMessage("terminal");
  counter=0;
  startTimeterminal();
}

function firefox() {
  lockbutton();
  appendMessage("Please wait, Firefox is loading now.")
  port.postMessage("runfirefox");
  counter=0;
  startTimefirefox();
}

function sshdsocket() {
  lockbutton();
  if(document.getElementById('sshdsocketflag').value == 0)
  {
    port.postMessage("enablesshdsocket");
  }
  else
  {
    port.postMessage("disablesshdsocket");
  }
  unlockbutton();
}

function startfirefox() {
  lockbutton();
  if(document.getElementById('startfirefoxflag').value == 0)
  {
    port.postMessage("enablestartfirefox");
  }
  else
  {
    port.postMessage("disablestartfirefox");
  }
  unlockbutton();
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
  document.getElementById('startfirefox').addEventListener(
      'click', startfirefox);
  document.getElementById('authored').value= 0;
  document.getElementById('usbstorageflag').value= 0;
  document.getElementById('sshdsocketflag').value= 0;
  document.getElementById('startfirefoxflag').value= 0;
  connect();
  updateUiState();
});
