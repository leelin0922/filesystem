#!/usr/bin/env python
# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

# A simple native messaging host. Shows a Tkinter dialog with incoming messages
# that also allows to send message back to the webapp.

import struct
import sys
#import threading
#import Queue
import os
#import locale
#import string
import time

# Helper function that sends a message to the webapp.
def send_message(message):
   # Write message size.
  sys.stdout.write(struct.pack('I', len(message)))
  # Write the message itself.
  sys.stdout.write(message)
  sys.stdout.flush()

# Thread that reads messages from the webapp.
def read_thread_func(queue):
  message_number = 0
  Maxreportpoint = 10
  Sensitivitylevel = 0
  findret = -1
  output = os.popen('cat /etc/eetitouch | grep Maxreportpoint')
  Maxreportpointstr= output.read()
  Maxreportpointstr = Maxreportpointstr.replace('Maxreportpoint:','')
  Maxreportpoint = int(Maxreportpointstr)
  test = '"' + "Maxreportpoint:"+ str(Maxreportpoint)+ '"'
  send_message( test )
  output = os.popen('cat /etc/eetitouch | grep Sensitivitylevel')
  Sensitivitylevelstr= output.read()
  Sensitivitylevelstr= Sensitivitylevelstr.replace('Sensitivitylevel:','')
  Sensitivitylevel= int(Sensitivitylevelstr)
  test = '"' + "Sensitivitylevel:"+ str(Sensitivitylevel)+ '"'
  send_message( test )
  while 1:
    # Read the message length (first 4 bytes).
    text_length_bytes = sys.stdin.read(4)

    if len(text_length_bytes) == 0:
      if queue:
        queue.put(None)
      sys.exit(0)

    # Unpack message length as 4 byte integer.
    text_length = struct.unpack('i', text_length_bytes)[0]

    # Read the text (JSON object) of the message.
    #text = sys.stdin.read(text_length).decode('utf-8')
    text = sys.stdin.read(text_length);
    textstr=text.strip('"')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      #send_message('{"echo": %s}' % text)
      #send_message(text)
      findret = textstr.find('Maxreportpoint:')
      if findret > -1 :
        Maxreportpointstr = textstr.replace('Maxreportpoint:','')
        Maxreportpoint = int(Maxreportpointstr)
        continue
      findret = textstr.find('Sensitivitylevel:')
      if findret > -1 :
        Sensitivitylevelstr= textstr.replace('Sensitivitylevel:','')
        Sensitivitylevel = int(Sensitivitylevelstr)
        continue
      findret = textstr.find('eGalaxSensitivityAdjuster')
      if findret > -1 :
        if Maxreportpoint < 0 or Maxreportpoint > 10: 
          continue
        if Sensitivitylevel < -5 or Sensitivitylevel > 5: 
          continue
        command = "eGalaxSensitivityAdjuster -m " + str(Maxreportpoint) + " -s " + str(Sensitivitylevel )
        #send_message('"' + command + '"')
        outputfd = os.popen(command)
        output.read()
        f = open("/etc/eetitouch", "w+")
        Maxreportpointstr = 'Maxreportpoint:' + str(Maxreportpoint) + '\r\n'
        f.write(Maxreportpointstr )
        Sensitivitylevelstr= 'Sensitivitylevel:' + str(Sensitivitylevel) + '\r\n'
        f.write(Sensitivitylevelstr)
        f.close()
        outputfd = os.popen("sync")
        output.read()
        time.sleep(1)
        outputfd = os.popen("eGalaxSensitivityAdjuster -t")
        output.read()
        continue
      send_message(text)


def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
