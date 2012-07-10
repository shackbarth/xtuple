#!/bin/bash
user=`whoami`
forever=`which forever`
if [ -z "$forever" ]; then
  if [ "$user" == "root" ]; then
    npm install forever -g
  else
    sudo npm install forever -g
  fi
fi
npm install
forever stopall
forever start -a -l forever.log -o datasource.log -e datasource-err.log main.js $@
exit 0