The database/build_database.js test should be run first, when
the datasource is not running. This will test the build 
process, and provide a clean slate for further testing.

This can be run with 

`npm run-script test-build`.

Most of our tests are integration tests using zombiejs and 
require a running datasource. These can be run with:

`npm run-script test`

The tests in the routes folder cannot be run at the same time
as the tests that involve client-side zombie testing, because
of namespace collisions. Use this command for those:

`npm run-script test-datasource`
