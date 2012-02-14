-- used to verify that any changes to xm.opportunity are promulgated to the ophead table
SELECT *
  FROM ophead;

-- used to exercise the insert rule for the xm.opportunity view
INSERT INTO xm.opportunity (
  guid,
  account,
  amount,
  contact,
  currency,
  probability,
  source,
  stage,
  opportunity_type,
  assign_date,
  assigned_to,
  actual_close,
  target_close,
  is_active,
  "name",
  notes,
  "owner",
  priority,
  start_date,
  "number")
VALUES (
  99999,
 (select account_info from xm.account_info order by guid limit 1),
  999.99,
  (select contact_info from xm.contact_info order by guid limit 1),
  1,
  99,
  1,
  1,
  1,
  NULL,
  (select user_account_info from xm.user_account_info where username='admin'),
  NULL,
  NULL,
  true,
  'XM.Opportunity View - Insert Test',
  'Testing...Testing...Testing...Testing',
  (select user_account_info from xm.user_account_info where username='admin'),
  1,
  NULL,
  '99999');

-- used to verify changes to xm.opportunity
SELECT *
  FROM xm.opportunity;

-- used to exercise the update rule for the xm.opportunity view
UPDATE xm.opportunity
   SET account		=(select account_info from xm.account_info order by guid desc limit 1),
       amount		= 8888.88,
       contact		= (select contact_info from xm.contact_info order by guid desc limit 1),
       currency		= 2,
       probability	= 0,
       source		= 1,
       stage		= 3,
       opportunity_type	= 1,
       assign_date	= now(),
       assigned_to	= null,
       actual_close	= now() + interval '10 days',
       target_close	= now() + interval '30 days',
       is_active	= false,
       "name"		= '**XM.Opportunity View - Update Test**',
       notes		= 'Update notes...',
       "owner"		= null,
       priority		= 2,
       start_date	= now() + interval '2 days'
 WHERE guid = 99999;
       
-- used to exercise the delete rule for the xm.opportunity view
DELETE FROM xm.opportunity
 WHERE guid = 99999;

-- used to verify that any changes to xm.opportunity_characteristic are promulgated to the charass table
SELECT charass_id AS id, 
       charass_target_id AS opportunity, 
       charass_char_id AS characteristic,
       charass_value AS value
  FROM charass
 WHERE charass_target_type = 'OPP';

-- used to exercise the insert rule for the xm.opportunity_characteristic view
INSERT INTO xm.opportunity_characteristic (
  guid,
  opportunity,
  characteristic, 
  "value")
VALUES (
  99999, 
  99999, 
  (SELECT characteristic FROM xm.characteristic WHERE name LIKE '%OPPORTUNITY%'), 
  'Opportunity Characteristic View - Test' );

-- used to verify changes to the xm.opportunity_characteristic view
SELECT *
  FROM xm.opportunity_characteristic;

-- used to exercise the update rule for the xm.opportunity_characteristic view
UPDATE xm.opportunity_characteristic
   SET characteristic = (SELECT characteristic FROM xm.characteristic WHERE guid = 24),
       "value"	 = '**Opportunity Characteristic View Update Test**'
 WHERE guid = 99999;

-- used to exercise the delete rule for the xm.opportunity_characteristic view
DELETE FROM xm.opportunity_characteristic
 WHERE guid = 99999;

-- used to verify that any changes to xm.opportunity_comment are promulgated to the comment table
SELECT comment_id 			AS id,
       comment_source_id 		AS opportunity,
       comment_date 			AS cmnt_date,
       comment_user 			AS username,
       comment_cmnttype_id 		AS comment_type,
       comment_text 			AS cmnt_text,
       comment_public 			AS is_public,
       comment_source			AS source -- not used in xm.opportunity_comment view definition...used to verify data is associated with the opportunity entity
  FROM comment
 WHERE ( comment_source = 'OPP' );

-- used to exercise the insert rule for the xm.opportunity_comment view
INSERT INTO xm.opportunity_comment (
  guid,
  opportunity,
  "date",
  "username",
  comment_type,
  "text",
  is_public)
VALUES(
  99999,
  99999,
  now(),
  'mwall',
  2,
  'Opportunity_Comment View - Insert Test',
  true);

-- used to verify changes to the xm.opportunity_comment view
SELECT *
  FROM xm.opportunity_comment;

