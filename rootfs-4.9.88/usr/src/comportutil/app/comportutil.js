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

function AutosendUiState() {
    if(document.getElementById('Autosend').value==0)
    {
      document.getElementById('Comportsendstart').style.display = 'inline-block';
      document.getElementById('Comportsendstop').style.display = 'none';
    }
    else
    {
      document.getElementById('Comportsendstart').style.display = 'none';
      document.getElementById('Comportsendstop').style.display = 'inline-block';
    }
}

function OpentypeUiState() {
    if(document.getElementById('Opentype').value==0)
    {
      document.getElementById('Comportopen').style.display = 'inline-block';
      document.getElementById('Comportclose').style.display = 'none';
    }
    else
    {
      document.getElementById('Comportopen').style.display = 'none';
      document.getElementById('Comportclose').style.display = 'inline-block';
    }
}

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
    //document.getElementById('RS232').style.display = 'inline-block';
    //document.getElementById('RS422').style.display = 'inline-block';
    //document.getElementById('RS485').style.display = 'inline-block';
    ComporttypeUiState();
    document.getElementById('serialport').style.display = 'inline-block';
    document.getElementById('baudrate').style.display = 'inline-block';
    OpentypeUiState();
    document.getElementById('input-text').style.display = 'inline-block';
    AutosendUiState();
    document.getElementById('clearlog').style.display = 'inline-block';
    document.getElementById('showoutput').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('RS232').style.display = 'none';
    document.getElementById('RS422').style.display = 'none';
    document.getElementById('RS485').style.display = 'none';
    document.getElementById('RS422TERM').style.display = 'none';
    document.getElementById('RS485TERM').style.display = 'none';
    document.getElementById('LOOP').style.display = 'none';
    document.getElementById('serialport').style.display = 'none';
    document.getElementById('baudrate').style.display = 'none';
    document.getElementById('Comportopen').style.display = 'none';
    document.getElementById('Comportclose').style.display = 'none';
    document.getElementById('input-text').style.display = 'none';
    document.getElementById('Comportsendstart').style.display = 'none';
    document.getElementById('Comportsendstop').style.display = 'none';
    document.getElementById('clearlog').style.display = 'none';
    document.getElementById('showoutput').style.display = 'none';
  }
}

