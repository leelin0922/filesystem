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

function replaceMessage(text) {
  document.getElementById('response').innerHTML = "<p>" + text + "</p>";
}

function updateUiState() {
  if (port) {
    document.getElementById('connect-button').style.display = 'none';
    document.getElementById('maxreportpointvalue').style.display = 'block';
    document.getElementById('sensitivitylevelvalue').style.display = 'block';
    document.getElementById('settouchparameter').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('maxreportpointvalue').style.display = 'none';
    document.getElementById('sensitivitylevelvalue').style.display = 'none';
    document.getElementById('settouchparameter').style.display = 'none';
  }
}

function maxreportpointvalue() {
  var value = document.getElementById('maxreportpointvalue').value ;
  if(value < 1)
  {
    value = 1;
    replaceMessage("Error: Max. report point : 1 ~ 10!");
  }
  if(value > 10)
  {
    value = 10;
    replaceMessage("Error: Max. report point : 1 ~ 10!");
  }
  document.getElementById('maxreportpointvalue').value=value;
}

function sensitivitylevelvalue() {
  var value = document.getElementById('sensitivitylevelvalue').value ;
  if(value < -5)
  {
    value = -5;
    replaceMessage("Error: Max. report point : -5 ~ 5!");
  }
  if(value > 5)
  {
    value = 5;
    replaceMessage("Error: Max. report point : -5 ~ 5!");
  }
  document.getElementById('sensitivitylevelvalue').value=value;
}

function settouchparameter() {
  var value = document.getElementById('maxreportpointvalue').value ;
  if(value < 1)
  {
    value = 1;
    replaceMessage("Error: Max. report point : 1 ~ 10!");
    return;
  }
  if(value > 10)
  {
    value = 10;
    replaceMessage("Error: Max. report point : 1 ~ 10!");
    return;
  }
  var value = document.getElementById('sensitivitylevelvalue').value ;
  if(value < -5)
  {
    value = -5;
    document.getElementById('sensitivitylevelvalue').value=value;
    replaceMessage("Error: Max. report point : -5 ~ 5!");
    return;
  }
  if(value > 5)
  {
    value = 5;
    document.getElementById('sensitivitylevelvalue').value=value;
    replaceMessage("Error: Max. report point : -5 ~ 5!");
    return;
  }
  message = "Maxreportpoint:"+document.getElementById('maxreportpointvalue').value;
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  message = "Sensitivitylevel:"+document.getElementById('sensitivitylevelvalue').value;
  port.postMessage(message);
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
  message = "eGalaxSensitivityAdjuster";
  port.postMessage(message);
  alert("Please reboot system!");
  //appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
}

function onNativeMessage(message) {
  var inputstr=message.replace('"','');
  stroffset=inputstr.search("Maxreportpoint:");
  if(stroffset>=0)
  {
    inputstr=message.replace('Maxreportpoint:','');
    if(inputstr  != 'undefined' )
    {
      var value = parseInt(inputstr); ;
      if(value > 0 && value < 11)
      {
        document.getElementById('maxreportpointvalue').value=value;
        return;
      }
    }
  }
  stroffset=inputstr.search("Sensitivitylevel:");
  if(stroffset>=0)
  {
    inputstr=message.replace('Sensitivitylevel:','');
    if(inputstr  != 'undefined' )
    {
      var value = parseInt(inputstr); ;
      if(value > -6 && value < 6)
      {
        document.getElementById('sensitivitylevelvalue').value=value;
        return;
      }
    }
  }
  appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function onDisconnected() {
  appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "com.google.chrome.eetitool";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('sensitivitylevelvalue').addEventListener(
      'click', sensitivitylevelvalue);
  document.getElementById('maxreportpointvalue').addEventListener(
      'click', maxreportpointvalue);
  document.getElementById('settouchparameter').addEventListener(
      'click', settouchparameter);
  connect();
  updateUiState();
});
