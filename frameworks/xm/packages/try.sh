#!/bin/bash

for path in $@
  do
    sed -E "s/lazy/demand/g" $path > tmpfile
    cat tmpfile > $path 
  done

rm tmpfile
echo "done"
