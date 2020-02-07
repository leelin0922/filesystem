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
  brightnesscur = 0
  brightnessmax = 0
  ALSstatus = 0
  output = os.popen('/usr/sbin/i2cget -y 2 0x66 1')
  outputstr = str(output.read()).strip('\n').replace('x','')
  ALSstatus = int(outputstr)
  if ALSstatus:
    send_message( '"ALSON"' )
  else:
    send_message( '"ALSOFF"' )
  output = os.popen('cat /sys/class/backlight/pwm-backlight.0/brightness')
  brightnesscur = int (output.read())
  output = os.popen('cat /sys/class/backlight/pwm-backlight.0/max_brightness')
  brightnessmax = int (output.read())
  brightnesstmp = float(brightnesscur)*100 /brightnessmax
  test = '"' + str(int(round(brightnesstmp) ))+ '"'
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
    text = sys.stdin.read(text_length);
    textstr=text.strip('"')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      #send_message(test)
      findret = textstr.find('ALSON')
      if findret > -1 :
        brightnesscmd = "/usr/sbin/i2cset -y 2 0x66 1 1"
        os.system(brightnesscmd )
        continue
      findret = textstr.find('ALSOFF')
      if findret > -1 :
        brightnesscmd = "/usr/sbin/i2cset -y 2 0x66 1 0"
        os.system(brightnesscmd )
        continue
      brightnesscur =int(round(float(textstr) * brightnessmax /100))
      brightnesscmd = "echo " + str(brightnesscur ) + " > /etc/brightness"
      os.system(brightnesscmd )
      brightnesscmd = "echo " + str(brightnesscur ) + " >/sys/class/backlight/pwm-backlight.0/brightness"
      os.system(brightnesscmd )
      brightnesstmp = float(brightnesscur)*100 /brightnessmax
      test = '"' + str(int(round(brightnesstmp) ))+ '"'
      send_message( test )

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
