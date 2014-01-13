1.5.2 (2013/1/13)
===============

Features and bugfixes
---------------------

- Duplicate
  issue #[22394](http://www.xtuple.org/xtincident/view/bugs/22394)
  _Context queries can have punishingly slow performance_ 

1.5.1 (2013/12/04)
===============

Critical deployment changes
---------------------------
* File moved xtuple/test/shared/login_data.js -> xtuple/test/lib/login_data.js
  `mv test/shared/login_data.js test/lib`
* File moved xtuple/test/mocha/lib/demo-test.backup -> xtuple/test/lib/demo-test.backup
  `mv test/mocha/lib/demo-test.backup test/lib`
* If you have inventory registered you will have to change its location
  `update xt.ext set ext_location = '/private-extensions' where ext_name = 'inventory'`

Features and bugfixes
---------------------

- Implemented 
  issue #[21224](http://www.xtuple.org/xtincident/view/bugs/21224) 
  _REST - Add support for a query "operator" to the REST API and Discovery Docs_ 
- Implemented 
  issue #[21587](http://www.xtuple.org/xtincident/view/bugs/21587) 
  _Add Billing configuration_ 
- Implemented 
  issue #[21625](http://www.xtuple.org/xtincident/view/bugs/21625) 
  _Implement Reason Code_ 
- Fixed 
  issue #[21757](http://www.xtuple.org/xtincident/view/bugs/21757) 
  _Add Project Type to Project_ 
- Fixed 
  issue #[21866](http://www.xtuple.org/xtincident/view/bugs/21866) 
  _Cost in Time Sheet (Worksheet) is null when entered through mobile_ 
- Fixed 
  issue #[21979](http://www.xtuple.org/xtincident/view/bugs/21979) 
  _Arrowing up down through grid entry to not commit edited value to the model_ 
- Implemented 
  issue #[21982](http://www.xtuple.org/xtincident/view/bugs/21982) 
  _Print invoices_ 
- Implemented 
  issue #[21986](http://www.xtuple.org/xtincident/view/bugs/21986) 
  _Add support for Workflow to Sales Orders_ 
- Implemented 
  issue #[21989](http://www.xtuple.org/xtincident/view/bugs/21989) 
  _Add support on item relation widget to search barcode and alias_ 
- Implemented 
  issue #[21992](http://www.xtuple.org/xtincident/view/bugs/21992) 
  _Move inventory to the private-extensions repository_ 
- Fixed 
  issue #[22031](http://www.xtuple.org/xtincident/view/bugs/22031) 
  _Can not change settings_ 
- Completed 
  issue #[22049](http://www.xtuple.org/xtincident/view/bugs/22049) 
  _Cleanup the test folder_ 
- Fixed 
  issue #[22063](http://www.xtuple.org/xtincident/view/bugs/22063) 
  _*Selecting to assign a privilege to a user account role displays 'Internal Server Error' dialog_ 
- Fixed 
  issue #[22093](http://www.xtuple.org/xtincident/view/bugs/22093) 
  _View Characteristics disabled still allows Characteristics to be viewed_ 
- Fixed 
  issue #[22094](http://www.xtuple.org/xtincident/view/bugs/22094) 
  _Characteristic Privilege declared by the CRM extension error_ 
- Fixed 
  issue #[22098](http://www.xtuple.org/xtincident/view/bugs/22098) 
  _Disabled ViewClassCodes priv still allows user to view Class Code_ 
- Fixed 
  issue #[22100](http://www.xtuple.org/xtincident/view/bugs/22100) 
  _Disable ViewCostCategory Priv still allows user to view Cost Category_ 
- Fixed 
  issue #[22101](http://www.xtuple.org/xtincident/view/bugs/22101) 
  _Cost Category Privs not declared by extensions_ 
- Fixed 
  issue #[22102](http://www.xtuple.org/xtincident/view/bugs/22102) 
  _MaintainClassCodes priv not declared by the project extension_ 
- Fixed 
  issue #[22103](http://www.xtuple.org/xtincident/view/bugs/22103) 
  _Billing extension will not load without Sales_ 
- Fixed 
  issue #[22104](http://www.xtuple.org/xtincident/view/bugs/22104) 
  _Incident Plus will not load without Project_ 
- Fixed 
  issue #[22138](http://www.xtuple.org/xtincident/view/bugs/22138) 
  _Save on incident fails_ 
- Fixed 
  issue #[22143](http://www.xtuple.org/xtincident/view/bugs/22143) 
  _Agent is required for New User Account_ 
- Fixed 
  issue #[22166](http://www.xtuple.org/xtincident/view/bugs/22166) 
  _incident list color is all white_ 

1.5.0 (2013/11/19)
==================

Features and bugfixes
---------------------

- Implemented
  issue #[18917](http://www.xtuple.org/xtincident/view/bugs/18917)
  _Complete translation functionality_
- Fixed
  issue #[19681](http://www.xtuple.org/xtincident/view/bugs/19681)
  _*Omnibus :It is not possible to re-attach a newly created and detached To Do item from a record_
- Implemented
  issue #[20438](http://www.xtuple.org/xtincident/view/bugs/20438)
  _convert a quote to a sales order_
- Fixed
  issue #[20625](http://www.xtuple.org/xtincident/view/bugs/20625)
  _Customer hold privileges are not enforced on Sales Order_
- Implemented
  issue #[20946](http://www.xtuple.org/xtincident/view/bugs/20946)
  _implement rjson for basic compression_
- Implemented
  issue #[21038](http://www.xtuple.org/xtincident/view/bugs/21038)
  _Complete Issue to Shipping_
- Implemented
  issue #[21100](http://www.xtuple.org/xtincident/view/bugs/21100)
  _Sales Order Line Items should have a border to show_
- Fixed
  issue #[21166](http://www.xtuple.org/xtincident/view/bugs/21166)
  _*Selecting to create a New To Do from the To Do tab of an incident generates a JS console error_
- Fixed
  issue #[21178](http://www.xtuple.org/xtincident/view/bugs/21178)
  _*It is possible to delete the tasks to which Actual Time/Expenses are posted already_
- Fixed
  issue #[21245](http://www.xtuple.org/xtincident/view/bugs/21245)
  _*Inactive Sales representatives are available for selection_
