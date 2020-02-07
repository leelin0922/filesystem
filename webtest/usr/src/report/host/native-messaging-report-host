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
import ftplib

# Helper function that sends a message to the webapp.
def send_message(message):
   # Write message size.
  message= message.replace('"','')
  message= message.replace("'",'')
  message= message.replace('\n','')
  message='"' + message + '"'
  sys.stdout.write(struct.pack('I', len(message)))
  # Write the message itself.
  sys.stdout.write(message)
  sys.stdout.flush()

# Thread that reads messages from the webapp.
def read_thread_func(queue):
  message_number = 0
  filename = ""
  rfilename = ""
  FTPServer=""
  Username=""
  Password=""
  outputfd = os.popen("/sbin/ifconfig 'eth0' | grep 'inet addr:' | awk '{print $2}' | awk -F ':' '{print $2}'")
  rfilename = str(outputfd.read()).rstrip()
  if rfilename :
    #rfilename =rfilename.replace('.','')
    filename = "/tmp/" + rfilename + ".txt"
    send_message(filename)
  outputfd = os.popen('chromium --version')
  output = str(outputfd.read()).rstrip()
  teststr= "Chromiumversion:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">" + filename 
    os.system(commandstr)
  outputfd = os.popen('firefox --version')
  output = str(outputfd.read()).rstrip()
  teststr= "Firefoxversion:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen('uname -p -n')
  output = str(outputfd.read()).rstrip()
  teststr= "cputype:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen('uname -s -r')
  output = str(outputfd.read()).rstrip()
  teststr= "Firmwareversion:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen("grep MemTotal /proc/meminfo | awk -F ':' '{print $2}' | awk -F ' ' '{print $1}'")
  output = str(outputfd.read()).rstrip()
  teststr= "systemram:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen("lsblk | grep 'mmcblk3 ' | awk '{print $4}'")
  output = str(outputfd.read()).rstrip()
  teststr= "Storagesize:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen("xinput_calibrator --list | awk -F '\"' '{print $2}'")
  output = str(outputfd.read()).rstrip()
  teststr= "Touchcapability:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr +"'" + ">>" + filename 
    os.system(commandstr)
  outputfd = os.popen("xdpyinfo | grep dimensions")
  output = str(outputfd.read()).rstrip()
  output =output .strip(' ')
  teststr= "Resolution:" + output 
  send_message(teststr)
  if filename :  
    commandstr="echo " +"'" + teststr + "'" + ">>" + filename 
    os.system(commandstr)
    os.system("sync")
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
    findret = textstr.find('Username:')
    if findret > -1 :
      Username=textstr.replace('Username:','')
      #send_message(Username)
      continue
    findret = textstr.find('Password:')
    if findret > -1 :
      Password=textstr.replace('Password:','')
      #send_message(Password)
      continue
    findret = textstr.find('FTPServer:')
    if findret > -1 :
      FTPServer=textstr.replace('FTPServer:','')
      #send_message(FTPServer)
      continue
    findret = textstr.find('Sendtoftp')
    if findret > -1 :
      if rfilename =="" or len(rfilename)<4 :
        send_message("filename error")
        continue
      if FTPServer=="" or len(FTPServer)<7 :
        send_message("FTPServer error")
        continue
      if Password=="" or len(Password)<4 :
        send_message("Password error")
        continue
      if Username=="" or len(Username)<4 :
        send_message("Username error")
        continue
      try :
        session = ftplib.FTP(FTPServer,Username,Password)
      except:
        send_message("FTPServer or Username or  Password error")
        continue
      if session :
        file = open(filename,'rb')
        outputstr=session.storbinary('STOR '+ rfilename + '.txt', file)
        file.close()
        session.quit()
        send_message(outputstr)
        continue
    send_message(text)

def Main():
    read_thread_func(None)
    sys.exit(0)

if __name__ == '__main__':
  Main()
