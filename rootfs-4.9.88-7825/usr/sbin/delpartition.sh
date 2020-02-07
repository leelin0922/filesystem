#!/bin/sh

node=/dev/mmcblk$1
########### make sd partition ############
umount ${node}p1
umount ${node}p2
umount ${node}
fdisk ${node} << EOF
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
