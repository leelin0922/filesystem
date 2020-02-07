#!/bin/sh

umount /dev/mmcblk$1p1
while [ ! -e /dev/mmcblk$1p1 ]
do
sleep 1
echo "wait for /dev/mmcblk$1p1 appear"
done
mkfs.vfat -v -F 32 /dev/mmcblk$1p1
sync
mkdir /tmp/bsp
mount /dev/mmcblk$1p1 /tmp/bsp
cp /boot/zImage /tmp/bsp/zImage
cp /boot/imx6ul-14x14-evk.dtb /tmp/bsp/imx6ul-14x14-evk.dtb
sync
umount /tmp/bsp
sync
sleep 1
rm -rf /tmp/bsp
