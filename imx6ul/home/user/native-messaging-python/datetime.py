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
  while 1:
    outputfd = os.popen('date +%Y-%m-%d')
    output = str(outputfd .read()).strip()
    teststr = '"' + "Date" +output + '"'
    send_message( teststr )
    outputfd = os.popen('date +%H:%M')
    output = str(outputfd .read()).strip()
    teststr = '"' + "Time" +output + '"'
    send_message( teststr )
    outputfd = os.popen('timedatectl | grep Time | awk \'{print $5}\'')
    output = str(outputfd .read()).strip()
    teststr = '"' + "GMT" +output.replace(')','') + '"'
    send_message( teststr )
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
    textstr =text.strip('"')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      findret = textstr.find('Date')
      if findret > -1 :
        myDate= textstr.strip('Date')
        #teststr='"' + str(myDate) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('Time')
      if findret > -1 :
        myTime= textstr.strip('Time')
        #teststr='"' + str(myTime) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('exec-command')
      if findret > -1 :
        if myDate :
          if len(myDate) != 10 :
            send_message('"Format error"')
            continue
        else :
          send_message('"No date data!"')
          continue
        if myTime :
          if len(myTime) != 5 :
            send_message('"Format error"')
            continue
        else :
          send_message('"No time data!"')
          continue
        command = 'sudo timedatectl set-ntp no'
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        command = 'sudo date -s ' + '"' + myDate + ' ' + myTime + '"'
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        teststr = '"' + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('hwclock')
      if findret > -1 :
        outputfd = os.popen('sudo /sbin/hwclock -w -u')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-1200')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+12')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-1100')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+11')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-1000')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+10')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0900')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+9')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0800')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+8')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0700')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+7')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0600')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+6')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0500')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+5')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0400')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+4')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0300')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+3')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0200')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+2')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT-0100')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT+1')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0000')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0100')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-1')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0200')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-2')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0300')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-3')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0400')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-4')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0500')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-5')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0600')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-6')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0700')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-7')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0800')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-8')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+0900')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-9')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+1000')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-10')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+1100')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-11')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+1200')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-12')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+1300')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-13')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('GMT+1400')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-timezone Etc/GMT-14')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('set-ntp-no')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-ntp no')
        output = str(outputfd .read()).strip()
        continue
      findret = textstr.find('set-ntp-yes')
      if findret > -1 :
        outputfd = os.popen('sudo timedatectl set-ntp yes')
        output = str(outputfd .read()).strip()
        time.sleep(2)
        continue
      send_message(text)

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
