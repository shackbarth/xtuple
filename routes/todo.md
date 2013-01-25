DONE
auth.js
selection.js -- merged into auth.js and renamed scope
logout.js -- in auth.js
fetch.js -- in data.js -- TODO: handle authentication for all 4 of these
dispatch.js -- in data.js
commit.js -- in data.js
retrieve.js -- in data.js
resetPassword.js
extensions.js
session -- this is done as a pure functor in main.js
maintenance.js
redirector.js
email.js -- TODO: test with new client code
report.js -- note that this will have to be updated per the updates in 19268
file.js -- TODO: this is not working in the client

UNNECESSARY
data.js -- dead code?
database.js -- admin route. dead code?
datasource.js -- admin route. dead code?
organization.js -- admin route. dead code?
session route -- replaced by oauth
oauth2auth.js
oauth2token.js

NOT DONE
dataFromKey -- this is being worked on in 19268
changePassword.js -- John is currently working on this in 19343
export.js -- can we deprecate this w/ pentaho instead of porting?

FUTURE REFACTORING POSSIBILITIES
errors return 200 with isError: true. Better to return 500?
the routes could declare their paths. Is the indirection worth the modularity?
we should put these under test
unify response formatting (DONE! TODO: clean up the client datasource so as not to have to service them both)
deprecate databasetype === 'global'
