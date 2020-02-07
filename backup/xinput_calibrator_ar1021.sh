#!/bin/sh
# script to make the changes permanent (xinput is called with every Xorg start)
#
# can be used from Xsession.d
# script needs tee and sed (busybox variants are enough)
#
# original script: Martin Jansa <Martin.Jansa@gmail.com>, 2010-01-31
# updated by Tias Guns <tias@ulyssis.org>, 2010-02-15
# updated by Koen Kooi <koen@dominion.thruhere.net>, 2012-02-28

PATH="/usr/bin:$PATH"

echo "1">/sys/kernel/ar1021/commandMode
sync
echo "0x55 0x06 0x29 0x00 0x90 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x90 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
echo "0x55 0x06 0x29 0x00 0x92 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x92 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
echo "0x55 0x06 0x29 0x00 0x94 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x94 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
echo "0x55 0x06 0x29 0x00 0x96 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x96 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
echo "0x55 0x06 0x29 0x00 0x98 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x98 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
echo "0x55 0x06 0x29 0x00 0x9a 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
echo "0x55 0x06 0x29 0x00 0x9a 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
sync
#echo "0x55 0x06 0x29 0x00 0x9c 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
#sync
#echo "0x55 0x06 0x29 0x00 0x9c 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
#sync
#echo "0x55 0x06 0x29 0x00 0x9e 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
#sync
#echo "0x55 0x06 0x29 0x00 0x9e 0x02 0x00 0x00">/sys/kernel/ar1021/sendBuffer
#sync
echo "0">/sys/kernel/ar1021/commandMode
sync
sleep 1

BINARY="xinput_calibrator"
SYS_CALFILE="/etc/pointercal.xinput"
USER_CALFILE="$HOME/.pointercal/pointercal.xinput"

rm -rf $SYS_CALFILE

if [ "$USER" = "root" ]; then
  LOGFILE="/var/log/xinput_calibrator.pointercal.log"
  CALFILES="$SYS_CALFILE"
else
  LOGFILE="$HOME/.pointercal/xinput_calibrator.pointercal.log"
  CALFILES="$USER_CALFILE $SYS_CALFILE"
  mkdir -p "$HOME/.pointercal"
fi

for CALFILE in $CALFILES; do
  if [ -e $CALFILE ]; then
    if grep replace $CALFILE ; then
      echo "Empty calibration file found, removing it"
      rm $CALFILE 2>/dev/null || true
    else
      echo "Using calibration data stored in $CALFILE"
      . $CALFILE && exit 0
    fi
  fi
done

[ "$USER" != "root" ] && CALFILE=$USER_CALFILE

CALDATA=`$BINARY --output-type xinput -v | tee $LOGFILE | grep '    xinput set' | sed 's/^    //g; s/$/;/g'`
if [ ! -z "$CALDATA" ] ; then
  echo $CALDATA > $CALFILE
  echo "Calibration data stored in $CALFILE (log in $LOGFILE)"
fi

if [ -f "/etc/pointercal.xinput" ]; then
  cat /etc/pointercal.xinput > /etc/pointercal.xinput.pri
fi

sync
