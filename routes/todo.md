DONE
maintenance.js
report.js -- note that this will have to be updated per the updates in 19268
fetch.js -- needs functor facade
auth.js
selection.js -- merged into auth.js and renamed scope
file.js
redirector.js -- need to put into use with a dedicated server on port 80
email.js -- test with new client code
extensions.js -- test with new client code
resetPassword.js -- test with new client code

UNNECESSARY (?)
data.js -- dead code?
database.js -- admin route. dead code?
datasource.js -- admin route. dead code?
organization.js -- admin route. dead code?
session.js -- replaced by oauth
session functor?
export.js -- can we deprecate this w/ pentaho instead of porting?

NOT DONE
dataFromKey -- this is being worked on in 19268
oauth2auth.js
oauth2token.js

NOT DONE functors -- will need a facade
commit.js
retrieve.js
dispatch.js

NOT DONE functors -- strip off facade
changePassword.js -- John is currently working on this in 19343
logout.js

FUTURE REFACTORING POSSIBILITIES
errors return 200 with isError: true. Better to return 500?
the big 4 routes are all very similar. it would be possible to reuse code.
the routes could declare their paths
we should put these under test
unify response formatting
deprecate databasetype === 'global'
