#!/bin/sh

cp -f /usr/share/backupapp/PreferencesClear /home/user/.config/chromium/Default/Preferences
sudo chown user:user /home/user/.config/chromium/Default/Preferences
rm -rf /home/user/testprocess
rm -rf /usr/share/applications/removetest.desktop
rm -rf /home/user/.config/chromium/Default/Bookmarks
rm -rf /home/user/.config/chromium/Default/History*
sync
systemctl restart display-manager
