#!/bin/bash

cp /home/lee/fsl-release-bsp/build-x11/tmp/deploy/images/imx6dlsabresd/fsl-image-validation-imx-imx6dlsabresd.tar.bz2 rootfs-org.tar.bz2

rm -rf rootfs
sync
mkdir rootfs
tar -xvf rootfs-org.tar.bz2 -C rootfs

rm -rf rootfs/etc/xdg/autostart/at-spi-dbus-bus.desktop
rm -rf rootfs/etc/xdg/autostart/pulseaudio.desktop

rm -rf rootfs/usr/share/applications/bridges.desktop
rm -rf rootfs/usr/share/applications/fifteen.desktop
rm -rf rootfs/usr/share/applications/inertia.desktop
rm -rf rootfs/usr/share/applications/map.desktop
rm -rf rootfs/usr/share/applications/samegame.desktop
rm -rf rootfs/usr/share/applications/slant.desktop

rm -rf rootfs/usr/share/applications/xinput_calibrator.desktop
rm -rf rootfs/usr/share/applications/gst-player.desktop

rm -rf rootfs/lib/systemd/system/proc-fs-nfsd.mount
rm -rf rootfs/lib/systemd/system/sysinit.target.wants/proc-fs-nfsd.mount
rm -rf rootfs/lib/systemd/system/wpa_supplicant*
rm -rf rootfs/lib/systemd/system/bluetooth*
rm -rf rootfs/lib/systemd/system/alsa*
rm -rf rootfs/lib/systemd/system/basic.target.wants/alsa*
#rm -rf rootfs/lib/systemd/system/connman-env.service
#rm -rf rootfs/etc/systemd/system/connman.service.wants/connman-env.service

rm -rf rootfs/etc/modules-load.d/nfsd.conf
rm -rf rootfs/etc/modules-load.d/galcore.conf

cp -arf chromium/* rootfs/.
cp -arf apache2-rootfs/* rootfs/.
rm -rf rootfs/usr/share/apache2/htdocs
cp -arf htdocs rootfs/usr/share/apache2/.

cd rootfs
tar -jcvf ../rootfs.tar.bz2 *
cd ..

cp rootfs.tar.bz2 /mnt/hgfs/share/7112/IMX6_L4.1.15_2.0.0_MFG-TOOL/Profiles/Linux/OS\ Firmware/files/rootfs.tar.bz2 

sync
sleep 1
date
