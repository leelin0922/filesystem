#!/bin/sh

sudo chmod 777 -R /sys/class/gpio/*
#export gpios
if [ ! -d "/sys/class/gpio/gpio24" ]; then
echo 24 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio25" ]; then
echo 25 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio26" ]; then
echo 26 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio27" ]; then
echo 27 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio28" ]; then
echo 28 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio29" ]; then
echo 29 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio42" ]; then
echo 42 > /sys/class/gpio/export
fi
if [ ! -d "/sys/class/gpio/gpio43" ]; then
echo 43 > /sys/class/gpio/export
fi

sudo chmod 777 -R /sys/class/gpio/*
#gpios input
echo in > /sys/class/gpio/gpio28/direction
echo in > /sys/class/gpio/gpio29/direction
echo in > /sys/class/gpio/gpio42/direction
echo in > /sys/class//gpio/gpio43/direction
#gpios output
echo out > /sys/class/gpio/gpio24/direction
echo out > /sys/class/gpio/gpio25/direction
echo out > /sys/class/gpio/gpio26/direction
echo out > /sys/class/gpio/gpio27/direction
#gpios output high
echo 0 > /sys/class/gpio/gpio28/value
echo 0 > /sys/class/gpio/gpio29/value
echo 0 > /sys/class/gpio/gpio42/value
echo 0 > /sys/class/gpio/gpio43/value
echo 1 > /sys/class/gpio/gpio24/value
echo 1 > /sys/class/gpio/gpio25/value
echo 1 > /sys/class/gpio/gpio26/value
echo 1 > /sys/class/gpio/gpio27/value
#check gpios input
if [ $( cat /sys/class/gpio/gpio28/value) == '0' ]; then
echo error28-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio29/value) == '0' ]; then
echo error29-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio42/value) == '0' ]; then
echo error42-input high
exit
fi
if [ $( cat /sys/class/gpio/gpio43/value) == '0' ]; then
echo error43-input high
exit
fi
echo 0 > /sys/class/gpio/gpio24/value
echo 0 > /sys/class/gpio/gpio25/value
echo 0 > /sys/class/gpio/gpio26/value
echo 0 > /sys/class/gpio/gpio27/value
if [ $( cat /sys/class/gpio/gpio28/value) == '1' ]; then
echo error28-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio29/value) == '1' ]; then
echo error29-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio42/value) == '1' ]; then
echo error42-input low
exit
fi
if [ $( cat /sys/class/gpio/gpio43/value) == '1' ]; then
echo error43-input low
exit
fi
echo pass