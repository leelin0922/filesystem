#!/bin/sh

xset s off
xset -dpms
xset s noblank
echo $*
su -c "chromium $*" myuser &

