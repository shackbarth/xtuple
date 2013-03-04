Zombie Vows

We use vows with zombie to test our models, kinds, and routes programmatically.

Login credentials should stored in the gitignored file 
/path/to/xtuple/node-datasource/test/shared/loginData.js

You'll want to copy the sample in the same directory and update the values appropriately.

At the moment, the user that you use for testing must have access to only one organization.

After configuring loginData.js, go to your /xtuple/enyo-client/application/tools directory and do:

sudo bash deploy.sh

To run a test, do:
  
  cd /path/to/xtuple/node-datasource/test
  ../node_modules/vows/bin/vows --no-error vows/kinds/number_test.js

This is a work in progress. At the moment, there is at least one proof-of-concept
implementation of a model, kind, and route test. There are also a bunch of tests
in the wip folder that were implemented using previous methodologies which should
be brought over to the new methodology.
