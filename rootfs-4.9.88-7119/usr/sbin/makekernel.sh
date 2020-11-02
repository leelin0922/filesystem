#!/bin/sh

sudo umount /dev/mmcblk$1p1
while [ ! -e /dev/mmcblk$1p1 ]
do
sleep 1
echo "wait for /dev/mmcblk$1p1 appear"
done
sudo mkfs.vfat -v -F 32 /dev/mmcblk$1p1
sync
sudo mkdir /tmp/bsp
sudo mount /dev/mmcblk$1p1 /tmp/bsp
sudo cp /boot/zImage /tmp/bsp/zImage
sudo cp /boot/imx6ul-14x14-evk.dtb /tmp/bsp/imx6ul-14x14-evk.dtb
sudo cp /boot/imx6ul-14x14-evk_emmc.dtb /tmp/bsp/imx6ul-14x14-evk_emmc.dtb
sync
sudo umount /tmp/bsp
sync
sleep 1
sudo rm -rf /tmp/bsp
