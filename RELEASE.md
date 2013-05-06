1.3.4 (2013/05)
===============

Critical deployment changes
---------------------------
* Anybody who wants to work in the admin console will have to add global into their org
  table. You can do this through the admin console, but do it before you upgrade! You
  do not need to associate the org with your user.

Features and bugs
-----------------
- Fixed
  issue #[20169](http://www.xtuple.org/xtincident/view/bugs/20169)
  _etag versions not working with usr and org string pkeys_
- Implemented
  issue #[18716](http://www.xtuple.org/xtincident/view/bugs/18716)
  _REST - Create helper functions needed to generate API Directory list and Discovery Documents_
- Implemented
  issue #[19304](http://www.xtuple.org/xtincident/view/bugs/19304)
  _REST - Add route generator for resource end points_
- Fixed
  issue #[19870](http://www.xtuple.org/xtincident/view/bugs/19870)
  _Unable to attach a contact related to a CRM Account under Documents widget of an accounts screen_
- Fixed
  issue #[19905](http://www.xtuple.org/xtincident/view/bugs/19905)
  _Documents attached under the document widget of a record are not displayed on selecting to reopen the record_
- Fixed
  issue #[20214](http://www.xtuple.org/xtincident/view/bugs/20214)
  _incorrect login brings up error screen_
- Fixed
  issue #[20235](http://www.xtuple.org/xtincident/view/bugs/20235)
  _Selecting to enter the address for a contact displays an error message in the console_
- Fixed
  issue #[20205](http://www.xtuple.org/xtincident/view/bugs/20205)
  _Select Organization for a User - "ID is required" Error_
- Fixed
  issue #[20184](http://www.xtuple.org/xtincident/view/bugs/20184)
  _List lazy-loading problem_
- Fixed
  issue #[19953](http://www.xtuple.org/xtincident/view/bugs/19953)
  _Cannot use a prospect to save a quote_
- Fixed
  issue #[19973](http://www.xtuple.org/xtincident/view/bugs/19973)
  _percent widget is broken_
- Fixed
  issue #[20026](http://www.xtuple.org/xtincident/view/bugs/20026)
  _*Irrelevant behavior is observed on selecting to assign Tax Authority/Sales Rep role to a CRM account_
- Implemented
  issue #[20154](http://www.xtuple.org/xtincident/view/bugs/20154)
  _Add support for natural keys on orms_
- Fixed
  issue #[20066](http://www.xtuple.org/xtincident/view/bugs/20066)
  _*Irrelevant dialog is displayed on selecting to save a Tax Class_
- Implemented
  issue #[20044](http://www.xtuple.org/xtincident/view/bugs/20044)
  _Add support JSON Patch_
- Implemented
  issue #[20052](http://www.xtuple.org/xtincident/view/bugs/20052)
  _Tax rate ORM, model, and views need to be added_
- Implemented
  issue #[20054](http://www.xtuple.org/xtincident/view/bugs/20054)
  _installer should work atomically on one org at a time_


1.3.3 (2013/04/18)
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
* We are now running on [our own fork of plv8](https://github.com/xtuple/plv8).


Features and bugs
-----------------
- Fixed
  issue #[19246](http://www.xtuple.org/xtincident/view/bugs/19246)
  _Help file iframe issue on Firefox_
- Fixed
  issue #[19593](http://www.xtuple.org/xtincident/view/bugs/19593)
  _Record Lock - No Error when attaching a Locked Contact to Account_
- Fixed
  issue #[19450](http://www.xtuple.org/xtincident/view/bugs/19450)
  _Updating setup items does not update their collections and pickers_
- Fixed
  issue #[19469](http://www.xtuple.org/xtincident/view/bugs/19469)
  _customer edit ship-to bug_
- Implemented
  issue #[19442](http://www.xtuple.org/xtincident/view/bugs/19442)
  _Add schema to data routes for Pentaho reports_
- Implemented
  issue #[19296](http://www.xtuple.org/xtincident/view/bugs/19296)
  _OAuth 2.0 - After switching to ONLY Express, remove dead code in node-xt and node-datasource_
- Fixed
  issue #[19813](http://www.xtuple.org/xtincident/view/bugs/19813)
  _Create list and view to maintain customer groups_
- Implemented
  issue #[19812](http://www.xtuple.org/xtincident/view/bugs/19812)
  _Create list and view to maintain customer types_
- Implemented
  issue #[19818](http://www.xtuple.org/xtincident/view/bugs/19818)
  _List cost should be added to item workspace_
- Implemented
  issue #[19811](http://www.xtuple.org/xtincident/view/bugs/19811)
  _Create list and view to maintain sales reps_
- Implemented
  issue #[19847](http://www.xtuple.org/xtincident/view/bugs/19847)
  _Additional mobile db Org Attributes Fields/tables to support automation and data collection required for campaigns etc._
- Implemented
  issue #[19815](http://www.xtuple.org/xtincident/view/bugs/19815)
  _Create list and workspace for freight class_
- Implemented
  issue #[19821](http://www.xtuple.org/xtincident/view/bugs/19821)
  _Create list and workspace for ship zone_
- Fixed
  issue #[19840](http://www.xtuple.org/xtincident/view/bugs/19840)
  _Quotes panel MISSING on Opportunity, Prospect and Customer_
- Fixed
  issue #[20007](http://www.xtuple.org/xtincident/view/bugs/20007)
  _Parent CRM account not created when prospect created_
- Implemented
  issue #[19814](http://www.xtuple.org/xtincident/view/bugs/19814)
  _Create list and views for tax maintenance_
- Implemented
  issue #[19822](http://www.xtuple.org/xtincident/view/bugs/19822)
  _Create list and workspace for terms_
- Fixed
  issue #[20022](http://www.xtuple.org/xtincident/view/bugs/20022)
  _Project numbers are disabled in incidents_
- Fixed
  issue #[19703](http://www.xtuple.org/xtincident/view/bugs/19703)
  _speed up update_
- Implemented
  issue #[19972](http://www.xtuple.org/xtincident/view/bugs/19972)
  _Proposal for BI for Sales based on Pentaho Community_
- Fixed
  issue #[19806](http://www.xtuple.org/xtincident/view/bugs/19806)
  _Quote summary needs cosmetic work_
- Fixed
  issue #[19930](http://www.xtuple.org/xtincident/view/bugs/19930)
  _Search on Address in Quote does not work_
- Implemented
  issue #[19989](http://www.xtuple.org/xtincident/view/bugs/19989)
  _Add a section to display version number_
- Implemented
  issue #[19823](http://www.xtuple.org/xtincident/view/bugs/19823)
  _Create list and workspace for sale type_
- Fixed
  issue #[20039](http://www.xtuple.org/xtincident/view/bugs/20039)
  _State Dropdown does not appear correctly when editing Ship-To_
- Fixed
  issue #[19804](http://www.xtuple.org/xtincident/view/bugs/19804)
  _Cost on quote line items should show the local currency_
- Implemented
  issue #[20053](http://www.xtuple.org/xtincident/view/bugs/20053)
  _Incident filter by foundIn and fixedIn_
- Fixed
  issue #[20067](http://www.xtuple.org/xtincident/view/bugs/20067)
  _Customer Groups does not give error when saving with Blank Name_
- Fixed
  issue #[20073](http://www.xtuple.org/xtincident/view/bugs/20073)
  _Numerous problems with customer shipto_
