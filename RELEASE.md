1.3.3 (2013/04)
===============

Critical deployment changes
---------------------------
* You need to add 
  <code>"lib/ext/smtpTransport"</code>
  as a requirement in your config.js. See 
  [sample_config.js](https://github.com/xtuple/xtuple/blob/master/node-datasource/sample_config.js) for details.
* We removed node-datasource/lib/private/salt.txt from version control. You
  will have to put this file back in yourself. You can fill it with any long string you want.
* You need to implement npm changes, config.js changes, and the deletion of a global table as documented
  [here](https://github.com/xtuple/xtuple/pull/224).
* You will need to make a [change to plv8](https://github.com/davecramer/plv8-xt/commit/bb40a1ecd33752585d9a622e01aeadbd63436a83)
  for the app to work correctly.


Features and bugs
-----------------
These will be enumerated retroactively starting next release.
