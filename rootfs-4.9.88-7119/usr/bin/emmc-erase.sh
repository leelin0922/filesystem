sudo chmod 666 /sys/block/mmcblk$1boot0/force_ro
sudo echo 0 > /sys/block/mmcblk1boot0/force_ro
sync
sleep 1
sudo dd if=/dev/zero of=/dev/mmcblk1boot0 bs=512 seek=2
sync
sleep 1
sudo echo 1 > /sys/block/mmcblk1boot0/force_ro
sync
sleep 1
reboot
sync
sleep 1

