#!/bin/bash
# Build extensions

# This could be more scalably done with node

rm -rf builds
mkdir builds

cp source/project/client/root-package.js package.js
tools/deploy.sh
mkdir builds/project
mv build/app.js builds/project/project.js
#mv build/app.css builds/project/project.css

rm package.js