- Fixed
  issue #[21442](http://www.xtuple.org/xtincident/view/bugs/21442)
  _Site Defaults in Mobile Web are not honoring user defaults_
- Fixed
  issue #[21448](http://www.xtuple.org/xtincident/view/bugs/21448)
  _Error checking on functions is spotty in Mobile_
- Fixed
  issue #[21483](http://www.xtuple.org/xtincident/view/bugs/21483)
  _*Omnibus: Records lists doesn't honor the selected 'Sort By' options_
- Fixed
  issue #[21491](http://www.xtuple.org/xtincident/view/bugs/21491)
  _*Selecting to save a new To do item with an incident/Opportunity attached to it displays JS console error_
- Fixed
  issue #[21494](http://www.xtuple.org/xtincident/view/bugs/21494)
  _The Alter Transaction Dates Privilege is not enforced on Issue to Shipping and Ship_
- Fixed
  issue #[21529](http://www.xtuple.org/xtincident/view/bugs/21529)
  _Item Site is incomplete_
- Implemented
  issue #[21585](http://www.xtuple.org/xtincident/view/bugs/21585)
  _Add support for Sales Categories_
- Implemented
  issue #[21587](http://www.xtuple.org/xtincident/view/bugs/21587)
  _Add Billing configuration_
- Implemented
  issue #[21601](http://www.xtuple.org/xtincident/view/bugs/21601)
  _Add mult-select support to worksheets_
- Fixed
  issue #[21604](http://www.xtuple.org/xtincident/view/bugs/21604)
  _Terms implementation is incomplete_
- Implemented
  issue #[21614](http://www.xtuple.org/xtincident/view/bugs/21614)
  _Implement Bank Account_
- Fixed
  issue #[21617](http://www.xtuple.org/xtincident/view/bugs/21617)
  _*Unable to scroll the Time Sheets List in a new Worksheet_
- Implemented
  issue #[21625](http://www.xtuple.org/xtincident/view/bugs/21625)
  _Implement Reason Code_
- Fixed
  issue #[21633](http://www.xtuple.org/xtincident/view/bugs/21633)
  _*Unable to delete a Sales order_
- Fixed
  issue #[21650](http://www.xtuple.org/xtincident/view/bugs/21650)
  _*'Ship' button is active in the Issue to Shipping screen when 'Ship Orders' privilege is disabled for the user_
- Fixed
  issue #[21657](http://www.xtuple.org/xtincident/view/bugs/21657)
  _Grid row doesn't refresh_
- Fixed
  issue #[21659](http://www.xtuple.org/xtincident/view/bugs/21659)
  _Mobile Timecard entry... remembering fields so don't need to continually enter same data_
- Fixed
  issue #[21666](http://www.xtuple.org/xtincident/view/bugs/21666)
  _*Unable to delete a Prospect_
- Fixed
  issue #[21667](http://www.xtuple.org/xtincident/view/bugs/21667)
  _*Unable to delete a Customer_
- Fixed
  issue #[21670](http://www.xtuple.org/xtincident/view/bugs/21670)
  _*Selecting to discard the changes of a Worksheet hangs the application_
- Implemented
  issue #[21679](http://www.xtuple.org/xtincident/view/bugs/21679)
  _Tweak MW refresh icon_
- Fixed
  issue #[21680](http://www.xtuple.org/xtincident/view/bugs/21680)
  _Timesheets in Mobile Web Client Default to Billable, when Customer is Selected_
- Implemented
  issue #[21684](http://www.xtuple.org/xtincident/view/bugs/21684)
  _Implement Invoices_
- Fixed
  issue #[21704](http://www.xtuple.org/xtincident/view/bugs/21704)
  _Unable to use Sales Analysis due to Blocked page_
- Implemented
  issue #[21739](http://www.xtuple.org/xtincident/view/bugs/21739)
  _Projects should support characteristics_
- Implemented
  issue #[21750](http://www.xtuple.org/xtincident/view/bugs/21750)
  _Develop OLAP client support for dashboards_
- Implemented
  issue #[21762](http://www.xtuple.org/xtincident/view/bugs/21762)
  _Add support for grid entry to project_
- Fixed
  issue #[21801](http://www.xtuple.org/xtincident/view/bugs/21801)
  _xt error on desktop 4.1  with Mobile client_
- Implemented
  issue #[21807](http://www.xtuple.org/xtincident/view/bugs/21807)
  _Develop install script for Pentaho_
- Implemented
  issue #[21821](http://www.xtuple.org/xtincident/view/bugs/21821)
  _Need new welcome screen metric for MW_
- Fixed
  issue #[21831](http://www.xtuple.org/xtincident/view/bugs/21831)
  _Can not run xt-mobile scripts on db upgraded from 4.1.0 to 4.2.0_
- Implemented
  issue #[21834](http://www.xtuple.org/xtincident/view/bugs/21834)
  _Prerequisite Checks for Mobile Required_
- Fixed
  issue #[21851](http://www.xtuple.org/xtincident/view/bugs/21851)
  _mobile no longer uses bindAddress_
- Implemented
  issue #[21864](http://www.xtuple.org/xtincident/view/bugs/21864)
  _assign project tasks to resources_
- Fixed
  issue #[21894](http://www.xtuple.org/xtincident/view/bugs/21894)
  _Address can not be updated_
- Implemented
  issue #[21895](http://www.xtuple.org/xtincident/view/bugs/21895)
  _Initial analytic charts for dashboard in Sales BI Extension_
- Fixed
  issue #[21933](http://www.xtuple.org/xtincident/view/bugs/21933)
  _Client not responding after log in_
- Fixed
  issue #[21994](http://www.xtuple.org/xtincident/view/bugs/21994)
  _*Selecting to run the install script displays Syntax error_

This version requires version 4.2.0 or higher of xTuple PostBooks or commercial edition database.

1.4.6 (2013/11/xx)
==================
Critical deployment changes
---------------------------
- The Sales Dashboard has been redesigned to show sales data from analytic cubes.  To connect to the BI Server
you must define:
 
   biServer: {
        hostname: "localhost",
        port: 8080,
        catalog: "xTuple",
        tenantname: "default",
        keyFile: "./lib/rest-keys/server.key"
      }
