#!/bin/sh

dd if=/dev/zero of=/dev/mmcblk$1 bs=1k seek=768 conv=fsync count=136
#dd if=/dev/zero of=/dev/mmcblk$1 bs=1k seek=384 conv=fsync count=129
echo 0 > /sys/block/mmcblk$1boot0/force_ro
dd if=/boot/u-boot.imx of=/dev/mmcblk$1boot0 bs=512 seek=2
echo 1 > /sys/block/mmcblk$1boot0/force_ro
mmc bootpart enable 1 1 /dev/mmcblk$1
