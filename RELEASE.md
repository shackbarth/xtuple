1.3.8 (2013/06/19)
==================

Features and bugs
----------------
* issue #[20605] Web client does not use metric to determine welcome page URL path

1.3.7 (2013/06/11)
==================

Features and bugs
----------------
* Fix problem where user names that are email addresses could not log in.

1.3.6 (2013/06/06)
==================

Features and bugs
----------------
* Fix critical user login problem
* issue #[20505](http://www.xtuple.org/xtincident/view/bugs/20505)
  Remove print menus and buttons until Pentaho service available on cloud deployment.

1.3.5 (2013/05/31)
===============

Critical deployment changes
---------------------------
* Add redirectPort and maintenancePort to config.js, see sample_config.js
* To run tests you will need to add the test database to the login_data.js
  file, per the conventions in sample_login_data.js. Note also the new
  snake_case filename convention. You will also need to add this database
  name to your config.js file under datasource.testDatabase.
* Changed XT.Data's handling of Dates and nulls to work with current version of plv8
  that doesn't require any special handling. You need to be on this plv8 version:

> commit d75184e00e08e97bc8caba6c9677f8f375a051aa

> Date:   Wed Feb 20 00:10:56 2013 -0800

  To find your current plv8 version:

      cd ~/plv8js
      git log -1

  To move to that plv8 from your current:

      mv plv8js plv8js-old
      git clone https://code.google.com/p/plv8js/
      cd plv8js
      git checkout d75184e00e08e97bc8caba6c9677f8f375a051aa
      # Make sure this is the path to your V8 source:
      make V8_SRCDIR=/home/dev/v8
      sudo make install
      # Restart PostgreSQL Server
      sudo /etc/init.d/postgresql restart

  To test if your plv8 is working correctly, try adding a comment to an Account or Contact.
  See if you get any errors in your browsers Javascript Console and make sure the comment saves.

Features and bugs
----------------

- Implemented parts of
  issue #[20264](http://www.xtuple.org/xtincident/view/bugs/20264)
  REST - Refactor error handling in the database layer
- Fixed
  issue #[20448](http://www.xtuple.org/xtincident/view/bugs/20448)
  _Entering wrong password on mobile client does not return error_
- Fixed
  issue #[20441](http://www.xtuple.org/xtincident/view/bugs/20441)
  _Redirect Port other than 80 does not work_
- Fixed
  issue #[20347](http://www.xtuple.org/xtincident/view/bugs/20347)
  _Default country not working on CRM configuration_
- Fixed
  issue #[20319](http://www.xtuple.org/xtincident/view/bugs/20319)
  _Unable to select first menu after selecting a different menu option_
- Fixed
  issue #[20310](http://www.xtuple.org/xtincident/view/bugs/20310)
  _Next number is a formatted number in sales config_
- Fixed
  issue #[20307](http://www.xtuple.org/xtincident/view/bugs/20307)
  _Can't attach multiple customers to group_
- Fixed
  issue #[20297](http://www.xtuple.org/xtincident/view/bugs/20297)
  _JSON-Patch needs to point to http, not git_
- Implemented
  issue #[20295](http://www.xtuple.org/xtincident/view/bugs/20295)
  _move all ports into config.js_
- Fixed
  issue #[20270](http://www.xtuple.org/xtincident/view/bugs/20270)
  _*Omnibus :Description label is displayed incorrectly_
- Fixed
  issue #[20266](http://www.xtuple.org/xtincident/view/bugs/20266)
  _SQL Injection exploit in XT.Data_
- Implemented
  issue #[20254](http://www.xtuple.org/xtincident/view/bugs/20254)
  _Integrate web-mobile user management into the application database_
- Fixed
  issue #[20240](http://www.xtuple.org/xtincident/view/bugs/20240)
  _Updating ORM uses Username instead of specified -u user_
- Implemented
  issue #[20212](http://www.xtuple.org/xtincident/view/bugs/20212)
  _Build out time and expense portion of "PPM"_
- Fixed
  issue #[20208](http://www.xtuple.org/xtincident/view/bugs/20208)
  _User account assignment box is broken_
- Fixed
  issue #[20199](http://www.xtuple.org/xtincident/view/bugs/20199)
  _Unable to select line item for a quote_
- Fixed
  issue #[20180](http://www.xtuple.org/xtincident/view/bugs/20180)
  _*It is not possible to filter the Customers screen using Advanced Search window_
- Fixed
  issue #[20177](http://www.xtuple.org/xtincident/view/bugs/20177)
  _* It is not possible to assign 'Tax Authority' role to a CRM Account_
- Fixed
  issue #[20162](http://www.xtuple.org/xtincident/view/bugs/20162)
  _*Text box is displayed irrelevantly for the Currency field in the Tax Rate screen_
- Fixed
  issue #[20157](http://www.xtuple.org/xtincident/view/bugs/20157)
  _Incident relations not showing_