in config.js.  Also, the Sales Dashboard is now structured in a private extension:
 
   https://github.com/xtuple/private-extensions/tree/master/source/bi

1.4.5 (2013/10/11)
==================

Features and bugfixes
---------------------

- Fixed
  issue #[19869](http://www.xtuple.org/xtincident/view/bugs/19869)
  _*Omnibus: Locked record is displayed on selecting to open a contact after discarding new contact screen opened from it _
- Fixed
  issue #[19957](http://www.xtuple.org/xtincident/view/bugs/19957)
  _Selecting to create a new Customer/Prospect from the customer field of Quote screen doesn't populates the customer automatically_
- Fixed
  issue #[20000](http://www.xtuple.org/xtincident/view/bugs/20000)
  _* It is not possible to delete the customer SHIP-TO on reopening the customer_
- Fixed
  issue #[20012](http://www.xtuple.org/xtincident/view/bugs/20012)
  _*Selected sales representative commission rate is not displayed automatically on the Customer screen_
- Fixed
  issue #[20064](http://www.xtuple.org/xtincident/view/bugs/20064)
  _*Ship-To Number search screen is not labeled_
- Fixed
  issue #[20071](http://www.xtuple.org/xtincident/view/bugs/20071)
  _Saving while Customer Ship-To is open gives error then causes other issues_
- Fixed
  issue #[20173](http://www.xtuple.org/xtincident/view/bugs/20173)
  _*It is not possible to assign a Tax Authority to a Tax Code_
- Fixed
  issue #[20196](http://www.xtuple.org/xtincident/view/bugs/20196)
  _*Data Source error is displayed on selecting to search the item sites screen with 'Class Code' filter_
- Duplicate
  issue #[20198](http://www.xtuple.org/xtincident/view/bugs/20198)
  _*'Mask' and 'Validator' fields present under characteristic of type 'Text' are not functional_
- Implemented
  issue #[20311](http://www.xtuple.org/xtincident/view/bugs/20311)
  _Welcome screen iframe does not scroll on iOS devices. CSS fix attached. ASM#5469_
- Reopened
  issue #[20332](http://www.xtuple.org/xtincident/view/bugs/20332)
  _Error Adding a Sales Order to an Opportunity_
- Implemented
  issue #[20682](http://www.xtuple.org/xtincident/view/bugs/20682)
  _Inventory History Report_
- No Change Required
  issue #[20885](http://www.xtuple.org/xtincident/view/bugs/20885)
  _Time Expense Version has Incorrect title_
- Fixed
  issue #[20888](http://www.xtuple.org/xtincident/view/bugs/20888)
  _Class Code List updates after a Discard_
- Fixed
  issue #[20981](http://www.xtuple.org/xtincident/view/bugs/20981)
  _BI Readme steps updated_
- Fixed
  issue #[20994](http://www.xtuple.org/xtincident/view/bugs/20994)
  _Clicking on Advanced Search displays History_
- Fixed
  issue #[21008](http://www.xtuple.org/xtincident/view/bugs/21008)
  _*CRM Dashboard charts are duplicated on selecting to refresh_
- Fixed
  issue #[21062](http://www.xtuple.org/xtincident/view/bugs/21062)
  _Using Help Pullout Tab gives Java Console Error_
- Fixed
  issue #[21110](http://www.xtuple.org/xtincident/view/bugs/21110)
  _*Omnibus: Record is locked for some time on selecting 'Save and New' or 'New' button from the record screen_
- Fixed
  issue #[21114](http://www.xtuple.org/xtincident/view/bugs/21114)
  _*observation: Unable to delete a Sales Representative_
- Fixed
  issue #[21181](http://www.xtuple.org/xtincident/view/bugs/21181)
  _*New Quotes/Sales Orders created from the Opportunity screen are not displayed as attached to the Opportunity_
- Fixed
  issue #[21182](http://www.xtuple.org/xtincident/view/bugs/21182)
  _*Omnibus: Selecting to delete a characteristic and save the record displays irrelevant dialog_
- Fixed
  issue #[21230](http://www.xtuple.org/xtincident/view/bugs/21230)
  _*Employee screen doesn't save the Group attached to it_
- Fixed
  issue #[21232](http://www.xtuple.org/xtincident/view/bugs/21232)
  _*Translation is required for the description label in the 'Advanced Search' panel of Employee Group list_
- Duplicate
  issue #[21248](http://www.xtuple.org/xtincident/view/bugs/21248)
  _* Translation is required for the timeExpense label in About screen_
- Fixed
  issue #[21270](http://www.xtuple.org/xtincident/view/bugs/21270)
  _*Translation is required for the  label in About screen_
- Fixed
  issue #[21383](http://www.xtuple.org/xtincident/view/bugs/21383)
  _Found/Fixed in lists are not populated on Advanced Search_
- Fixed
  issue #[21396](http://www.xtuple.org/xtincident/view/bugs/21396)
  _Misbehavior in Time/Expense editor panels_
- Fixed
  issue #[21401](http://www.xtuple.org/xtincident/view/bugs/21401)
  _Gear on worksheet list inconsistent_
- Fixed
  issue #[21402](http://www.xtuple.org/xtincident/view/bugs/21402)
  _All new records prompt to discard on iPad_
- No Change Required
  issue #[21415](http://www.xtuple.org/xtincident/view/bugs/21415)
  _Attaching an Incident or Contact to an Account will not save_
- Fixed
  issue #[21419](http://www.xtuple.org/xtincident/view/bugs/21419)
  _Worksheet owned by person who created it_
- Fixed
  issue #[21425](http://www.xtuple.org/xtincident/view/bugs/21425)
  _List box editor doesn't validate_
- Fixed
  issue #[21437](http://www.xtuple.org/xtincident/view/bugs/21437)
  _Pickers not populating on configuration_
- Fixed
  issue #[21440](http://www.xtuple.org/xtincident/view/bugs/21440)
  _*Delete option is inactive for Tax Authorities_
- Fixed
  issue #[21451](http://www.xtuple.org/xtincident/view/bugs/21451)
  _Timesheet remembers my location every time_
