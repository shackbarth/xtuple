1.3.3 (2013/04)
===============

Critical deployment changes
---------------------------
# You need to add 
  <code>"lib/ext/smtpTransport"</code>
  as a requirement in your config.js. See 
  [sample_config.js](https://github.com/xtuple/xtuple/blob/master/node-datasource/sample_config.js) for details.
# We removed node-datasource/lib/private/salt.txt from version control. You
  will have to put this file back in yourself. You can fill it with any long string you want.
# You need to implement npm changes, config.js changes, and the deletion of a global table as documented
  [here](https://github.com/xtuple/xtuple/pull/224).



Features and bugs
-----------------
These will be enumerated retroactively starting next release.
