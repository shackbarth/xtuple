#!/bin/bash
# Build extensions

# This could be more scalably done with node

rm -rf builds
mkdir builds

cp source/incident_plus/client/root-package.js package.js
tools/deploy.sh
mkdir builds/incident_plus
mv build/app.js builds/incident_plus/incident_plus.js

cp source/project/client/root-package.js package.js
tools/deploy.sh
mkdir builds/project
mv build/app.js builds/project/project.js

cp source/crm/client/root-package.js package.js
tools/deploy.sh
mkdir builds/crm
mv build/app.js builds/crm/crm.js

rm package.js
