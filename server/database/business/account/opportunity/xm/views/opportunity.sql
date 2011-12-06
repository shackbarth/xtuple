/*
SELECT dropIfExists('VIEW', 'opportunity_type', 'xm');
SELECT dropIfExists('VIEW', 'opportunity_stage', 'xm');
SELECT dropIfExists('VIEW', 'opportunity_source', 'xm');
SELECT dropIfExists('VIEW', 'opportunity_info', 'xm');
SELECT dropIfExists('VIEW', 'opportunity_comment', 'xm');
SELECT dropIfExists('VIEW', 'opportunity_characteristic', 'xm');
*/
SELECT dropIfExists('VIEW', 'opportunity', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity AS

SELECT 	ophead_id 			AS id,
	ophead_crmacct_id 		AS account,
	ophead_amount 			AS amount,
	ophead_cntct_id 		AS contact,
	ophead_curr_id 			AS currency,
	ophead_probability_prcnt 	AS probability,
	ophead_opsource_id 		AS source,
	ophead_opstage_id 		AS stage,
	ophead_optype_id 		AS "type",
	ophead_assigned_date     	AS assign_date,
	ophead_username			AS assign_to,
	ophead_actual_date		AS complete_date,
	ophead_target_date		AS due_date,
	ophead_active			AS is_active,
	ophead_name			AS "name",
	ophead_notes			AS notes,
	ophead_owner_username		AS "owner",
	ophead_priority_id 		AS priority,
	ophead_start_date		AS start_date,
	ophead_number		    	AS "number",
        RTRIM(LTRIM(ARRAY(
          SELECT charass_id 
            FROM charass
           WHERE charass_target_id = ophead_id
             AND charass_target_type = 'OPP')::TEXT,'{'),'}') AS characteristics,
        RTRIM(LTRIM(ARRAY(
          SELECT comment_id
            FROM comment
           WHERE comment_source_id = ophead_id
	         AND comment_source = 'OPP')::TEXT,'{'),'}') AS comments,
	RTRIM(LTRIM(ARRAY(
    	  SELECT docass_id 
	    FROM docass
	   WHERE docass_target_id = ophead_id 
	     AND docass_target_type = 'OPP'
	   UNION ALL
	  SELECT docass_id 
	    FROM docass
	   WHERE docass_source_id = ophead_id 
	     AND docass_source_type = 'OPP'
	   UNION ALL
	  SELECT imageass_id 
	    FROM imageass
	   WHERE imageass_source_id = ophead_id 
	     AND imageass_source = 'OPP')::TEXT,'{'),'}') AS documents	
  FROM ophead;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity
  DO INSTEAD

INSERT INTO ophead (
  ophead_id,
  ophead_crmacct_id,
  ophead_amount,
  ophead_cntct_id,
  ophead_curr_id,
  ophead_probability_prcnt,
  ophead_opsource_id,
  ophead_opstage_id,
  ophead_optype_id,
  ophead_assigned_date,
  ophead_username,
  ophead_actual_date,
  ophead_target_date,
  ophead_active,
  ophead_name,
  ophead_notes,
  ophead_owner_username,
  ophead_priority_id,
  ophead_start_date,
  ophead_number)
VALUES (
  new.id,
  new.account,
  new.amount,
  new.contact,
  new.currency,
  new.probability,
  new.source,
  new.stage,
  new.type,
  new.assign_date,
  new.assign_to,
  new.complete_date,
  new.due_date,
  new.is_active,
  new.name,
  new.notes,
  new.owner,
  new.priority,
  new.start_date,
  new.number);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity
  DO INSTEAD

UPDATE ophead 
   SET  ophead_crmacct_id 		= new.account,
        ophead_amount 			= new.amount,
	ophead_cntct_id 		= new.contact,
	ophead_curr_id 			= new.currency,
	ophead_probability_prcnt 	= new.probability,
	ophead_opsource_id 		= new.source,
	ophead_opstage_id 		= new.stage,
	ophead_optype_id 		= new.type,
	ophead_assigned_date		= new.assign_date,
	ophead_username	 		= new.assign_to,
	ophead_actual_date	    	= new.complete_date,
	ophead_target_date	    	= new.due_date,
	ophead_active	   		= new.is_active,
	ophead_name	   		= new.name,
	ophead_notes	   		= new.notes,
	ophead_owner_username		= new.owner,
	ophead_priority_id  		= new.priority,
	ophead_start_date	   	= new.start_date
 WHERE ophead_id 			= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity
  DO INSTEAD (

DELETE FROM comment
 WHERE ( comment_source_id = old.id 
   AND comment_source = 'OPP' );

DELETE FROM charass
 WHERE ( charass_target_id = old.id ) 
   AND ( charass_target_type = 'OPP' );

DELETE FROM docass
 WHERE ( docass_target_id = old.id ) 
   AND ( docass_target_type = 'OPP' );

DELETE FROM docass
 WHERE ( docass_source_id = old.id ) 
   AND ( docass_source_type = 'OPP' );

DELETE FROM imageass
 WHERE ( imageass_source_id = old.id ) 
   AND ( imageass_source = 'OPP' );

DELETE FROM ophead
 WHERE ( ophead_id = old.id );
)