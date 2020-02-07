#!/usr/bin/env python
# Copyright (c) 2012 The Chromium Authors. All rights reserved.
# Use of this source code is governed by a BSD-style license that can be
# found in the LICENSE file.

# A simple native messaging host. Shows a Tkinter dialog with incoming messages
# that also allows to send message back to the webapp.

import struct
import sys
import threading
import Queue
import os
import time
import multiprocessing

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
  outputstatus = 0
  output = os.popen('cat /etc/onoffcounter')
  outputstatus = int(output.read().strip())
  if outputstatus>=0:
    send_message( '"START"' )
    textstr='"' + "counter" + str(int(outputstatus))+'"'
    #command = "echo " +"'" + str(int(outputstatus)+1) + " '" + " > /etc/onoffcounter"
    #os.system(command )
    send_message(textstr)
  else:
    send_message( '"STOP"' )
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
    text = sys.stdin.read(text_length);
    textstr=text.strip('"')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      #send_message(test)
      findret = textstr.find('START')
      if findret > -1 :
        command = "echo 0 > /etc/onoffcounter"
        os.system(command )
        command = "cp /usr/share/backupapp/onoff.desktop /etc/xdg/autostart/onoff.desktop"
        os.system(command )
        os.system("sync" )
        send_message( '"START"' )
        send_message( '"counter0"' )
        continue
      findret = textstr.find('STOP')
      if findret > -1 :
        command = "echo -1 > /etc/onoffcounter"
        os.system(command )
        command = "rm -rf /etc/xdg/autostart/onoff.desktop"
        os.system(command )
        os.system("sync" )
        send_message( '"STOP"' )
        continue

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
