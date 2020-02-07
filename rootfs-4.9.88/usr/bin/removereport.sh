#!/bin/sh

rm -rf /usr/share/applications/removereport.desktop
rm -rf /home/user/.config/chromium/Default/Bookmarks
rm -rf /home/user/.config/chromium/Default/History*
cp /usr/share/backupapp/PreferencesClean /home/user/.config/chromium/Default/Preferences
cp /usr/share/backupapp/PreferencesClean /usr/share/backupapp/Preferences
#cp /usr/share/backupapp/prefsclean.js /home/user/.mozilla/firefox/7meqrhdp.default/prefs.js
cp -rf /usr/share/backupapp/.mozilla /home/user/.
rm -rf /usr/bin/removereport.sh
sync
systemctl restart display-manager
