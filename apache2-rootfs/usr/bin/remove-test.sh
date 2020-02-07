#!/bin/sh

rm /usr/share/applications/ALS*
rm /usr/share/applications/apa*
rm /usr/share/applications/bright*
rm /usr/share/applications/cpu*
rm /usr/share/applications/hardware*
rm /usr/share/applications/network*
rm /usr/share/applications/on-off*
rm /usr/share/applications/test*

rm /etc/xdg/autostart/apache-start.desktop
rm /etc/xdg/autostart/on-off.desktop
echo "-1" > /etc/onoff-counter
sync
reboot
