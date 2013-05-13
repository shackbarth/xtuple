Zombie Vows
===========

We use vows with zombie to test our models, kinds, and routes programmatically.

To install vows globally:

    npm install vows -g

Login credentials should stored in the gitignored file:
shared/loginData.js

You'll want to copy the sample in the same directory and update the values appropriately.
At the moment, the user that you use for testing must have access to only one organization.

After configuring loginData.js, go to
enyo-client/application/tools directory and do:

    sudo bash deploy.sh

cd back to the node-datasource/test/vows directory
To run a test, do:

    vows models/your_file.js

To see more detail:

    vows models/your_file.js --spec

To run all tests in the folder:

    vows models/*

This is a work in progress. At the moment, there is at least one proof-of-concept
implementation of a model, kind, and route test. There are also a bunch of tests
in the wip folder that were implemented using previous methodologies which should
be brought over to the new methodology.
