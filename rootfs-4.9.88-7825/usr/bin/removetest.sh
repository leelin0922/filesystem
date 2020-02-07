#!/bin/sh

rm -rf /home/user/testprocess
rm -rf /usr/share/applications/removetest.desktop
rm -rf /home/user/.config/chromium/Default/Bookmarks
rm -rf /home/user/.config/chromium/Default/History*
cp /usr/share/backupapp/Preferences /home/user/.config/chromium/Default/Preferences
sync
