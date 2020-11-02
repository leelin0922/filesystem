#!/bin/sh

sudo umount /dev/mmcblk$1p2
sudo rm -rf /tmp/filesystem
while [ ! -e /dev/mmcblk$1p2 ]
do
sleep 1
echo "wait for /dev/mmcblk$1p2 appear"
done
sudo mkfs.ext4 -v -F /dev/mmcblk$1p2
sync
sleep 1
sudo mkdir /tmp/filesystem
sudo mount /dev/mmcblk$1p2 /tmp/filesystem
#tar -xf /boot/rootfs.tar.bz2 --totals --checkpoint=.4096 -C /tmp/filesystem
sudo tar -jxf /boot/rootfs.tar.bz2 -C /tmp/filesystem
sync
sleep 1
sudo umount /tmp/filesystem
sync
sudo rm -rf /tmp/filesystem
