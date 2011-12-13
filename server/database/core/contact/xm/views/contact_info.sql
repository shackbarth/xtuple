SELECT dropIfExists('VIEW', 'contact_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.contact_info AS

SELECT	cntct_id 			AS id,
	cntct_name 			AS "name",
	cntct_title 			AS job_title,
	cntct_phone 			AS phone,
	cntct_phone2 			AS alternate,
	cntct_fax 			AS fax,
	cntct_email 			AS primary_email,
	cntct_webaddr 			AS web_address,
	cntct_active 			AS is_active,
	cntct_crmacct_id 		AS account,
	cntct_owner_username 		AS "owner"
  FROM	cntct;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.contact_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.contact_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.contact_info
  DO INSTEAD NOTHING;