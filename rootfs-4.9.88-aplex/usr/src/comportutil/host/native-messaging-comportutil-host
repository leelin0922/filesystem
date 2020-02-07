#!/usr/bin/env python
# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

# A simple native messaging host. Shows a Tkinter dialog with incoming messages
# that also allows to send message back to the webapp.

import struct
import sys
import threading
import os
import time
import serial
import re

comPort = None
serialportbaudrate=115200
serialportName="/dev/ttymxc2"
serialportdata="test"
receivethread=None
transmitthread=None
senddatatimes=int(0)

# Helper function that sends a message to the webapp.
def send_message(message):
   # Write message size.
  sys.stdout.write(struct.pack('I', len(message)))
  # Write the message itself.
  sys.stdout.write(message)
  sys.stdout.flush()

# Thread that write  messages from the uartport
def TransmitThread():
  while comPort<> None :
    #outstr='"' + "senddatatimes" + str(senddatatimes) + '"'
    #send_message(outstr)
    time.sleep(0.15)
    if senddatatimes  > 0:
      comPort.write(serialportdata)
      #senddatatimes = int(senddatatimes-1)

# Thread that reads messages from the uartport
def ReceiveThread():
  while comPort<> None :
    #time.sleep(0.05)
    if comPort.inWaiting() > 0:
      #receivestr = comPort.readline()
      receivestr = comPort.read(32)
      if len(receivestr)> 0 :
        outstr = re.sub(r"[\[\]\^\\ <>=;:_`?@]","",receivestr)
        outstr='"' + "receivedata" + str(outstr) + '"'
        send_message(outstr)

# Thread that reads messages from the webapp.
def stdiofunc():
  global comPort
  global receivethread
  global transmitthread
  global serialportdata
  global senddatatimes

  message_number = 0
  output= os.popen('cat /sys/kernel/comportmode/curr_mode')
  commodetype = int (output.read())
  if commodetype == 67 :
    teststr='"' + "RS422"  + '"'
    send_message(teststr)
  elif  commodetype == 68 :
    teststr='"' + "RS485"  + '"'
    send_message(teststr)
  elif  commodetype == 69 :
    teststr='"' + "RS422TERM"  + '"'
    send_message(teststr)
  elif  commodetype == 70 :
    teststr='"' + "RS485TERM"  + '"'
    send_message(teststr)
  elif  commodetype == 71 :
    teststr='"' + "Loopback"  + '"'
    send_message(teststr)
  else :
    teststr='"' + "RS232"  + '"'
    send_message(teststr)

  while 1:
    # Read the message length (first 4 bytes).
    text_length_bytes = sys.stdin.read(4)

    # Unpack message length as 4 byte integer.
    text_length = struct.unpack('i', text_length_bytes)[0]

    # Read the text (JSON object) of the message.
    text = sys.stdin.read(text_length);
    textstr=text.strip('"')
    # In headless mode just send an echo message back.
    findret = textstr.find('comportclose')
    if findret > -1 :
      if comPort <> None :
        comPort.close()
        comPort = None
        send_message(text)
      continue
    findret = textstr.find('baudrate:')
    if findret > -1 :
      serialportbaudrate=int( textstr.replace('baudrate:',''))
      #teststr='"' + str(serialportbaudrate) + '"'
      #send_message(teststr)
      continue
    findret = textstr.find('senddata:')
    if findret > -1 :
      serialportdata= textstr.replace('senddata:','')
      #teststr='"' + str(serialportdata) + '"'
      #send_message(teststr)
      continue
    findret = textstr.find('sendtimes:')
    if findret > -1 :
      if senddatatimes == 0 :
        senddatatimes= 1
      else :
        senddatatimes= 0
      teststr='"' + "Autosend"+ str(senddatatimes) + '"'
      send_message(teststr)
      continue
    findret = textstr.find('serialport:')
    if findret > -1 :
      serialportName= textstr.replace('serialport:','')
      #teststr='"' + str(serialportName) + '"'
      #send_message(teststr)
      continue
    findret = textstr.find('RS232')
    if findret > -1 :
      outputcmd= "echo 66 > /etc/comportmode"
      os.system(outputcmd)
      outputcmd= "echo 66 > /sys/kernel/comportmode/curr_mode"
      os.system(outputcmd)
      send_message(text)
      continue
    findret = textstr.find('RS485TERM')
    if findret > -1 :
      outputcmd= "echo 70 > /etc/comportmode"
      os.system(outputcmd)
      outputcmd= "echo 70 > /sys/kernel/comportmode/curr_mode"
      os.system(outputcmd)
      send_message(text)
      continue
    findret = textstr.find('RS485')
    if findret > -1 :
      outputcmd= "echo 68 > /etc/comportmode"
      os.system(outputcmd)
      outputcmd= "echo 68 > /sys/kernel/comportmode/curr_mode"
      os.system(outputcmd)
      send_message(text)
      continue
    findret = textstr.find('RS422TERM')
    if findret > -1 :
      outputcmd= "echo 69 > /etc/comportmode"
      os.system(outputcmd)
      outputcmd= "echo 69 > /sys/kernel/comportmode/curr_mode"
      os.system(outputcmd)
      send_message(text)
      continue
    findret = textstr.find('RS422')
    if findret > -1 :
      outputcmd= "echo 67 > /etc/comportmode"
      os.system(outputcmd)
      outputcmd= "echo 67 > /sys/kernel/comportmode/curr_mode"
      os.system(outputcmd)
      send_message(text)
      continue
    findret = textstr.find('comportopen')
    if findret > -1 :
      if comPort == None :
        send_message(text)
        comPort = serial.Serial(serialportName, serialportbaudrate, timeout=0.05)
        #comPort.write(serialportdata)
        #time.sleep(1)
        #tmpstr=comPort.readline()
        #teststr='"' + "receivedata" + str(tmpstr) + '"'
        #send_message(teststr)
        receivethread=threading.Thread(target=ReceiveThread)
        transmitthread=threading.Thread(target=TransmitThread)
        receivethread.start()
        transmitthread.start()
        #receivethread.join()
        #transmitthread.join()
      continue
    send_message(text)

def Main():
    #mainthread=threading.Thread(target=stdiofunc)
    #mainthread.start()
    stdiofunc()
    sys.exit(0)

if __name__ == '__main__':
  Main()
