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
#import multiprocessing

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
      findret = textstr.find('CPU')
      if findret > -1 :
        command= textstr.strip('CPU')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "CPU" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Memery')
      if findret > -1 :
        command= textstr.strip('Memery')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Memery" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('eMMCtotal')
      if findret > -1 :
        command= textstr.strip('eMMCtotal')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "eMMCtotal" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('eMMCavailable')
      if findret > -1 :
        command= textstr.strip('eMMCavailable')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "eMMCavailable" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('OStype')
      if findret > -1 :
        command= textstr.strip('OStype')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "OStype" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Version')
      if findret > -1 :
        command= textstr.strip('Version')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Version" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('MAC1')
      if findret > -1 :
        command= textstr.strip('MAC1')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        teststr='"' + "MAC1" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Thermal')
      if findret > -1 :
        command= textstr.strip('Thermal')
        outputfd = os.popen(command.strip(' '))
        output = str(outputfd.read()).rstrip()
        temperature = float(output)/1000
        teststr='"' + "Thermal" + str(round(temperature,1 )) + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Date')
      if findret > -1 :
        command= textstr.strip('Date')
        #outputfd = os.popen("date +%Y-%m-%d")
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Date" + output  + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Time')
      if findret > -1 :
        command= textstr.strip('Time')
        #outputfd = os.popen("date +%H:%M")
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Time" + output  + '"'
        send_message(teststr)
        continue
      findret = textstr.find('devicename')
      if findret > -1 :
        command= textstr.strip('devicename')
        #outputfd = os.popen("connmanctl services | awk '{print $3}'")
        outputfd = os.popen(command)
        output = str(outputfd.read())
        devicename = output.rstrip()
        teststr='"' + "devicename" + devicename  + '"'
        #teststr='"' + "devicename" + command.rstrip()  + '"'
        send_message(teststr)
        continue
      findret = textstr.find('inettype')
      if findret > -1 :
        command = "connmanctl services " + str(devicename) +" | grep Method=manual"
        outputfd = os.popen(command)
        inettype= str(outputfd .read()).rstrip()
        if inettype:
          send_message('"inettype manual"')
        else:
          send_message('"inettype dhcp"')
        continue
      findret = textstr.find('DNS')
      if findret > -1 :
        command = "connmanctl services " + str(devicename) +" | grep 'Nameservers =' | awk '{print $4}'"
        outputfd = os.popen(command)
        DNS= str(outputfd .read()).rstrip()
        teststr='"' + "DNS" + DNS + '"'
        send_message(teststr)
        continue
      findret = textstr.find('ipaddr')
      if findret > -1 :
        command= textstr.strip('ipaddr')
        outputfd = os.popen(command)
        output = str(outputfd.read())
        ipaddr= output.rstrip()
        teststr='"' + "ipaddr" + ipaddr + '"'
        send_message(teststr)
        continue
      findret = textstr.find('netmask')
      if findret > -1 :
        command= textstr.strip('netmask')
        outputfd = os.popen(command)
        output = str(outputfd.read())
        netmask= output.rstrip()
        teststr='"' + "netmask" + netmask+ '"'
        send_message(teststr)
        continue
      findret = textstr.find('gateway')
      if findret > -1 :
        command= textstr.strip('gateway')
        outputfd = os.popen(command)
        gateway= str(outputfd.read()).rstrip()
        teststr='"' + "gateway" + gateway  + '"'
        send_message(teststr)
        continue
      findret = textstr.find('ethernet0')
      if findret > -1 :
        command= textstr.strip('ethernet0')
        if gateway :
          command = "ping -c 1 -W 1 " + str(gateway) + ' 2>&1 | grep ", 0% packet loss"'
        outputfd = os.popen(command)
        output = str(outputfd.read())
        netmask= output.rstrip()
        teststr='"' + "ethernet0" + netmask + '"'
        send_message(teststr)
        continue
      findret = textstr.find('I2C3')
      if findret > -1 :
        command= textstr.strip('I2C3')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "I2C3" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Keyboard')
      if findret > -1 :
        command= textstr.strip('Keyboard')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Keyboard" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Mouse')
      if findret > -1 :
        command= textstr.strip('Mouse')
        #command = "grep -i mouse /proc/bus/input/devices | grep N:"
        outputfd = os.popen(command)
        output = str(outputfd.read())
        output = output.rstrip()
        output = output.replace('"','')
        teststr='"' + "Mouse" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('USBDISK')
      if findret > -1 :
        command= textstr.strip('USBDISK')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "USBDISK" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('EEPROM')
      if findret > -1 :
        command= textstr.strip('EEPROM')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "EEPROM" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('SDCard')
      if findret > -1 :
        command= textstr.strip('SDCard')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "SDCard" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('ttymxc2')
      if findret > -1 :
        command= textstr.strip('ttymxc2')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "ttymxc2" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('PMU')
      if findret > -1 :
        command= textstr.strip('PMU')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "PMU" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Touch')
      if findret > -1 :
        command= textstr.strip('Touch')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        output = output.replace('"','')
        teststr='"' + "Touch" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Screen')
      if findret > -1 :
        command= textstr.strip('Screen')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Screen" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('Buzzer')
      if findret > -1 :
        command= textstr.strip('Buzzer')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        teststr='"' + "Buzzer" + output + '"'
        send_message(teststr)
        continue
      findret = textstr.find('OTG')
      if findret > -1 :
        output = output.replace('\n','')
        command= textstr.strip('OTG')
        outputfd = os.popen(command)
        output = str(outputfd.read()).rstrip()
        output = output.replace('\n','')
        if len(output) < 6 :
          teststr='"' + "OTG" + "error" + '"'
          continue
        teststr='"' + "OTG" + output + '"'
        send_message(teststr)
        continue

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
