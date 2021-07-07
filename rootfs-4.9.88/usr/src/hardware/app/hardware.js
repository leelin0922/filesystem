// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
var hardwaretable = null;
var getresponse = 0;

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
  } else {
    document.getElementById('connect-button').style.display = 'block';
  }
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
 getresponse = 1;
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
    //port.postMessage("continue");
    return;
  }
  stroffset=inputstr.search("CPU");
  if(stroffset>=0)
  {
    inputstr=message.replace('CPU','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('CPU').innerHTML =inputstr;
      document.getElementById('CPUstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Memery");
  if(stroffset>=0)
  {
    inputstr=message.replace('Memery','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('Memery').innerHTML =inputstr+" KB";
      document.getElementById('Memerystatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("eMMCtotal");
  if(stroffset>=0)
  {
    inputstr=message.replace('eMMCtotal','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('eMMCtotal').innerHTML =inputstr;
      document.getElementById('eMMCtotalstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("eMMCavailable");
  if(stroffset>=0)
  {
    inputstr=message.replace('eMMCavailable','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('eMMCavailable').innerHTML =inputstr;
      document.getElementById('eMMCavailablestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("OStype");
  if(stroffset>=0)
  {
    inputstr=message.replace('OStype','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('OStype').innerHTML =inputstr;
      document.getElementById('OStypestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Version");
  if(stroffset>=0)
  {
    inputstr=message.replace('Version','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('Version').innerHTML =inputstr;
      document.getElementById('Versionstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("MAC1");
  if(stroffset>=0)
  {
    inputstr=message.replace('MAC1','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('MAC1').innerHTML =inputstr;
      document.getElementById('MAC1status').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Thermal");
  if(stroffset>=0)
  {
    inputstr=message.replace('Thermal','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('Thermal').innerHTML =inputstr;
      document.getElementById('Thermalstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Date");
  if(stroffset>=0)
  {
    inputstr=message.replace('Date','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('Date').innerHTML =inputstr;
      document.getElementById('Datestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Time");
  if(stroffset>=0)
  {
    inputstr=message.replace('Time','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('Time').innerHTML =inputstr;
      document.getElementById('Timestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("gateway");
  if(stroffset>=0)
  {
    inputstr=message.replace('gateway','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('gateway').innerHTML =inputstr;
      document.getElementById('gatewaystatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("ipaddr");
  if(stroffset>=0)
  {
    inputstr=message.replace('ipaddr','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('ipaddr').innerHTML =inputstr;
      document.getElementById('ipaddrstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("netmask");
  if(stroffset>=0)
  {
    inputstr=message.replace('netmask','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('netmask').innerHTML =inputstr;
      document.getElementById('netmaskstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("devicename");
  if(stroffset>=0)
  {
    inputstr=message.replace('devicename','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('devicename').innerHTML =inputstr;
      document.getElementById('devicenamestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("inettype");
  if(stroffset>=0)
  {
    inputstr=message.replace('inettype','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('inettype').innerHTML =inputstr;
      document.getElementById('inettypestatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("DNS");
  if(stroffset>=0)
  {
    inputstr=message.replace('DNS','');
    inputstr=inputstr.replace(']','');
    if(inputstr  != 'undefined' )
    {
      document.getElementById('DNS').innerHTML =inputstr;
      document.getElementById('DNSstatus').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("ethernet0");
  if(stroffset>=0)
  {
    inputstr=message.replace('ethernet0','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search(", 0% packet loss");
      if(stroffset>=0)
        document.getElementById('ethernet0').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("I2C3");
  if(stroffset>=0)
  {
    inputstr=message.replace('I2C3','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("0x");
      if(stroffset>=0)
        document.getElementById('I2C3').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Keyboard");
  if(stroffset>=0)
  {
    inputstr=message.replace('Keyboard','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("kbd");
      if(stroffset>=0)
        document.getElementById('Keyboard').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Mouse");
  if(stroffset>=0)
  {
    inputstr=message.replace('Mouse','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("ouse");
      if(stroffset>=0)
        document.getElementById('Mouse').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("USBDISK");
  if(stroffset>=0)
  {
    inputstr=message.replace('USBDISK','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("sda");
      if(stroffset>=0)
        document.getElementById('USBDISK').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("EEPROM");
  if(stroffset>=0)
  {
    inputstr=message.replace('EEPROM','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("1 bytes/write");
      if(stroffset>=0)
        document.getElementById('EEPROM').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("SDCard");
  if(stroffset>=0)
  {
    inputstr=message.replace('SDCard','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("mmcblk2");
      if(stroffset>=0)
        document.getElementById('SDCard').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("ttymxc2");
  if(stroffset>=0)
  {
    inputstr=message.replace('ttymxc2','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("ended");
      if(stroffset>=0)
        document.getElementById('ttymxc2').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("PMU");
  if(stroffset>=0)
  {
    inputstr=message.replace('PMU','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("pfuze");
      if(stroffset>=0)
        document.getElementById('PMU').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Touch");
  if(stroffset>=0)
  {
    inputstr=message.replace('Touch','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("eGalaxTouch");
      if(stroffset>=0)
        document.getElementById('Touch').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Screen");
  if(stroffset>=0)
  {
    inputstr=message.replace('Screen','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("/dev/fb");
      if(stroffset>=0)
        document.getElementById('Screen').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("Buzzer");
  if(stroffset>=0)
  {
    inputstr=message.replace('Buzzer','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("Success");
      if(stroffset>=0)
        document.getElementById('Buzzer').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
    return;
  }
  stroffset=inputstr.search("OTG");
  if(stroffset>=0)
  {
    inputstr=message.replace('OTG','');
    if(inputstr  != 'undefined' )
    {
      stroffset=inputstr.search("001");
      if(stroffset>=0)
        document.getElementById('OTG').innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
    }
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
  var hostName = "com.google.chrome.hardware";
  appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
  port = chrome.runtime.connectNative(hostName);
  port.onMessage.addListener(onNativeMessage);
  port.onDisconnect.addListener(onDisconnected);
  updateUiState();
}

function setup() {
  //port.postMessage("restart");
  //chrome.tabs.update({ url: 'chrome://apps' });
  chrome.tabs.update({ url: 'chrome-extension://dkmjbdkmmdlcmejgicpmocamhaahbmpe/setup.html' });
  //chrome.tabs.update({ url: ' chrome-extension://fibbgagmfejclcmblfijdmahmoljbeim/checkbrowser.html' });
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener(
      'click', connect);
  document.getElementById('setup').addEventListener(
      'click', setup);
  connect();
  $.getJSON("./configs/system_config.json", function(hardwaretable){
    if( typeof hardwaretable != 'undefined' )
    {
      if( typeof hardwaretable.navigation != 'undefined' )
      {
        $.each(hardwaretable.navigation, function(i, field){
          var table = document.getElementById("navigationtable");
          var row = table.insertRow(-1);
          var cell1 = row.insertCell(0);
          var navigationcontent="<li class='toctree-l3'><a href=" + field.link + ">" + field.content +"</a></li>"
          cell1.innerHTML = navigationcontent;
        });
      }
      if( typeof hardwaretable.system_info != 'undefined' )
      {
        $.each(hardwaretable.system_info, function(i, field){
          var table = document.getElementById("basetable");
          var row = table.insertRow(-1);
          var cell0 = row.insertCell(0);
          var cell1 = row.insertCell(1);
          var cell2 = row.insertCell(2);
          cell0.innerHTML = i;
          cell0.style.width = "160px";
          cell1.innerHTML =  "";
          cell1.style.width = "360px";
          cell1.id=i;
          cell2.innerHTML  =  "<img src='img/error.png' width='30' height='30'/>";
          cell2.style.width = "60px";
          cell2.id=i+"status";
          commandstr= i + " " + hardwaretable.system_info[i].cmd.armv7l + " " ;
          //appendMessage("Send message: <b>" + JSON.stringify(commandstr) + "</b>");
          port.postMessage(commandstr);
        });
      }
      if( typeof hardwaretable.network != 'undefined' )
      {
        $.each(hardwaretable.network, function(i, field){
          var table = document.getElementById("networktable");
          var row = table.insertRow(-1);
          var cell0 = row.insertCell(0);
          var cell1 = row.insertCell(1);
          var cell2 = row.insertCell(2);
          cell0.innerHTML = i;
          cell0.style.width = "100px";
          cell1.innerHTML =  "";
          cell1.style.width = "400px";
          cell1.id=i;
          cell2.innerHTML  =  "<img src='img/error.png' width='30' height='30'/>";
          cell2.style.width = "60px";
          cell2.id=i+"status";
          commandstr= i + " " + hardwaretable.network[i].armv7l + " " ;
          //appendMessage("Send message: <b>" + JSON.stringify(commandstr) + "</b>");
          port.postMessage(commandstr);
        });
      }
      if( typeof hardwaretable.date_and_time != 'undefined' )
      {
        $.each(hardwaretable.date_and_time, function(i, field){
          var table = document.getElementById("datetable");
          var row = table.insertRow(-1);
          var cell0 = row.insertCell(0);
          var cell1 = row.insertCell(1);
          var cell2 = row.insertCell(2);
          cell0.innerHTML = i;
          cell0.style.width = "40px";
          cell1.innerHTML =  "";
          cell1.style.width = "480px";
          cell1.id=i;
          cell2.innerHTML  =  "<img src='img/error.png' width='30' height='30'/>";
          cell2.style.width = "60px";
          cell2.id=i+"status";
          commandstr= i + " " + hardwaretable.date_and_time[i].armv7l + " " ;
          //appendMessage("Send message: <b>" + JSON.stringify(commandstr) + "</b>");
          port.postMessage(commandstr);
        });
      }
      if( typeof hardwaretable.hardware_test != 'undefined' )
      {
        $.each(hardwaretable.hardware_test, function(i, field){
          var table = document.getElementById("hardwaretable");
          var row = table.insertRow(-1);
          var cell0 = row.insertCell(0);
          var cell1 = row.insertCell(1);
          var cell2 = row.insertCell(2);
          var cell3 = row.insertCell(3);
          cell0.innerHTML = hardwaretable.hardware_test[i].index;
          cell0.style.width = "20px";
          cell1.innerHTML =  i;
          cell1.style.width = "200px";
          cell2.innerHTML =  hardwaretable.hardware_test[i].descriptor;
          cell2.style.width = "300px";
          cell3.style.width = "60px";
          cell3.id=i;
          cell3.innerHTML =  "<img src='img/error.png' width='30' height='30'/>";
          commandstr= i + " " + hardwaretable.hardware_test[i].shell + " " ;
          //appendMessage("Send message: <b>" + JSON.stringify(commandstr) + "</b>");
          port.postMessage(commandstr);
        });
        //var newtmp = document.getElementById("Buzzer");
        //newtmp.innerHTML =  "<img src='img/ok.png' width='30' height='30'/>";
      }
    }
  });
  updateUiState();
});
