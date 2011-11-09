#!/bin/bash

# if there is an argument use it as a reference to a
# particular connection string
SELECT=0 # by default
if [ -n "$1" ]; then
  SELECT=$1
fi

# example usage for local metasql proxy
# node main.js -u cole -H dev.xtuple.com -P cole -p 7000 -b 7000 -M "localhost/~cole" -m 80

EXECSTRINGS=(
  # execute the absolute defaults inlcuding the default metasql proxy server settings
  "node main.js -p 7000 -d dev -u cole -H dev.openmfg.com -P cole"

  # execute with the MetaSql proxy server set to the current user's home directory as the source
  "node main.js -u cole -H dev.openmfg.com -P cole -p 7000 -b 7000 -M \"localhost/~$USER\" -m 80"

  # execute the absolute defaults with the addition of the garbage collector info
  "node --trace-gc main.js -p 7000 -d dev -u cole -H dev.openmfg.com -P cole"
)

echo "Using startup command '${EXECSTRINGS[ $SELECT ]}'"
${EXECSTRINGS[ $SELECT ]}