- Fixed
  issue #[21454](http://www.xtuple.org/xtincident/view/bugs/21454)
  _Search box pushed off the screen_
- Fixed
  issue #[21473](http://www.xtuple.org/xtincident/view/bugs/21473)
  _Unable to login Standard if Inventory or Sales is not enabled_
- Fixed
  issue #[21479](http://www.xtuple.org/xtincident/view/bugs/21479)
  _*'View Inventory History' privilege under 'Inventory' module requires translation_
- Fixed
  issue #[21480](http://www.xtuple.org/xtincident/view/bugs/21480)
  _*Transaction Date, Transaction Type and Order Type options in the Sort By list of 'Inventory History' require translation_
- Implemented
  issue #[21487](http://www.xtuple.org/xtincident/view/bugs/21487)
  _grid entry in quote_
- Fixed
  issue #[21496](http://www.xtuple.org/xtincident/view/bugs/21496)
  _*It is possible to select a project in 'Complete' status to create a time/expense sheet_
- Fixed
  issue #[21500](http://www.xtuple.org/xtincident/view/bugs/21500)
  _Icons on pickers overlap text when scrolling_
- Fixed
  issue #[21505](http://www.xtuple.org/xtincident/view/bugs/21505)
  _Mobile object names inconsistent with precedent_
- Fixed
  issue #[21515](http://www.xtuple.org/xtincident/view/bugs/21515)
  _*Incorrect Project Task is displayed in the Time/Expense sheet of a worksheet_
- Fixed
  issue #[21540](http://www.xtuple.org/xtincident/view/bugs/21540)
  _Characteristics don't get disabled_
- Fixed
  issue #[21541](http://www.xtuple.org/xtincident/view/bugs/21541)
  _*Unable to update the Schedule date of a Quote_
- Fixed
  issue #[21565](http://www.xtuple.org/xtincident/view/bugs/21565)
  _Selecting new time entry brings up prior entry_
- Implemented
  issue #[21581](http://www.xtuple.org/xtincident/view/bugs/21581)
  _Add freight class picker to item workspace_
- Fixed
  issue #[21605](http://www.xtuple.org/xtincident/view/bugs/21605)
  _Document linkages are only showing up on one side_
- Fixed
  issue #[21627](http://www.xtuple.org/xtincident/view/bugs/21627)
  _Sales analysis (and other) object name problem_


1.4.4 (2013/09/27)
==================

Features and bugfixes
---------------------

- Implemented
  issue #[18833](http://www.xtuple.org/xtincident/view/bugs/18833)
  _Would like user customizable content on lists_
- Implemented
  issue #[19647](http://www.xtuple.org/xtincident/view/bugs/19647)
  _Report dates and currency must be localizable_
- Fixed
  issue #[19858](http://www.xtuple.org/xtincident/view/bugs/19858)
  _*Unable to delete a Project Task from Project Tasks screen_
- Fixed
  issue #[20449](http://www.xtuple.org/xtincident/view/bugs/20449)
  _Incidents gives error when CRM is only extension_
- Implemented
  issue #[20677](http://www.xtuple.org/xtincident/view/bugs/20677)
  _Create Location object_
- Implemented
  issue #[20683](http://www.xtuple.org/xtincident/view/bugs/20683)
  _Backlog Report_
- Implemented
  issue #[20684](http://www.xtuple.org/xtincident/view/bugs/20684)
  _Create Shipments List object and views with return action_
- Implemented
  issue #[20734](http://www.xtuple.org/xtincident/view/bugs/20734)
  _Issue to Shipping_
- Fixed
  issue #[20800](http://www.xtuple.org/xtincident/view/bugs/20800)
  _*Delete option is active for contacts attached to ToDoitem/Opportunity_
- Fixed
  issue #[20927](http://www.xtuple.org/xtincident/view/bugs/20927)
  _Install script says finished when it is not_
- Fixed
  issue #[20954](http://www.xtuple.org/xtincident/view/bugs/20954)
  _Problems in report data from data-from-key_
- Fixed
  issue #[21093](http://www.xtuple.org/xtincident/view/bugs/21093)
  _*No error message is displayed on selecting to delete an item with item site created for it_
- Fixed
  issue #[21176](http://www.xtuple.org/xtincident/view/bugs/21176)
  _*Unable to save comments for a To do item_
- Fixed
  issue #[21189](http://www.xtuple.org/xtincident/view/bugs/21189)
  _Files over 1MB does not appear to complete upload_
- Implemented
  issue #[21251](http://www.xtuple.org/xtincident/view/bugs/21251)
  _Add credit card processing support to Sales Order_
- Fixed
  issue #[21277](http://www.xtuple.org/xtincident/view/bugs/21277)
  _T/E mobile not enforcing view other rules._
- Fixed
  issue #[21306](http://www.xtuple.org/xtincident/view/bugs/21306)
  _Menu presentation order unpredictable_
- Fixed
  issue #[21316](http://www.xtuple.org/xtincident/view/bugs/21316)
  _Time and Expense uneditable when unapproved_
- Completed
  issue #[21327](http://www.xtuple.org/xtincident/view/bugs/21327)
  _Sales cubes dimension and measure terminology_
- Completed
  issue #[21360](http://www.xtuple.org/xtincident/view/bugs/21360)
  _add monthly calendar to sales cubes_
- Completed
  issue #[21361](http://www.xtuple.org/xtincident/view/bugs/21361)
  _Should be able to save Sales Analysis query_
- Fixed
  issue #[21368](http://www.xtuple.org/xtincident/view/bugs/21368)
  _Worksheets bring in wrong customer reference_
- Fixed
  issue #[21385](http://www.xtuple.org/xtincident/view/bugs/21385)
  _TE Worksheet List does not filter on on Date_
- Fixed
  issue #[21399](http://www.xtuple.org/xtincident/view/bugs/21399)
  _Can't find worksheet total hours_
- Fixed
  issue #[21403](http://www.xtuple.org/xtincident/view/bugs/21403)
  _Worksheets should default to self as the Employee_
- Fixed
  issue #[21407](http://www.xtuple.org/xtincident/view/bugs/21407)
  _Field missing on Worksheet:  hourly cost_
