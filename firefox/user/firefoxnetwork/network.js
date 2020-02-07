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
    document.getElementById('ProxyType').style.display = 'block';
    document.getElementById('showproxy').style.display = 'block';
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
    document.getElementById('ProxyType').style.display = 'none';
    document.getElementById('showproxy').style.display = 'none';
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
    message ='staticip';
  }
  port.postMessage(message);
  message ='exec-command';
  port.postMessage(message);
  //appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
}

function proxysetup() {
  if(document.getElementById('proxydirect').checked==true)
  {
    message = "proxytypedirect";
    port.postMessage(message);
    message ='exec-proxy';
    port.postMessage(message);
    document.getElementById('proxyserver').value="";
    return;
  }
  proxyserver = document.getElementById('proxyserver').value;
  //if(document.getElementById('proxyauto').checked==true)
  //{
    //message = "proxytypeauto";
    //port.postMessage(message);
    //message = "proxyserver" +  proxyserver ;
    //port.postMessage(message);
    //message ="exec-proxy";
    //port.postMessage(message);
    //return;
  //}
  if(document.getElementById('proxymanual').checked==true)
  {
    message = "proxytypemanual";
    port.postMessage(message);
    message = "proxyserver" +  proxyserver ;
    port.postMessage(message);
    message ='exec-proxy';
    port.postMessage(message);
    return;
  }
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
  var stroffset=inputstr.search("staticip");
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
  var stroffset=inputstr.search("proxytypedirect");
  if(stroffset>=0)
  {
    proxydirect();
    return;
  }
  //var stroffset=inputstr.search("proxytypeauto");
  //if(stroffset>=0)
  //{
    //proxyauto();
    //return;
  //}
  var stroffset=inputstr.search("proxytypemanual");
  if(stroffset>=0)
  {
    proxymanual()
    return;
  }
  var stroffset=inputstr.search("proxyserver");
  if(stroffset>=0)
  {
    inputstr=inputstr.replace('proxyserver','');
    inputstr=inputstr.replace(']','');
    document.getElementById('proxyserver').value=inputstr;
    return;
  }
  appendMessage("Received message: <b>" + JSON.stringify(inputstr) + "</b>");
}

function onDisconnected() {
  //appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
  appendMessage("Failed to connect!!");
  port = null;
  updateUiState();
}

function connect() {
  var hostName = "network";
  appendMessage("Connecting to native messaging host <b>" + hostName + ".json" + "</b>")
  port = browser.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function proxydirect() {
  document.getElementById('proxydirect').checked = true;
  //document.getElementById('proxyauto').checked = false;
  document.getElementById('proxymanual').checked = false;
  updateUiState();
}

//function proxyauto() {
  //document.getElementById('proxydirect').checked = false;
  //document.getElementById('proxyauto').checked = true;
  //document.getElementById('proxymanual').checked = false;
  //updateUiState();
//}

function proxymanual() {
  document.getElementById('proxydirect').checked = false;
  //document.getElementById('proxyauto').checked = false;
  document.getElementById('proxymanual').checked = true;
  updateUiState();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('send-message-button').addEventListener('click', sendNativeMessage);
  document.getElementById('manual').addEventListener('click', manual);
  document.getElementById('dhcp').addEventListener('click', dhcp);
  document.getElementById('proxydirect').addEventListener('click', proxydirect);
  //document.getElementById('proxyauto').addEventListener('click', proxyauto);
  document.getElementById('proxymanual').addEventListener('click', proxymanual);
  document.getElementById('proxysetup').addEventListener('click', proxysetup);
  connect();
  updateUiState();
});
