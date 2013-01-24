DONE
maintenance.js
report.js -- note that this will have to be updated per the updates in 19268
fetch.js -- in data.js
dispatch.js -- in data.js
commit.js -- in data.js, test functor
retrieve.js -- in data.js
auth.js
selection.js -- merged into auth.js and renamed scope
file.js
redirector.js -- need to put into use with a dedicated server on port 80
email.js -- test with new client code
extensions.js -- test with new client code
resetPassword.js -- test with new client code
logout.js -- in auth.js

UNNECESSARY (?)
data.js -- dead code?
database.js -- admin route. dead code?
datasource.js -- admin route. dead code?
organization.js -- admin route. dead code?
session route -- replaced by oauth
export.js -- can we deprecate this w/ pentaho instead of porting?
oauth2auth.js
oauth2token.js

NOT DONE
route: dataFromKey -- this is being worked on in 19268
route: changePassword.js -- John is currently working on this in 19343
session functor https://github.com/bendiy/tools/blob/master/source/session.js#L49

FUTURE REFACTORING POSSIBILITIES
errors return 200 with isError: true. Better to return 500?
the routes could declare their paths. Is the indirection worth the modularity?
we should put these under test
unify response formatting (DONE! TODO: clean up the client datasource so as not to have to service them both)
deprecate databasetype === 'global'