- Fixed
  issue #[21427](http://www.xtuple.org/xtincident/view/bugs/21427)
  _Inventory Extension adding expense category to setup menu_
- Fixed
  issue #[21432](http://www.xtuple.org/xtincident/view/bugs/21432)
  _forgot password error_
- Fixed
  issue #[21439](http://www.xtuple.org/xtincident/view/bugs/21439)
  _Picker is too wide on money widgets_
- Fixed
  issue #[21442](http://www.xtuple.org/xtincident/view/bugs/21442)
  _Site Defaults in Mobile Web are not honoring user defaults_
- Fixed
  issue #[21453](http://www.xtuple.org/xtincident/view/bugs/21453)
  _Firefox is blocking mobile help content_
- Fixed
  issue #[21455](http://www.xtuple.org/xtincident/view/bugs/21455)
  _Sort is not working for Sort and Layout Attribute Pickers_
- Fixed
  issue #[21478](http://www.xtuple.org/xtincident/view/bugs/21478)
  _*Selecting to create new Shipment record displays insufficient privileges dialog_
- Fixed
  issue #[21482](http://www.xtuple.org/xtincident/view/bugs/21482)
  _*Omnibus: Blank screen is displayed on selecting to print any record/records list_
- Fixed
  issue #[21495](http://www.xtuple.org/xtincident/view/bugs/21495)
  _Cannot Search for Incident Contact_
- Fixed
  issue #[21497](http://www.xtuple.org/xtincident/view/bugs/21497)
  _Time Expense has dependency on Sales_
- Fixed
  issue #[21498](http://www.xtuple.org/xtincident/view/bugs/21498)
  _Users can not save time sheet if no prvilege_
- Fixed
  issue #[21524](http://www.xtuple.org/xtincident/view/bugs/21524)
  _Printing Admin Account causes unhandled Error_
- Fixed
  issue #[21532](http://www.xtuple.org/xtincident/view/bugs/21532)
  _Cannot open an existing Item_


1.4.3 (2013/09/11)
==================

Features and bugfixes
---------------------
- Implemented
  issue #[18488](http://www.xtuple.org/xtincident/view/bugs/18488)
  _Add sort option to Mobile client_
- Fixed
  issue #[19395](http://www.xtuple.org/xtincident/view/bugs/19395)
  _*Unable to delete a contact with no address_
- Fixed
  issue #[19680](http://www.xtuple.org/xtincident/view/bugs/19680)
  _Email profiles are not editable_
- Fixed
  issue #[19966](http://www.xtuple.org/xtincident/view/bugs/19966)
  _*It is possible to create a Quote without any line item_
- Fixed
  issue #[19992](http://www.xtuple.org/xtincident/view/bugs/19992)
  _*New quote created from a Customer does not populates the customer number  automatically in 'Customer' field of quote screen_
- Fixed
  issue #[19993](http://www.xtuple.org/xtincident/view/bugs/19993)
  _*Detach button in the Quotes panel of a customer is not functional_
- Implemented
  issue #[20445](http://www.xtuple.org/xtincident/view/bugs/20445)
  _Login Page should have "Forgot Password" link/functionality_
- Fixed
  issue #[20458](http://www.xtuple.org/xtincident/view/bugs/20458)
  _Editing Worksheet Time Billable does not save_
- Fixed
  issue #[20460](http://www.xtuple.org/xtincident/view/bugs/20460)
  _Posting a Worksheet does not appear to do anything_
- Implemented
  issue #[20782](http://www.xtuple.org/xtincident/view/bugs/20782)
  _add vCard export functionality for contacts_
- Implemented
  issue #[20851](http://www.xtuple.org/xtincident/view/bugs/20851)
  _REST support for field-level queries_
- Fixed
  issue #[20909](http://www.xtuple.org/xtincident/view/bugs/20909)
  _ListRelationsEditorBox fails if you delete an intermediate item_
- Fixed
  issue #[20960](http://www.xtuple.org/xtincident/view/bugs/20960)
  _Cannot create new Site_
- Fixed
  issue #[20961](http://www.xtuple.org/xtincident/view/bugs/20961)
  _Deleting a Site does not work_
- Completed
  issue #[20987](http://www.xtuple.org/xtincident/view/bugs/20987)
  _Pentaho tenant to include server IP_
- Implemented
  issue #[21046](http://www.xtuple.org/xtincident/view/bugs/21046)
  _Add context messaging tools for Mobile Web UI (Sales Analysis)_
- Fixed
  issue #[21097](http://www.xtuple.org/xtincident/view/bugs/21097)
  _*Selecting to edit and save an item site displays irrelevant message_
- Fixed
  issue #[21112](http://www.xtuple.org/xtincident/view/bugs/21112)
  _*Omnibus: Action icon button doesn't respond on clicking when 'Advanced Search' panel is open for the list of records_
- Fixed
  issue #[21120](http://www.xtuple.org/xtincident/view/bugs/21120)
  _*Observation: Selecting to save the Tax rate with currency set to default displays 'currency is required' message irrelevantly_
- Fixed
  issue #[21121](http://www.xtuple.org/xtincident/view/bugs/21121)
  _*Selecting 'Save' in the Tax Rate screen without selecting the Tax Code doesn't displays any error message_
- Fixed
  issue #[21123](http://www.xtuple.org/xtincident/view/bugs/21123)
  _Multi-Site option should not be allowed off if there are Multi-sites_
- Fixed
  issue #[21158](http://www.xtuple.org/xtincident/view/bugs/21158)
  _*translation required for effective and expiry date warning messages_
- Fixed
  issue #[21201](http://www.xtuple.org/xtincident/view/bugs/21201)
  _*Delete option is active for Used contacts_
- Fixed
  issue #[21234](http://www.xtuple.org/xtincident/view/bugs/21234)
  _*It is possible to edit and save the Billing rate currency of the Time And Expense sheets of an Approved worksheet_
- Fixed
  issue #[21256](http://www.xtuple.org/xtincident/view/bugs/21256)
  _Project does not save with filter_
- Fixed
  issue #[21276](http://www.xtuple.org/xtincident/view/bugs/21276)
  _mobile TE scrolling_
- Fixed
  issue #[21289](http://www.xtuple.org/xtincident/view/bugs/21289)
  _A user who only has personal privileges can not create records_
