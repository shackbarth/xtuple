Zombie Vows

We can use vows with zombie to test our models, kinds, and routes programmatically.

To run a test, do:
  
  cd /path/to/xtuple/node-datasource/test
  ../node_modules/vows/bin/vows vows/kinds/number_test.js

This is a work in progress. At the moment, there is at least one proof-of-concept
implementation of a model, kind, and route test. There are also a bunch of tests
in the wip folder that were implemented using previous methodologies which should
be brought over to the new one.
