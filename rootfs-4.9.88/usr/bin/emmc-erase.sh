echo 0 > /sys/block/mmcblk3boot0/force_ro
sync
sleep 1
dd if=/dev/zero of=/dev/mmcblk3boot0 bs=512 seek=2
sync
sleep 1
echo 1 > /sys/block/mmcblk3boot0/force_ro
sync
sleep 1
reboot
sync
sleep 1