-- used to exercise the update rule for the xm.opportunity_comment view
UPDATE xm.opportunity_comment
   SET  "text" 		= '**Opportunity_Comment View - Update Test**',
	is_public 	= false
 WHERE ( guid = 99999 );

-- used to exercise the delete rule for the xm.opportunity_comment view (**does nothing**)
DELETE FROM xm.opportunity_comment
 WHERE guid = 99999;

-- used to delete test (garbage) record(s) inserted above from comment table
DELETE FROM comment
 WHERE comment_source_id = 99999;

-- used to verify that any changes to xm.opportunity_source are promulgated to the opsource table
SELECT opsource_id 		AS id,
       opsource_name		AS name,
       opsource_descrip		AS description
  FROM opsource;

-- used to exercise the insert rule for the xm.opportunity_source view
INSERT INTO xm.opportunity_source(
  guid,
  "name",
  description)
VALUES (
  99999,
  'XM.OPPORTUNITY_SOURCE VIEW - INSERT RULE: NAME',
  'XM.OPPORTUNITY_SOURCE VIEW - INSERT RULE: DESCRIPTION');

-- used to verify changes to the xm.opportunity_source view
SELECT *
  FROM xm.opportunity_source;

-- used to exercise the update rule for the xm.opportunity_source view
UPDATE xm.opportunity_source
   SET "name" 		= '**XM.OPPORTUNITY_SOURCE VIEW - UPDATE RULE: NAME**',
       description	= '**XM.OPPORTUNITY_SOURCE VIEW - UPDATE RULE: DESCRIPTION**'
 WHERE guid = 99999;

-- used to exercise the delete rule for the xm.opportunity_source view
DELETE FROM xm.opportunity_source
 WHERE guid = 99999;

-- used to verify that any changes to xm.opportunity_stage are promulgated to the opstage table
SELECT opstage_id 		AS id,
       opstage_name		AS "name",
       opstage_descrip		AS description,
       opstage_opinactive	AS deactivate
  FROM opstage;

-- used to exercise the insert rule for the xm.opportunity_stage view
INSERT INTO xm.opportunity_stage (
  guid,
  "name",
  description,
  deactivate)
VALUES (
  99999,
  'XM.OPPORTUNITY_STAGE VIEW - INSERT RULE: NAME',
  'XM.OPPORTUNITY_STAGE VIEW - INSERT RULE: DESCRIPTION',
  false);

-- used to verify changes to the xm.opportunity_stage view
SELECT *
  FROM xm.opportunity_stage;

-- used to exercise the update rule for the xm.opportunity_stage view
UPDATE xm.opportunity_stage
   SET "name"		= '**XM.OPPORTUNITY_STAGE VIEW - UPDATE RULE: NAME**',
       description	= '**XM.OPPORTUNITY_STAGE VIEW - UPDATE RULE: DESCRIPTION**',
       deactivate	= true
 WHERE guid 		= 99999;

-- used to exercise the delete rule for the xm.opportunity_stage view
DELETE FROM xm.opportunity_stage
 WHERE guid = 99999;

-- used to verify that any changes to xm.opportunity_type are promulgated to the optype table
SELECT optype_id 		AS id,
       optype_name		AS name,
       optype_descrip		AS description
  FROM optype;

-- used to exercise the insert rule for the xm.opportunity_type view
INSERT INTO xm.opportunity_type(
  guid,
  "name",
  description)
VALUES (
  99999,
  'XM.OPPORTUNITY_TYPE VIEW - INSERT RULE: NAME',
  'XM.OPPORTUNITY_TYPE VIEW - INSERT RULE: DESCRIPTION');

-- used to verify changes to the xm.opportunity_type view
SELECT *
  FROM xm.opportunity_type;

-- used to exercise the update rule for the xm.opportunity_type view
UPDATE xm.opportunity_type
   SET "name" 		= '**XM.OPPORTUNITY_TYPE VIEW - UPDATE RULE: NAME**',
       description	= '**XM.OPPORTUNITY_TYPE VIEW - UPDATE RULE: DESCRIPTION**'
 WHERE guid = 99999;

-- used to exercise the delete rule for the xm.opportunity_type view
DELETE FROM xm.opportunity_type
 WHERE guid = 99999;

-- used to test opportunity_info view
SELECT *
  FROM xm.opportunity_info;
