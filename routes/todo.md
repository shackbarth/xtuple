DONE
auth.js
selection.js -- merged into auth.js and renamed scope
logout.js -- in auth.js
fetch.js -- in data.js
dispatch.js -- in data.js
commit.js -- in data.js
retrieve.js -- in data.js
resetPassword.js
email.js -- TODO: test with new client code
maintenance.js -- TODO: localhost backdoor

report.js -- note that this will have to be updated per the updates in 19268
file.js
redirector.js -- need to put into use with a dedicated server on port 80
extensions.js -- test with new client code
session functor

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

FUTURE REFACTORING POSSIBILITIES
errors return 200 with isError: true. Better to return 500?
the routes could declare their paths. Is the indirection worth the modularity?
we should put these under test
unify response formatting (DONE! TODO: clean up the client datasource so as not to have to service them both)
deprecate databasetype === 'global'