- Fixed
  issue #[21302](http://www.xtuple.org/xtincident/view/bugs/21302)
  _Task assignments not working on worksheets_
- Fixed
  issue #[21359](http://www.xtuple.org/xtincident/view/bugs/21359)
  _Worksheet list unacceptably slow_
- Fixed
  issue #[21374](http://www.xtuple.org/xtincident/view/bugs/21374)
  _Last saved filter doesn't default_
- Fixed
  issue #[21375](http://www.xtuple.org/xtincident/view/bugs/21375)
  _Default search criteria appearing on widget searches_
- Fixed
  issue #[21395](http://www.xtuple.org/xtincident/view/bugs/21395)
  _Selecting worksheets sometimes opens wrong selection_


1.4.2 (2013/08/23)
==================

Features and bugfixes
---------------------
- Fixed
  issue #[21260](http://www.xtuple.org/xtincident/view/bugs/21260)
  _XT.filter table naming conflict with public.filter_


1.4.1 (2013/08/21)
===============

Features and bugfixes
----------------
- Implemented
  issue #[18668](http://www.xtuple.org/xtincident/view/bugs/18668)
  _Initial documentation build for Mobile platform_
- Implemented
  issue #[19294](http://www.xtuple.org/xtincident/view/bugs/19294)
  _OAuth 2.0 - Refactor route and functor mapping in Express to use a loop for loading_
- Implemented
  issue #[19303](http://www.xtuple.org/xtincident/view/bugs/19303)
  _REST - Add Discovery Service routes_
- Implemented
  issue #[19305](http://www.xtuple.org/xtincident/view/bugs/19305)
  _REST - Add route handler functions for end point CRUD_
- Implemented
  issue #[19306](http://www.xtuple.org/xtincident/view/bugs/19306)
  _REST - Add "service" endpoints_
- Completed
  issue #[19443](http://www.xtuple.org/xtincident/view/bugs/19443)
  _Use data schema in Pentaho report scripts_
- Fixed
  issue #[20195](http://www.xtuple.org/xtincident/view/bugs/20195)
  _*Irrelevant behavior is observed on re-opening a quote_
- Fixed
  issue #[20265](http://www.xtuple.org/xtincident/view/bugs/20265)
  _OAUTH - Existing session/cookie causes client to load. Fix redirect to auth dialog page_
- Fixed
  issue #[20458](http://www.xtuple.org/xtincident/view/bugs/20458)
  _Editing Worksheet Time Billable does not save_
- Fixed
  issue #[20642](http://www.xtuple.org/xtincident/view/bugs/20642)
  _Filters broken on incidents_
- Implemented
  issue #[20864](http://www.xtuple.org/xtincident/view/bugs/20864)
  _Grid entry for Sales Order on Desktop based browser client_
- Implemented
  issue #[20866](http://www.xtuple.org/xtincident/view/bugs/20866)
  _Allow filters to be saved on lists_
- Fixed
  issue #[20886](http://www.xtuple.org/xtincident/view/bugs/20886)
  _Searchable is required on New Characteristic_
- Implemented
  issue #[20890](http://www.xtuple.org/xtincident/view/bugs/20890)
  _OAuth2 - Admin Interface Usability Tweaks_
- Fixed
  issue #[20891](http://www.xtuple.org/xtincident/view/bugs/20891)
  _Add "website" to contact overview_
- Fixed
  issue #[20898](http://www.xtuple.org/xtincident/view/bugs/20898)
  _Item Site not populating correctly for Sales Order_
- Fixed
  issue #[20899](http://www.xtuple.org/xtincident/view/bugs/20899)
  _Advanced Search does not display list after clearing bad data_
- Fixed
  issue #[20902](http://www.xtuple.org/xtincident/view/bugs/20902)
  _Adding an Item to Quote_
- Fixed
  issue #[20908](http://www.xtuple.org/xtincident/view/bugs/20908)
  _Dashboard Charts shrink upon returning to Dashboard screen_
- Fixed
  issue #[20932](http://www.xtuple.org/xtincident/view/bugs/20932)
  _Dashboard Query is not working_
- Fixed
  issue #[20979](http://www.xtuple.org/xtincident/view/bugs/20979)
  _oath2client table entry for Pentaho needs to use default database_
- Fixed
  issue #[20983](http://www.xtuple.org/xtincident/view/bugs/20983)
  _History shows "undefined" for many objects_
- Fixed
  issue #[20989](http://www.xtuple.org/xtincident/view/bugs/20989)
  _oauth2 check for JWT issued in the future causes timing problem_
- Fixed
  issue #[21016](http://www.xtuple.org/xtincident/view/bugs/21016)
  _Cost Categories Desciption alignment is wrong_
- Fixed
  issue #[21051](http://www.xtuple.org/xtincident/view/bugs/21051)
  _Characteristic - No Error message when trying to save without a role_
- Fixed
  issue #[21055](http://www.xtuple.org/xtincident/view/bugs/21055)
  _Updating Extensions on Role will not allow application to load on login_
- Fixed
  issue #[21066](http://www.xtuple.org/xtincident/view/bugs/21066)
  _Editing a Sales Order gives _shipped error_
- Fixed
  issue #[21129](http://www.xtuple.org/xtincident/view/bugs/21129)
  _Sales Analysis user can not use Pentaho single sign on without admin privilege_
- Fixed
  issue #[21138](http://www.xtuple.org/xtincident/view/bugs/21138)
  _Relation Lists are not loading Properly in Workspaces_


1.4.0 (2013/08/07)
===============

Features and bugfixes
----------------
- Fixed
  issue #[18711](http://www.xtuple.org/xtincident/view/bugs/18711)
  _Edit Owner privilege is not enforced_
- Fixed
  issue #[18724](http://www.xtuple.org/xtincident/view/bugs/18724)
  _ReassignToDoItems privilege is not enforced_
- Fixed
  issue #[18726](http://www.xtuple.org/xtincident/view/bugs/18726)
  _*Left of Contact Address Not Visible in panel_
- Fixed
  issue #[18968](http://www.xtuple.org/xtincident/view/bugs/18968)
  _Panel sizing on Item workspace_
