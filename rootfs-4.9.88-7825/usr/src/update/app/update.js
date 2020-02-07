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
    document.getElementById('Burn').style.display = 'block';
    document.getElementById('Deletepartition').style.display = 'block';
    document.getElementById('Createpartition').style.display = 'block';
    document.getElementById('Uboot').style.display = 'block';
    document.getElementById('Kernel').style.display = 'block';
    document.getElementById('Filesystem').style.display = 'block';
    if(document.getElementById('status').value == 0)
    {
      document.getElementById('Burn').disabled = false;
      document.getElementById('Deletepartition').disabled = false;
      document.getElementById('Createpartition').disabled = false;
      document.getElementById('Uboot').disabled = false;
      document.getElementById('Kernel').disabled = false;
      document.getElementById('Filesystem').disabled = false;
    }
    else
    {
      document.getElementById('Burn').disabled = true;
      document.getElementById('Deletepartition').disabled = true;
      document.getElementById('Createpartition').disabled = true;
      document.getElementById('Uboot').disabled = true;
      document.getElementById('Kernel').disabled = true;
      document.getElementById('Filesystem').disabled = true;
    }
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('Burn').style.display = 'none';
    document.getElementById('Deletepartition').style.display = 'none';
    document.getElementById('Createpartition').style.display = 'none';
    document.getElementById('Uboot').style.display = 'none';
    document.getElementById('Kernel').style.display = 'none';
    document.getElementById('Filesystem').style.display = 'none';
  }
}

function sendNativeMessage(message) {
  port.postMessage(message);
  appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
  var inputstr=message.replace('"','');
  var stroffset=inputstr.search("disable");
  if(stroffset>=0)
  {
    document.getElementById('status').value= 1;
    updateUiState();
    return;
  }
  stroffset=inputstr.search("enable");
  if(stroffset>=0)
  {
    document.getElementById('status').value=0;
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
  var hostName = "com.google.chrome.update";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function burn() {
  document.getElementById('status').value= 1;
  port.postMessage("burn");
  updateUiState();
}

function deletepartition() {
  document.getElementById('status').value= 1;
  port.postMessage("deletepartition");
  updateUiState();
}

function createpartition() {
  document.getElementById('status').value= 1;
  port.postMessage("createpartition");
  updateUiState();
}

function uboot() {
  document.getElementById('status').value= 1;
  port.postMessage("uboot");
  updateUiState();
}

function kernel() {
  document.getElementById('status').value= 1;
  port.postMessage("kernel");
  updateUiState();
}

function filesystem() {
  document.getElementById('status').value= 1;
  port.postMessage("filesystem");
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('Burn').addEventListener('click', burn);
  document.getElementById('Deletepartition').addEventListener('click', deletepartition);
  document.getElementById('Createpartition').addEventListener('click', createpartition);
  document.getElementById('Uboot').addEventListener('click', uboot);
  document.getElementById('Kernel').addEventListener('click', kernel);
  document.getElementById('Filesystem').addEventListener('click', filesystem);
  connect();
  document.getElementById('status').value= 0;
  updateUiState();
});
