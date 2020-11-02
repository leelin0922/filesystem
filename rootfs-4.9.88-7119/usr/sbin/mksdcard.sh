#!/bin/sh

# partition size in MB
BOOT_ROM_SIZE=10

node=/dev/mmcblk$1
# wait for the SD/MMC device node ready
while [ ! -e $node ]
do
sleep 1
echo “wait for $node appear
done

# call sfdisk to create partition table
# destroy the partition table
sudo dd if=/dev/zero of=${node} bs=1024 count=1

sudo sfdisk --force ${node} << EOF
${BOOT_ROM_SIZE}M,500M,0c
600M,,83
EOF
sync
sleep 1
