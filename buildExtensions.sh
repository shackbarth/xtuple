#!/bin/bash
# Build extensions

# This could be more scalably done with node

rm -rf builds
mkdir builds

cp source/admin/root-package.js package.js
tools/deploy.sh
mv build/app.js builds/admin.js
#mv build/app.css builds/admin.css

cp source/project/root-package.js package.js
tools/deploy.sh
mv build/app.js builds/project.js
#mv build/app.css builds/project.css

rm package.js
