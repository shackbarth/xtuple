#!/bin/bash

# example...
# sed -E "s/SC.(TableColumn|TableView)/EO.\1/g" $x > tmpfile

# expect 2 args, first is the one to find, second to replace
if [ $# -lt 2 ]
  then
    echo "You must pass 2 arguments. The first to 'find' and the second to 'replace'"
    exit
fi

# assign the values for clarity
FIND=$1
REPLACE=$2
DEBUG=$3

echo "Searching for '$FIND' and will replace with '$REPLACE'"

echo "Starting to search and replace..."
for x in `find ./* -name '*.js'`
  do
    sed -E "s/$FIND/$REPLACE/g" $x > tmpfile
    if [ "$DEBUG" ]
      then
        cat tmpfile
      else
        cat tmpfile > $x
    fi
  done
rm tmpfile
echo "done"