- Fixed
  issue #[20078](http://www.xtuple.org/xtincident/view/bugs/20078)
  _Priv Error when trying to add a custom command_
- Implemented
  issue #[20052](http://www.xtuple.org/xtincident/view/bugs/20052)
  _Tax rate ORM, model, and views need to be added_
- Implemented
  issue #[20041](http://www.xtuple.org/xtincident/view/bugs/20041)
  _build extensions dynamically through node_
- Implemented
  issue #[20040](http://www.xtuple.org/xtincident/view/bugs/20040)
  _Add support for Sales Orders_
- Fixed
  issue #[20026](http://www.xtuple.org/xtincident/view/bugs/20026)
  _*Irrelevant behavior is observed on selecting to assign Tax Authority/Sales Rep role to a CRM account_
- Fixed
  issue #[20024](http://www.xtuple.org/xtincident/view/bugs/20024)
  _*Omnibus : Records data  grayed out on editing and refreshing to save the changes made_
- Fixed
  issue #[20011](http://www.xtuple.org/xtincident/view/bugs/20011)
  _*Chrome : Omnibus :Irrelavant dates are displayed on selecting to enter Date starting with special character_
- Fixed
  issue #[19976](http://www.xtuple.org/xtincident/view/bugs/19976)
  _Quote for prospect requires ship-to_
- Fixed
  issue #[19970](http://www.xtuple.org/xtincident/view/bugs/19970)
  _Cannot open an Opportunity from a To Do_
- Fixed
  issue #[19932](http://www.xtuple.org/xtincident/view/bugs/19932)
  _Characteristics not completely working on quote_
- Fixed
  issue #[19889](http://www.xtuple.org/xtincident/view/bugs/19889)
  _*Omnibus: Selecting to enter a number with more than 10 digits in 'Order' field shows irrelevant behavior_
- Fixed
  issue #[19888](http://www.xtuple.org/xtincident/view/bugs/19888)
  _Unable to enter a number with more than 12 digits in the 'Expenses' section under the 'Project Tasks' widget of a Project screen_
- Fixed
  issue #[19871](http://www.xtuple.org/xtincident/view/bugs/19871)
  _*Tab out from an Items 'Extended Description' field displays an irrelevant dialog_
- Fixed
  issue #[19844](http://www.xtuple.org/xtincident/view/bugs/19844)
  _Clicking in Blank Space causes error_
- Fixed
  issue #[19833](http://www.xtuple.org/xtincident/view/bugs/19833)
  _New privileges installed by packages do not appear_
- Fixed
  issue #[19830](http://www.xtuple.org/xtincident/view/bugs/19830)
  _The advanced search box is wider than the panel_
- Implemented
  issue #[19795](http://www.xtuple.org/xtincident/view/bugs/19795)
  _Numbers on number widgets should be right justified_
- Fixed
  issue #[19677](http://www.xtuple.org/xtincident/view/bugs/19677)
  _*It is possible to enter 'End Date'  prior to 'Start Date' for a Tax Registration Number under 'Tax Registration Numbers' widget_
- Fixed
  issue #[19676](http://www.xtuple.org/xtincident/view/bugs/19676)
  _* Omnibus: Discarding the changes made in a Project Task shows unexpected behaviour_
- Fixed
  issue #[19658](http://www.xtuple.org/xtincident/view/bugs/19658)
  _* Omnibus :'To Do' associated to the 'Customer' is displayed as locked on selecting to open_
- Fixed
  issue #[19632](http://www.xtuple.org/xtincident/view/bugs/19632)
  _*Unable to attach a new file to a record_
- Fixed
  issue #[19616](http://www.xtuple.org/xtincident/view/bugs/19616)
  _*Back button is not working on selecting to discard the changes made in a CRM Account's Role_
- Fixed
  issue #[19599](http://www.xtuple.org/xtincident/view/bugs/19599)
  _Maxhammer Mobile Users created with improper SUPERUSER roles and overview of proper db creation process._
- Fixed
  issue #[19542](http://www.xtuple.org/xtincident/view/bugs/19542)
  _Shipping charges prevent customer edit_
- Fixed
  issue #[19471](http://www.xtuple.org/xtincident/view/bugs/19471)
  _Unable to create custom commands in dogfood_
- Fixed
  issue #[19045](http://www.xtuple.org/xtincident/view/bugs/19045)
  _ Omnibus : Database error is displayed on selecting to duplicate existing records_
- Fixed
  issue #[19033](http://www.xtuple.org/xtincident/view/bugs/19033)
  _Irrelavant behaviour is observed in Project task screen_
- Fixed
  issue #[18958](http://www.xtuple.org/xtincident/view/bugs/18958)
  _Errors preventing creation of new item_
- Implemented
  issue #[18757](http://www.xtuple.org/xtincident/view/bugs/18757)
  _REST - Modify the XT.Data commit code to enforce the new requiredAttributes driven by db NOT NULL and ORM override_


1.3.4 (2013/05/06)
===============

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
