// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var port = null;
var can, ctx,
mouseIsDown = 0, len = 0;
touchsDown=0;

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
    document.getElementById('showmaxreportpoint').style.display = 'inline-block';
    document.getElementById('showsensitivitylevel').style.display = 'inline-block';
    document.getElementById('maxreportpointvalue').style.display = 'inline-block';
    document.getElementById('sensitivitylevelvalue').style.display = 'inline-block';
    document.getElementById('settouchparameter').style.display = 'inline-block';
    document.getElementById('canvasclear').style.display = 'block';
    document.getElementById('mycanvas').style.display = 'block';
  } else {
    document.getElementById('connect-button').style.display = 'block';
    document.getElementById('showmaxreportpoint').style.display = 'none';
    document.getElementById('showsensitivitylevel').style.display = 'none';
    document.getElementById('maxreportpointvalue').style.display = 'none';
    document.getElementById('sensitivitylevelvalue').style.display = 'none';
    document.getElementById('settouchparameter').style.display = 'none';
    document.getElementById('canvasclear').style.display = 'none';
    document.getElementById('mycanvas').style.display = 'none';
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

function mouseUp(e) {
  mouseIsDown = 0;
  mouseXY(e);
}
 
function mouseDown(e) {
  mouseIsDown = 1;
  mouseXY(e);
}
 
function touchDown(e) {
  can.focus();
  touchsDown= 1;
  if (!e)
    e = event;
  e.preventDefault();
  //ctx.fillText("111111",100, 100);
  len = e.targetTouches.length;
  for (i = 0; i < len; i++) {
    var touch = event.touches[i];
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.font = "30px Arial";
    ctx.fillText((i+1).toString(),touch.pageX- can.offsetLeft,touch.pageY- can.offsetTop);
  }
}
 
function touchUp(e) {
  can.focus();
  touchsDown=0;
  //touchXY();
}
 
function mouseXY(e) {
  if (!e)
    e = event;
  if(mouseIsDown  !=0)
  {
    ctx.arc(e.pageX- can.offsetLeft, e.pageY- can.offsetTop, 2, 0, 2*Math.PI, true);
    ctx.stroke();
  } 
  canX[0] = e.pageX - can.offsetLeft;
  canY[0] = e.pageY - can.offsetTop;
  len = 1;
}

function clearCanvas() {
  can.focus();
  can.width = can.width;
}

function touchXY(e) {
 //return;
  if (!e)
    e = event;
  e.preventDefault();
  len = e.targetTouches.length;
  for (i = 0; i < len; i++) {
    var touch = event.touches[i];
    switch (i) {
      case 0:
        ctx.fillStyle = "rgb(0,255,255)";
        break;
      case 1:
        ctx.fillStyle = "rgb(255,0,255)";
        break;
      case 2:
        ctx.fillStyle = "rgb(255,255,0)";
        break;
      case 3:
        ctx.fillStyle = "rgb(0,0,255)";
        break;
      case 4:
        ctx.fillStyle = "rgb(0,255,0)";
        break;
      case 5:
        ctx.fillStyle = "rgb(255,0,0)";
        break;
      case 6:
        ctx.fillStyle = "rgb(64,255,255)";
        break;
      case 7:
        ctx.fillStyle = "rgb(255,64,255)";
        break;
      case 8:
        ctx.fillStyle = "rgb(255,255,64)";
        break;
      case 9:
        ctx.fillStyle = "rgb(64,64,255)";
        break;
      default:
        return;
    }
    //var varr=55+20*i;
    //var varg=55+10*i;
    //var varb=255-20*i;
    ctx.globalAlpha = 0.4;
    //ctx.fillStyle = "#c82124";
    //ctx.fillStyle = 'rgb(' + varr.toString() + ',' + varg.toString() + ','  + varb.toString() + ')' ;
    //ctx.fillStyle = "rgb(255,165,0)";
    ctx.beginPath();
    //ctx.arc(touch.pageX- can.offsetLeft, touch.pageY- can.offsetTop, 2, 0, 2*Math.PI, true);
    ctx.arc(touch.pageX- can.offsetLeft, touch.pageY- can.offsetTop, 10, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('connect-button').addEventListener('click', connect);
  document.getElementById('sensitivitylevelvalue').addEventListener('click', sensitivitylevelvalue);
  document.getElementById('maxreportpointvalue').addEventListener('click', maxreportpointvalue);
  document.getElementById('settouchparameter').addEventListener('click', settouchparameter);
  document.getElementById('canvasclear').addEventListener('click', clearCanvas);
  can = document.getElementById("mycanvas");
  ctx = can.getContext("2d");
 
  can.addEventListener("mousedown", mouseDown, false);
  can.addEventListener("mousemove", mouseXY, false);
  can.addEventListener("mouseup", mouseUp, false);
  can.addEventListener("touchstart", touchDown, false);
  can.addEventListener("touchend", touchUp, false);
  can.addEventListener("touchmove", touchXY, false);
 
  document.body.addEventListener("mouseup", mouseUp, false);
  document.body.addEventListener("touchcancel", touchUp, false);
  can.focus();
  connect();
  updateUiState();
});
