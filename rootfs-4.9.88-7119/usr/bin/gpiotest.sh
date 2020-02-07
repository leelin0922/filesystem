#!/bin/sh

sudo chmod 777 -R /sys/class/gpio/*
#export gpios
if [ ! -d "/sys/class/gpio/gpio1" ]; then
echo 1 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio2" ]; then
echo 2 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio3" ]; then
echo 3 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio4" ]; then
echo 4 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio5" ]; then
echo 5 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio9" ]; then
echo 9 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio131" ]; then
echo 131 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio132" ]; then
echo 132 > /sys/class/gpio/export
fi
sudo chmod 777 -R /sys/class/gpio/*
#gpios input
echo in > /sys/class/gpio/gpio5/direction
echo in > /sys/class/gpio/gpio9/direction
echo in > /sys/class/gpio/gpio131/direction
echo in > /sys/class//gpio/gpio132/direction
#gpios output
echo out > /sys/class/gpio/gpio1/direction
echo out > /sys/class/gpio/gpio2/direction
echo out > /sys/class/gpio/gpio3/direction
echo out > /sys/class/gpio/gpio4/direction
#gpios output high
echo 1 > /sys/class/gpio/gpio1/value
echo 1 > /sys/class/gpio/gpio2/value
echo 1 > /sys/class/gpio/gpio3/value
echo 1 > /sys/class/gpio/gpio4/value
#check gpios input
if [ $( cat /sys/class/gpio/gpio5/value) == '0' ]; then
echo error5-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio9/value) == '0' ]; then
echo error9-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio131/value) == '0' ]; then
echo error131-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio132/value) == '0' ]; then
echo error132-input high
exit
fi
echo 0 > /sys/class/gpio/gpio1/value
echo 0 > /sys/class/gpio/gpio2/value
echo 0 > /sys/class/gpio/gpio3/value
echo 0 > /sys/class/gpio/gpio4/value
if [ $( cat /sys/class/gpio/gpio5/value) == '1' ]; then
echo error5-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio9/value) == '1' ]; then
echo error9-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio131/value) == '1' ]; then
echo error131-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio132/value) == '1' ]; then
echo error132-input low
exit
fi
echo pass