- Fixed
  issue #[19042](http://www.xtuple.org/xtincident/view/bugs/19042)
  _Omnibus: Observation: New User Account created from Owner field is not populated automatically in Owner field_
- Implemented
  issue #[19626](http://www.xtuple.org/xtincident/view/bugs/19626)
  _Add link to google maps_
- Completed
  issue #[19645](http://www.xtuple.org/xtincident/view/bugs/19645)
  _Install/build process for reports_
- Fixed
  issue #[19711](http://www.xtuple.org/xtincident/view/bugs/19711)
  _*Irrelevant behavior is observed on selecting to save the role assigned to the CRM Account_
- Fixed
  issue #[19796](http://www.xtuple.org/xtincident/view/bugs/19796)
  _Quote shows costs when users do not have cost privilege_
- Fixed
  issue #[19800](http://www.xtuple.org/xtincident/view/bugs/19800)
  _Site should only appear on quote when multi-site enabled_
- Implemented
  issue #[19801](http://www.xtuple.org/xtincident/view/bugs/19801)
  _Site should default on quote_
- Fixed
  issue #[19805](http://www.xtuple.org/xtincident/view/bugs/19805)
  _User should not be able to edit quote price unless they have privileges to do so_
- Fixed
  issue #[19859](http://www.xtuple.org/xtincident/view/bugs/19859)
  _*Selecting to create a new project task from an existing project task displays Data source error_
- Fixed
  issue #[19967](http://www.xtuple.org/xtincident/view/bugs/19967)
  _*Irrelevant dialog is displayed on saving a quote_
- Fixed
  issue #[20008](http://www.xtuple.org/xtincident/view/bugs/20008)
  _Converting prospect to customer freezes client_
- Fixed
  issue #[20068](http://www.xtuple.org/xtincident/view/bugs/20068)
  _Click Apply on Customer Groups will Lock the record_
- Implemented
  issue #[20190](http://www.xtuple.org/xtincident/view/bugs/20190)
  _Mobile Client Phone Numbers Should be Clickable_
- Implemented
  issue #[20380](http://www.xtuple.org/xtincident/view/bugs/20380)
  _Sales analysis view_
- Fixed
  issue #[20489](http://www.xtuple.org/xtincident/view/bugs/20489)
  _Item does not display Wholesale Price_
- Implemented
  issue #[20524](http://www.xtuple.org/xtincident/view/bugs/20524)
  _build_database script_
- Fixed
  issue #[20555](http://www.xtuple.org/xtincident/view/bugs/20555)
  _new authentication does not work with pgbouncer_
- Implemented
  issue #[20559](http://www.xtuple.org/xtincident/view/bugs/20559)
  _Need to create an interface to manage Oauth_
- Implemented
  issue #[20574](http://www.xtuple.org/xtincident/view/bugs/20574)
  _sales order should use item and site instead of itemsite_
- No Change Required
  issue #[20596](http://www.xtuple.org/xtincident/view/bugs/20596)
  _Numbers cut off by scroller_
- Implemented
  issue #[20614](http://www.xtuple.org/xtincident/view/bugs/20614)
  _Need an installer methodology for the mobile client and extensions_
- Fixed
  issue #[20638](http://www.xtuple.org/xtincident/view/bugs/20638)
  _Attach option on relation boxes should not display objects already attached to other objects_
- Fixed
  issue #[20672](http://www.xtuple.org/xtincident/view/bugs/20672)
  _Admin Role gives Java Console Error_
- Fixed
  issue #[20673](http://www.xtuple.org/xtincident/view/bugs/20673)
  _User Account gives Disable Export error_
- Implemented
  issue #[20676](http://www.xtuple.org/xtincident/view/bugs/20676)
  _Create Inventory Configuration Settings_
- Implemented
  issue #[20715](http://www.xtuple.org/xtincident/view/bugs/20715)
  _Sales dashboard_
- Implemented
  issue #[20723](http://www.xtuple.org/xtincident/view/bugs/20723)
  _Single signon support for Pentaho_
- Implemented
  issue #[20726](http://www.xtuple.org/xtincident/view/bugs/20726)
  _Support for Pentaho dynamic OLAP cubes based on organization_
- Fixed
  issue #[20736](http://www.xtuple.org/xtincident/view/bugs/20736)
  _xt package pkg tables missing triggers, causing issues loading packages_
- Implemented
  issue #[20746](http://www.xtuple.org/xtincident/view/bugs/20746)
  _Multi-tenant support for Sales cubes_
- Implemented
  issue #[20747](http://www.xtuple.org/xtincident/view/bugs/20747)
  _Multi-tenant support for sales ETL_
- Fixed
  issue #[20760](http://www.xtuple.org/xtincident/view/bugs/20760)
  _*Quantity UOM is not available for selection in SO Line item screen_
- Implemented
  issue #[20771](http://www.xtuple.org/xtincident/view/bugs/20771)
  _generate p12 in oauth generate-key route_
- No Change Required
  issue #[20774](http://www.xtuple.org/xtincident/view/bugs/20774)
  _access user_account REST_
- Fixed
  issue #[20775](http://www.xtuple.org/xtincident/view/bugs/20775)
  _Remove xtbatch schema if not being used by mobile_
- Implemented
  issue #[20780](http://www.xtuple.org/xtincident/view/bugs/20780)
  _improve maven reports deployment_
- Fixed
  issue #[20785](http://www.xtuple.org/xtincident/view/bugs/20785)
  _Change Password does not remove Confirmed Password_
- Fixed
  issue #[20792](http://www.xtuple.org/xtincident/view/bugs/20792)
  _*Username of a User Account is editable_
- Fixed
  issue #[20803](http://www.xtuple.org/xtincident/view/bugs/20803)
  _*Observation: Newly created records are displayed as locked on opening the records immediately after creation_
- Fixed
  issue #[20814](http://www.xtuple.org/xtincident/view/bugs/20814)
  _Cannot save a Sales Order_
- Implemented
  issue #[20820](http://www.xtuple.org/xtincident/view/bugs/20820)
  _REST - Expose all objects needed for basic relation functionality to work_
- Fixed
  issue #[20848](http://www.xtuple.org/xtincident/view/bugs/20848)
  _Advanced Search Groupbox is too wide_
