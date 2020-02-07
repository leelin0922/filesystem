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
  output = os.popen("connmanctl services | awk '{print $3}'")
  devicename = str(output.read()).rstrip()
  if devicename:
    command = "connmanctl services " + str(devicename) +" | grep 'IPv4 =' | grep Method=manual"
    output = os.popen(command)
    ethernettype = str(output.read()).rstrip()
    if ethernettype:
      send_message('"staticip"')
    else:
      send_message('"dhcp"')
    output = os.popen("/sbin/ifconfig 'eth0' | grep 'inet addr:' | awk '{print $2}' | awk -F ':' '{print $2}'")
    ipaddr = str(output.read()).rstrip()
    if ipaddr :
      sendtext='"'+ "ipaddr" +str(ipaddr )+'"'
      send_message(sendtext)
    output = os.popen("/sbin/ifconfig 'eth0' | grep 'inet ' | awk  '{print $4}' | awk -F ':' '{print $2}'")
    netmask = str(output.read()).rstrip()
    if netmask :
      sendtext='"'+ "netmask" +str(netmask)+'"'
      send_message(sendtext)
    output = os.popen("/sbin/route -n | grep UG | head -n  1 | awk '{print $2}'")
    gateway = str(output.read()).rstrip()
    if gateway:
      sendtext='"'+ "gateway" +str(gateway)+'"'
      send_message(sendtext)
    if devicename :
      command = "connmanctl services " + str(devicename) +" | grep 'Nameservers =' | awk '{print $4}'"
      output = os.popen(command)
      nameservers = str(output.read()).rstrip()
      #nameservers = nameservers.replace(']','')
      if nameservers :
        sendtext='"'+ "nameservers" +str(nameservers )+'"'
        send_message(sendtext)
      command = "connmanctl services " + str(devicename) +" | grep 'Proxy ='"
      output = os.popen(command)
      proxytext = str(output.read()).rstrip()
      findret = proxytext.find('direct')
      if findret > -1 :
        teststr='"' + "proxytypedirect" + '"'
        send_message(teststr)
      findret = proxytext.find('auto')
      if findret > -1 :
        teststr='"' + "proxytypeauto" + '"'
        send_message(teststr)
        strstart= proxytext.find('URL=')
        if strstart > -1 :
          strstart=strstart+4
          strend = proxytext.find(',',strstart)
          serverstr = proxytext[strstart:strend]
          teststr='"' + "proxyserver" + serverstr + '"'
          send_message(teststr)
      findret = proxytext.find('manual')
      if findret > -1 :
        teststr='"' + "proxytypemanual" + '"'
        send_message(teststr)
        strstart = proxytext.find('Servers=[ ')
        if findret > -1 :
          strstart= strstart + 10
          strend = proxytext.find(' ]',strstart)
          serverstr = proxytext[strstart:strend]
          teststr='"' + "proxyserver" + serverstr + '"'
          send_message(teststr)
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
    textstr =text.strip('"')
    if queue:
      queue.put(text)
    else:
      # In headless mode just send an echo message back.
      findret = textstr.find('ipaddr')
      if findret > -1 :
        ipaddr = textstr.strip('ipaddr')
        #teststr='"' + str(ipaddr) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('netmask')
      if findret > -1 :
        netmask= textstr.strip('netmask')
        #teststr='"' + str(netmask) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('gateway')
      if findret > -1 :
        gateway= textstr.strip('gateway')
        #teststr='"' + str(gateway) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('nameservers')
      if findret > -1 :
        nameservers= textstr.strip('nameservers')
        #teststr='"' + str(nameservers) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('dhcp')
      if findret > -1 :
        ethernettype= 'dhcp'
        continue
      findret = textstr.find('staticip')
      if findret > -1 :
        ethernettype= 'manual'
        continue
      findret = textstr.find('proxytype')
      if findret > -1 :
        proxytype= textstr.replace('proxytype','')
        #teststr='"' + str(proxytype) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('proxyserver')
      if findret > -1 :
        proxyserver= textstr.replace('proxyserver','')
        #teststr='"' + str(proxyserver) + '"'
        #send_message(teststr)
        continue
      findret = textstr.find('exec-proxy')
      if findret > -1 :
        if proxytype == 'direct':
          command = "connmanctl config " + str(devicename) +" proxy direct "
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          command = "echo \"\" > /etc/proxyserver"
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          output = os.popen("sync")
          proxyret =str(output.read()).rstrip()
        if proxytype == 'auto':
          command = "connmanctl config " + str(devicename) +" proxy auto " + str(proxyserver)
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          command = "echo " + str(proxyserver) + " > /etc/proxyserver"
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          output = os.popen("sync")
          proxyret =str(output.read()).rstrip()
        if proxytype == 'manual':
          command = "connmanctl config " + str(devicename) +" proxy manual " + str(proxyserver)
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          command = "echo " + str(proxyserver) + " > /etc/proxyserver"
          output = os.popen(command)
          proxyret =str(output.read()).rstrip()
          output = os.popen("sync")
          proxyret =str(output.read()).rstrip()
        continue
      findret = textstr.find('exec-command')
      if findret > -1 :
        if ethernettype== 'manual':
          command = "connmanctl config " + str(devicename) +" ipv4 manual "+ str(ipaddr) +" "+str(netmask) +" "+str(gateway)
          output = os.popen(command)
          ethernetret = str(output.read()).rstrip()
          command = "connmanctl config " + str(devicename) +" nameservers "+ str(nameservers)
          output = os.popen(command)
          ethernetret = str(output.read()).rstrip()
        else:
          command = "connmanctl config " + str(devicename) +" ipv4 dhcp"
          output = os.popen(command)
          ethernetret = str(output.read()).rstrip()
          command = "connmanctl config " + str(devicename) +" nameservers "+ str(nameservers)
          output = os.popen(command)
          ethernetret = str(output.read()).rstrip()
        output = os.popen("sync")
        devicename = output.read()
        time.sleep(3)
        output = os.popen("connmanctl services | awk '{print $3}'")
        devicename = str(output.read()).rstrip()
        if devicename:
          command = "connmanctl services " + str(devicename) +" | grep 'IPv4 =' | grep Method=manual"
          output = os.popen(command)
          ethernettype = str(output.read()).rstrip()
          if ethernettype:
            send_message('"staticip"')
          else:
            send_message('"dhcp"')
          output = os.popen("/sbin/ifconfig 'eth0' | grep 'inet addr:' | awk '{print $2}' | awk -F ':' '{print $2}'")
          ipaddr = str(output.read()).rstrip()
          if ipaddr :
            sendtext='"'+ "ipaddr" +str(ipaddr )+'"'
            send_message(sendtext)
          output = os.popen("/sbin/ifconfig 'eth0' | grep 'inet ' | awk  '{print $4}' | awk -F ':' '{print $2}'")
          netmask = str(output.read()).rstrip()
          if netmask :
            sendtext='"'+ "netmask" +str(netmask)+'"'
            send_message(sendtext)
          output = os.popen("/sbin/route -n | grep UG | head -n  1 | awk '{print $2}'")
          gateway = str(output.read()).rstrip()
          if gateway:
            sendtext='"'+ "gateway" +str(gateway)+'"'
            send_message(sendtext)
          if devicename :
            command = "connmanctl services " + str(devicename) +" | grep 'Nameservers =' | awk '{print $4}'"
            output = os.popen(command)
            nameservers = str(output.read()).rstrip()
            #nameservers = nameservers.replace(']','')
            if nameservers :
              sendtext='"'+ "nameservers" +str(nameservers )+'"'
              send_message(sendtext)
 

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
