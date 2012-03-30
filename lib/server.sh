#!/bin/bash

# clean up previous modules if they still exist
if [ -d "lib/node_modules" ]; then
  echo -ne "Cleaning up old dependency tree before adding new one"
  `rm -fr lib/node_modules`
  echo -ne "...done\\n"
fi 

# will only install them if they need to be installed or
# updated
cd lib/xt; npm install --force; cd ../..; node ./lib/main.js $@

exit 0