- Implemented
  issue #[20865](http://www.xtuple.org/xtincident/view/bugs/20865)
  _Add dropdown indicator icon to picker_
- Implemented
  issue #[20868](http://www.xtuple.org/xtincident/view/bugs/20868)
  _-k flag for build_app_
- Implemented
  issue #[20874](http://www.xtuple.org/xtincident/view/bugs/20874)
  _Merge time and expense functionality into project_
- Fixed
  issue #[20999](http://www.xtuple.org/xtincident/view/bugs/20999)
  _support build_app with absolute -c path_
- Fixed
  issue #[21007](http://www.xtuple.org/xtincident/view/bugs/21007)
  _Sales Analysis does not display correct Cube after changing databases_

Critical deployment changes
---------------------------
* We have moved the test folder from the node-datasource directory.
  You will want to move by hand the two gitignored files in there:
  demo-test.backup, and login_data.js. Then, you can rmdir the
  `node-datasource/test` folder and all its subfolders.
* The init_scripts and the command-line ORM installer are gone.
  You will have to use /scripts/build_app.js for your installation needs.
  Run it with the -h flag to see the options.
* The old tools for building client code (deploy.sh, buildExtensions.sh, build_client.js)
  are gone. Use /scripts/build_app.js for your client-building needs.
  Run it with the -h flag to see the options.
* When you merge from master git will complain that it is not able to delete
  an enyo directory which has just be deinitialized as a submodule. You will
  want to delete it by hand. This goes for the xtuple and the private-extensions repos.


1.3.9 (2013/06/27)
==================

Features and bugfixes
----------------
- Fixed
  issue #[18845](http://www.xtuple.org/xtincident/view/bugs/18845)
  _Status is missing from To Do_
- Fixed
  issue #[19271](http://www.xtuple.org/xtincident/view/bugs/19271)
  _Datasource does not enforce privilege extensions on fetch_
- Fixed
  issue #[19272](http://www.xtuple.org/xtincident/view/bugs/19272)
  _Half-drilldown into deprivileged workspaces_
- Fixed
  issue #[19797](http://www.xtuple.org/xtincident/view/bugs/19797)
  _Quote shows margin when user does not have show margin privilege_
- Fixed
  issue #[20074](http://www.xtuple.org/xtincident/view/bugs/20074)
  _*Irrelevant behavior is observed in Quote line items_
- Fixed
  issue #[20204](http://www.xtuple.org/xtincident/view/bugs/20204)
  _Mobile client unaware of public/private comments_
- Fixed
  issue #[20272](http://www.xtuple.org/xtincident/view/bugs/20272)
  _Relation widget keeps appending parameters_
- Fixed
  issue #[20332](http://www.xtuple.org/xtincident/view/bugs/20332)
  _Error Adding a Sales Order to an Opportunity_
- Fixed
  issue #[20333](http://www.xtuple.org/xtincident/view/bugs/20333)
  _Advanced Seach of Sales Rep on Sales Order does not work correctly_
- Fixed
  issue #[20356](http://www.xtuple.org/xtincident/view/bugs/20356)
  _Calendar still active after date is picked_
- Implemented
  issue #[20373](http://www.xtuple.org/xtincident/view/bugs/20373)
  _Bring back DisableExport_
- Implemented
  issue #[20375](http://www.xtuple.org/xtincident/view/bugs/20375)
  _Bring back priv_group_
- Fixed
  issue #[20440](http://www.xtuple.org/xtincident/view/bugs/20440)
  _Incident Documents double when using Apply_
- Fixed
  issue #[20456](http://www.xtuple.org/xtincident/view/bugs/20456)
  _Clicking on Locked Icon gives Console error_
- Fixed
  issue #[20476](http://www.xtuple.org/xtincident/view/bugs/20476)
  _Tax Assignemnt gives Java Console Error_
- Fixed
  issue #[20501](http://www.xtuple.org/xtincident/view/bugs/20501)
  _ToDo and Prospect form report routes_
- Fixed
  issue #[20506](http://www.xtuple.org/xtincident/view/bugs/20506)
  _Add multi-tenant support for Pentaho reports_
- Fixed
  issue #[20540](http://www.xtuple.org/xtincident/view/bugs/20540)
  _User Account Roles do not use groups_
- Fixed
  issue #[20549](http://www.xtuple.org/xtincident/view/bugs/20549)
  _You should be able to assign extensions in user accunt roles as well as user accounts_
- Fixed
  issue #[20555](http://www.xtuple.org/xtincident/view/bugs/20555)
  _new authentication does not work with pgbouncer_
- Fixed
  issue #[20563](http://www.xtuple.org/xtincident/view/bugs/20563)
  _Action - Change Password requires 6 digits_
- Fixed
  issue #[20583](http://www.xtuple.org/xtincident/view/bugs/20583)
  _Authentication not remembered_
- Fixed
  issue #[20601](http://www.xtuple.org/xtincident/view/bugs/20601)
  _There is no tracking of version numbers in extensions_
- Fixed
  issue #[20609](http://www.xtuple.org/xtincident/view/bugs/20609)
  _Incident plus broken_
- Fixed
  issue #[20637](http://www.xtuple.org/xtincident/view/bugs/20637)
  _The attach button should not be available on Customer for Sales Orders and Quotes_
- Fixed
  issue #[20638](http://www.xtuple.org/xtincident/view/bugs/20638)
  _Attach option on relation boxes should not display objects already attached to other objects_

1.3.8 (2013/06/19)
==================

Features and bugfixes
----------------
- Fixed
  issue #[20605](http://www.xtuple.org/xtincident/view/bugs/20605)
  _Web client does not use the metric to determine the welcome page URL path_

1.3.7 (2013/06/11)
==================

Features and bugfixes
----------------
- Fixed problem where user names that are email addresses could not log in.

1.3.6 (2013/06/06)
==================

Features and bugfixes
----------------
* Fix critical user login problem
- Fixed
  issue #[20505](http://www.xtuple.org/xtincident/view/bugs/20505)
  _Remove print menus and buttons until Pentaho service available on cloud deployment._

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

Features and bugfixes
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

Features and bugfixes
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


Features and bugfixes
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
