#!/bin/bash

if [ -f "/home/lee/imx-yocto-bsp/build-x11/tmp/deploy/images/imx6ulevk/fsl-image-validation-imx-imx6ulevk.tar.bz2" ]; then
	echo "filesystem copy to rootfs-org.tar.bz2"
	cp /home/lee/imx-yocto-bsp/build-x11/tmp/deploy/images/imx6ulevk/fsl-image-validation-imx-imx6ulevk.tar.bz2 rootfs-org.tar.bz2
else
	echo "yocto file fsl-image-validation-imx-imx6ulevk.tar.bz2 not exist"
	exit
fi
echo "rm -rf rootfs"
rm -rf rootfs
find -iname "*.bak" -exec rm -rf {} \;
find -iname "*~" -exec rm -rf {} \;
sync
mkdir rootfs
echo "tar -xf rootfs-org.tar.bz2 --totals --checkpoint=.8192 -C rootfs"
tar -xf rootfs-org.tar.bz2 --totals --checkpoint=.8192 -C rootfs

echo "delete unused data"cp rootfs.tar.bz2 /mnt/hgfs/dshare/7112/IMX6_L4.1.15_2.0.0_MFG-TOOL/Profiles/Linux/OS\ Firmware/files/rootfs.tar.bz2 
rm -rf rootfs/opt
rm -rf rootfs/unit_tests
rm -rf rootfs/usr/src/debug
rm -rf rootfs/etc/xdg/autostart/at-spi-dbus-bus.desktop
rm -rf rootfs/etc/xdg/autostart/pulseaudio.desktop

rm -rf rootfs/usr/share/applications/bridges.desktop
rm -rf rootfs/usr/share/applications/fifteen.desktop
rm -rf rootfs/usr/share/applications/inertia.desktop
rm -rf rootfs/usr/share/applications/map.desktop
rm -rf rootfs/usr/share/applications/samegame.desktop
rm -rf rootfs/usr/share/applications/slant.desktop
rm -rf rootfs/usr/share/applications/org.gnome.Sysprof2.desktop
rm -rf rootfs/usr/share/applications/pcmanfm.desktop

rm -rf rootfs/usr/share/applications/xinput_calibrator.desktop
rm -rf rootfs/usr/share/applications/gst-player.desktop
rm -rf rootfs/usr/share/applications/l3afpad.desktop
rm -rf rootfs/usr/share/applications/shutdown.desktop
rm -rf rootfs/usr/share/applications/mb-appearance.desktop
rm -rf rootfs/usr/share/applications/libfm-pref-apps.desktop
#remove debug console(ttymxc0
rm -rf rootfs/lib/systemd/system/serial-getty@.service
rm -rf rootfs/etc/systemd/system/getty.target.wants/serial-getty@ttymxc0.service

rm -rf rootfs/lib/systemd/system/proc-fs-nfsd.mount
rm -rf rootfs/lib/systemd/system/sysinit.target.wants/proc-fs-nfsd.mount
rm -rf rootfs/lib/systemd/system/wpa_supplicant*
rm -rf rootfs/lib/systemd/system/bluetooth*
rm -rf rootfs/lib/systemd/system/alsa*
rm -rf rootfs/lib/systemd/system/nfs*
rm -rf rootfs/lib/systemd/system/basic.target.wants/alsa*
#rm -rf rootfs/lib/systemd/system/connman-env.service
#rm -rf rootfs/etc/systemd/system/connman.service.wants/connman-env.service

rm -rf rootfs/etc/modules-load.d/nfsd.conf
rm -rf rootfs/etc/systemd/system/multi-user.target.wants/nfs*

find -iname "CNNIC*" -exec rm -rf {} \;
find -iname "CHINA*" -exec rm -rf {} \;

#rm -rf rootfs/etc/modules-load.d/galcore.conf

#find -iname "test" -exec rm -rf {} \;

#cp -rf apache2-rootfs/* rootfs/.
echo "cp -rf rootfs-4.9.88/* rootfs/."
cp -rf rootfs-4.9.88/* rootfs/.
#rm -rf rootfs/usr/share/apache2/htdocs
#cp -arf htdocs rootfs/usr/share/apache2/.
#echo "chown -R root:root rootfs"
#chown -R root:root rootfs
#echo "chown -R user:user rootfs/home/user"
#chown -R user:user rootfs/home/user
#chmod -R 666 rootfs/etc/xdg
chown -R root:root rootfs/var/spool/cron/
chown root:root rootfs/usr/bin/crontab
chown root:root rootfs/usr/libexec/dbus-daemon-launch-helper

cd rootfs
echo "tar -jcf ../rootfs.tar.bz2 --totals --checkpoint=.8192 *"
tar -jcf ../rootfs.tar.bz2 --totals --checkpoint=.8192 *
cd ..

echo "filesystem copy to rootfs.tar.bz2"

cp rootfs.tar.bz2 /mnt/hgfs/dshare/7112/i.mx6ul/mfgtools_for_6UL_20180806/mfgtools_for_6UL/Profiles/Linux/OS\ Firmware/files/linux/rootfs.tar.bz2

sync
sleep 1
date
