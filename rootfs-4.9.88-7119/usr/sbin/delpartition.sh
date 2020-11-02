#!/bin/sh

node=/dev/mmcblk$1
sudo dd if=/dev/zero of=/dev/mmcblk$1 bs=1k seek=768 conv=fsync count=136
echo "########### make sd partition ############"
sudo umount ${node}p1
sudo umount ${node}p2
sudo umount ${node}
sudo fdisk ${node} << EOF
p
d
4
d
3
d
2
d

w
q
EOF
sync
sleep 1

