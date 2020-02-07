#!/bin/sh

umount /dev/mmcblk$1p2
while [ ! -e /dev/mmcblk$1p2 ]
do
sleep 1
echo "wait for /dev/mmcblk$1p2 appear"
done
mkfs.ext4 -v -F /dev/mmcblk$1p2
sync
sleep 1
mkdir /tmp/filesystem
mount /dev/mmcblk$1p2 /tmp/filesystem
#tar -xf /boot/rootfs.tar.bz2 --totals --checkpoint=.4096 -C /tmp/filesystem
tar -jxf /boot/rootfs.tar.bz2 -C /tmp/filesystem
sync
sleep 1
umount /tmp/filesystem
sync
rm -rf /tmp/filesystem
