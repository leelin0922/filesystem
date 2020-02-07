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
  num_cpu = multiprocessing.cpu_count()
  message_number = 0
  temperature = 0
  outputstatus = 0
  output = os.popen('ps aux | grep thread | grep out')
  outputstatus = str(output.read()).find('threadtest')
  if outputstatus>=0:
    send_message( '"START"' )
  else:
    send_message( '"STOP"' )
  pprevidle =0
  while 1:
    output = os.popen('cat /sys/class/thermal/thermal_zone0/temp')
    temperature = float (output.read())/1000
    test = '"' + "temperature" + str(round(temperature,1 ))+ '"'
    send_message( test )
    stat_fd = open('/proc/stat')
    stat_buf = stat_fd.readlines()[0].split()
    preuser = float(stat_buf[1])
    prenice = float(stat_buf[2])
    presys = float(stat_buf[3])
    preidle = float(stat_buf[4])
    preiowait=  float(stat_buf[5])
    preirq=  float(stat_buf[6])
    presirq =  float(stat_buf[7])
    prevtotal = preuser + prenice + presys +preidle + preiowait + preirq + presirq 
    pprevidle = preidle 
    stat_fd.close()
    time.sleep(1)
    stat_fd = open('/proc/stat')
    stat_buf = stat_fd.readlines()[0].split()
    reuser = float(stat_buf[1])
    renice = float(stat_buf[2])
    resys = float(stat_buf[3])
    reidle = float(stat_buf[4])
    reiowait=  float(stat_buf[5])
    reirq=  float(stat_buf[6])
    resirq =  float(stat_buf[7])
    revtotal = reuser + renice + resys +reidle + reiowait + reirq + resirq 
    stat_fd.close()
    diff_idle = reidle - preidle 
    diff_total = revtotal - prevtotal 
    cpu_usage= float( 100.0 * ( (diff_total - diff_idle)) / diff_total) 
    #cpu_usage=((reuser - preuser) * 100 / jiffy) / num_cpu
    test = '"' + "cpu_usage" + str(round( cpu_usage,1))+ '"'
    send_message( test )
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
