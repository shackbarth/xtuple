#!/bin/bash

cd lib/xt 
npm install 
cd ../.. 
node ./lib/main.js $@

exit 0
