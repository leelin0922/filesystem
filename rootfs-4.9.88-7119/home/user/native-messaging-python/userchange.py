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
      #send_message('{"echo": %s}' % text)
      findret = textstr.find('CheckUserpassword:')
      if findret > -1 :
        textstr= textstr.replace('CheckUserpassword:','')
        #message = '"' + str(textstr) + '"'
        #send_message(message)
        command = "sudo /usr/bin/checkpassword.out user " + str(textstr) + " | grep 'password pass'"
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        findret = output .find('pass!')
        if findret > -1 :
          message = '"' + "ConfirmUserpassword:" + str(textstr) + '"'
          send_message(message)
        else:
          message = '"' + "Checkpasswordfail" + '"'
          send_message(message)
        continue
      findret = textstr.find('SetUserpassword:')
      if findret > -1 :
        textstr= textstr.replace('SetUserpassword:','')
        command = "echo user:" + str(textstr) + " > /tmp/userpasswd"
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        outputfd = os.popen("sudo /usr/sbin/chpasswd.shadow < /tmp/userpasswd")
        output = str(outputfd .read()).strip() 
        outputfd = os.popen("rm /home/user/userchange")
        output = str(outputfd .read()).strip() 
        outputfd = os.popen("sync")
        output = str(outputfd .read()).strip() 
        continue
      findret = textstr.find('CheckRootpassword:')
      if findret > -1 :
        textstr= textstr.replace('CheckRootpassword:','')
        #message = '"' + str(textstr) + '"'
        #send_message(message)
        command = "sudo /usr/bin/checkpassword.out root " + str(textstr) + " | grep 'password pass'"
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        findret = output .find('pass!')
        if findret > -1 :
          message = '"' + "ConfirmRootpassword:" + str(textstr) + '"'
          send_message(message)
        else:
          message = '"' + "Checkpasswordfail" + '"'
          send_message(message)
        continue
      findret = textstr.find('SetRootpassword:')
      if findret > -1 :
        textstr= textstr.replace('SetRootpassword:','')
        command = "echo root:" + str(textstr) + " > /tmp/rootpasswd"
        outputfd = os.popen(command)
        output = str(outputfd .read()).strip()
        outputfd = os.popen("sudo /usr/sbin/chpasswd.shadow < /tmp/rootpasswd")
        output = str(outputfd .read()).strip() 
        outputfd = os.popen("rm /home/user/userchange")
        output = str(outputfd .read()).strip() 
        outputfd = os.popen("sync")
        output = str(outputfd .read()).strip() 
        continue
      send_message(text)

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