function autosendNativeMessage() {
  message ="senddata:" + document.getElementById('input-text').value;
  port.postMessage(message);
  message ="sendtimes:1";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function ComporttypeUiState() {
  document.getElementById('RS232').disabled = false;
  document.getElementById('RS422').disabled = false;
  document.getElementById('RS485').disabled = false;
  document.getElementById('RS422TERM').disabled = false;
  document.getElementById('RS485TERM').disabled = false;
  var stroffset=document.getElementById('Comporttype').value.search("RS232");
  if(stroffset>=0)
  {
    document.getElementById('RS232').disabled = true;
    return;
  }
  var stroffset=document.getElementById('Comporttype').value.search("RS422TERM");
  if(stroffset>=0)
  {
    document.getElementById('RS422TERM').disabled = true;
    return;
  }
  var stroffset=document.getElementById('Comporttype').value.search("RS422");
  if(stroffset>=0)
  {
    document.getElementById('RS422').disabled = true;
    return;
  }
  var stroffset=document.getElementById('Comporttype').value.search("RS485TERM");
  if(stroffset>=0)
  {
    document.getElementById('RS485TERM').disabled = true;
    return;
  }
  var stroffset=document.getElementById('Comporttype').value.search("RS485");
  if(stroffset>=0)
  {
    document.getElementById('RS485').disabled = true;
    return;
  }
}

function RS232NativeMessage() {
  CloseNativeMessage();
  message ="RS232";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function RS422NativeMessage() {
  CloseNativeMessage();
  message ="RS422";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function RS422TERMNativeMessage() {
  CloseNativeMessage();
  message ="RS422TERM";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function RS485NativeMessage() {
  CloseNativeMessage();
  message ="RS485";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function RS485TERMNativeMessage() {
  CloseNativeMessage();
  message ="RS485TERM";
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function OpenNativeMessage() {
  message ="baudrate:" + document.getElementById('baudrate').value;
  port.postMessage(message);
  message ="serialport:" + document.getElementById('serialport').value;
  port.postMessage(message);
  message ="senddata:" + document.getElementById('input-text').value;
  port.postMessage(message);
  message ="comportopen";
  port.postMessage(message);
}

function CloseNativeMessage() {
  message ="comportclose";
  port.postMessage(message);
}

function clearlog() {
  document.getElementById('showoutput').value="";
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  inputstr=inputstr.replace('"','');
  var stroffset=inputstr.search("receivedata");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('receivedata','');
    inputstr=inputstr.replace('\n','');
    inputlength=document.getElementById('showoutput').value.length;
    if(inputlength>1800)
    {
      document.getElementById('showoutput').value=inputstr;
    }
    else
    {
      document.getElementById('showoutput').value+=inputstr;
    }
    //document.getElementById('showoutput').scrollTop = document.getElementById('showoutput').scrollHeight;
    return;
  }
  var stroffset=inputstr.search("comportopen");
  if(stroffset>=0)
  {
    document.getElementById('Opentype').value=1;
    OpentypeUiState();
    return;
  }
  var stroffset=inputstr.search("comportclose");
  if(stroffset>=0)
  {
    document.getElementById('Opentype').value=0;
    OpentypeUiState();
    return;
  }
  var stroffset=inputstr.search("Autosend");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('Autosend','');
    document.getElementById('Autosend').value=parseInt(inputstr);
    AutosendUiState();
    return;
  }
  var stroffset=inputstr.search("RS232");
  if(stroffset>=0)
  {
    document.getElementById('Comporttype').value="RS232";
    ComporttypeUiState();
    return;
  }
  var stroffset=inputstr.search("RS422TERM");
  if(stroffset>=0)
  {
    document.getElementById('Comporttype').value="RS422TERM";
    ComporttypeUiState();
    return;
  }
  var stroffset=inputstr.search("RS422");
  if(stroffset>=0)
  {
    document.getElementById('Comporttype').value="RS422";
    ComporttypeUiState();
    return;
  }
  var stroffset=inputstr.search("RS485TERM");
  if(stroffset>=0)
  {
    document.getElementById('Comporttype').value="RS485TERM";
    ComporttypeUiState();
    return;
  }
  var stroffset=inputstr.search("RS485");
  if(stroffset>=0)
  {
    document.getElementById('Comporttype').value="RS485";
    ComporttypeUiState();
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
  var hostName = "com.google.chrome.comportutil";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function homepage() {
  //port.postMessage("restart");
  chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

function setup() {
  //port.postMessage("restart");
  //chrome.tabs.update({ url: 'chrome://apps' });
  chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
  //chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('Comportopen').addEventListener('click', OpenNativeMessage);
  document.getElementById('Comportclose').addEventListener('click', CloseNativeMessage);
  document.getElementById('Comportsendstart').addEventListener('click', autosendNativeMessage);
  document.getElementById('Comportsendstop').addEventListener('click', autosendNativeMessage);
  document.getElementById('RS232').addEventListener('click', RS232NativeMessage);
  document.getElementById('RS422').addEventListener('click', RS422NativeMessage);
  document.getElementById('RS485').addEventListener('click', RS485NativeMessage);
  document.getElementById('RS422TERM').addEventListener('click', RS422TERMNativeMessage);
  document.getElementById('RS485TERM').addEventListener('click', RS485TERMNativeMessage);
  document.getElementById('clearlog').addEventListener('click', clearlog);
  //document.getElementById('baudrate').value="9600";
  document.getElementById('homepage').addEventListener(
      'click', homepage);
  document.getElementById('setup').addEventListener(
      'click', setup);
  connect();
  updateUiState();
});
