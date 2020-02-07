#!/bin/sh

xset s off
xset -dpms
xset s noblank
echo $*
su -c "chromium $* --kiosk --enable-gpu --gpu-no-context-lost --disable-infobars --disable-session-crashed-bubble --ignore-certificate-errors --ignore-gpu-blacklist --no-first-run --disable-java --disable-plugins " myuser &
# --disable-setuid-sandbox 
