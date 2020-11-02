#!/bin/sh

sudo chmod 666 /sys/block/mmcblk$1boot0/force_ro
sudo dd if=/dev/zero of=/dev/mmcblk$1 bs=1k seek=768 conv=fsync count=136
sudo echo 0 > /sys/block/mmcblk$1boot0/force_ro
sudo dd if=/boot/u-boot.imx of=/dev/mmcblk$1boot0 bs=512 seek=2
sudo echo 1 > /sys/block/mmcblk$1boot0/force_ro
sudo mmc bootpart enable 1 1 /dev/mmcblk$1

#sudo dd if=/boot/u-boot.imx of=/dev/mmcblk$1 bs=1k seek=1 conv=fsync
