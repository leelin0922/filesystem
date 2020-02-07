#!/bin/sh

export CHROME_DEVEL_SANDBOX=/usr/sbin/chrome-devel-sandbox
export LD_LIBRARY_PATH=/usr/lib/chromium

HROME_EXTRA_ARGS="         --use-gl=egl         --gpu-no-context-lost                   "
if [ "`whoami`" = "root" ] ; then
	CHROME_EXTRA_ARGS="${CHROME_EXTRA_ARGS} --user-data-dir=/home/root/.chromium/"
fi

/usr/bin/chromium/chrome ${CHROME_EXTRA_ARGS} localhost/on-off.php
