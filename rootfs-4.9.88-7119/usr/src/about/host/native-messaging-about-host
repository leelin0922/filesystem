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
  jiffy = os.sysconf(os.sysconf_names['SC_CLK_TCK'])
  outputfd = os.popen("cat /etc/version")
  outputstr = str(outputfd.read()).rstrip()
  if outputstr :
    sendtext='"' + "version:" +str(outputstr[0:8])+'"'
    send_message(sendtext)
  outputfd = os.popen("grep Hardware /proc/cpuinfo | awk -F ':' '{print $2}'")
  outputstr = str(outputfd.read()).rstrip()
  if outputstr :
    sendtext='"' + "cpuinfo:" +str(outputstr.strip())+'"'
    send_message(sendtext)
  outputfd = os.popen("cat /sys/devices/system/cpu/cpufreq/policy0/cpuinfo_max_freq")
  outputstr = str(outputfd.read()).rstrip()
  if outputstr :
    sendtext='"' + "cpuspeed:" +str(outputstr.strip())+ " KHz" + '"'
    send_message(sendtext)
  outputfd = os.popen("grep MemTotal /proc/meminfo | awk -F ':' '{print $2}' | awk -F ' ' '{print $1}'")
  outputstr = str(outputfd.read()).rstrip()
  if outputstr :
    sendtext='"' + "meminfo:" +str(outputstr.strip()) + " KB"+'"'
    send_message(sendtext)
  message_number = 0
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
        brightnesscmd = "threadtest.out 0 &"
        os.system(brightnesscmd )
        continue
      findret = textstr.find('STOP')
      if findret > -1 :
        brightnesscmd = "killall threadtest.out"
        os.system(brightnesscmd )
        continue

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
