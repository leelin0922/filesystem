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
    document.getElementById('temperature').style.display = 'block';
    document.getElementById('cpu-usage').style.display = 'block';
    document.getElementById('envtemp').style.display = 'none';
    document.getElementById('envhumi').style.display = 'none';
    document.getElementById('envlux').style.display = 'none';
    if(document.getElementById('status').value==1)
    {
      document.getElementById('StartRun').style.display = 'none';
      document.getElementById('StopRun').style.display = 'block';
    }
    else
    {
      document.getElementById('StartRun').style.display = 'block';
      document.getElementById('StopRun').style.display = 'none';
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('temperature').style.display = 'none';
    document.getElementById('cpu-usage').style.display = 'none';
    document.getElementById('envtemp').style.display = 'none';
    document.getElementById('envhumi').style.display = 'none';
    document.getElementById('envlux').style.display = 'none';
    document.getElementById('StartRun').style.display = 'none';
    document.getElementById('StopRun').style.display = 'none';
  }
}

function change() {
  document.getElementById('temperature').value=value;
}

function StartRun() {
  document.getElementById('status').value= 1;
  port.postMessage("START");
  updateUiState();
}

function StopRun() {
  document.getElementById('status').value= 0;
  port.postMessage("STOP");
  updateUiState();
}

function sendNativeMessage() {
  message = document.getElementById('temperature').value;
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  var stroffset=inputstr.search("START");
  if(stroffset>=0)
  {
    document.getElementById('status').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("STOP");
  if(stroffset>=0)
  {
    document.getElementById('status').value=0;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("temperature");
  if(stroffset>=0)
  {
    inputstr=message.replace('temperature','');
    document.getElementById('temperature').value=inputstr + " C";
    updateUiState();
    return;
  }
  stroffset=inputstr.search("cpu_usage");
  if(stroffset>=0)
  {
    inputstr=message.replace('cpu_usage','');
    document.getElementById('cpu-usage').value=inputstr + " %";
    updateUiState();
    port.postMessage("continue");
    return;
  }
  stroffset=inputstr.search("envtemp");
  if(stroffset>=0)
  {
    inputstr=message.replace('envtemp','');
    document.getElementById('envtemp').value=inputstr + " C";
    updateUiState();
    return;
  }
  stroffset=inputstr.search("envhumi");
  if(stroffset>=0)
  {
    inputstr=message.replace('envhumi','');
    document.getElementById('envhumi').value=inputstr + " %";
    updateUiState();
    return;
  }
  stroffset=inputstr.search("envlux");
  if(stroffset>=0)
  {
    inputstr=message.replace('envlux','');
    document.getElementById('envlux').value=inputstr + " ";
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
  var hostName = "com.google.chrome.burnin";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  var addevent = document.getElementById('StartRun');
  addevent .addEventListener('click', StartRun);
  var addevent = document.getElementById('StopRun');
  addevent .addEventListener('click', StopRun);
  connect();
  updateUiState();
});
