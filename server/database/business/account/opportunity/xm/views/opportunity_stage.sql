SELECT dropIfExists('VIEW', 'opportunity_stage', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_stage AS

SELECT opstage_id 		AS id,
       opstage_name		AS "name",
       opstage_descrip		AS description,
       opstage_opinactive	AS deactivate
  FROM opstage;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_stage
  DO INSTEAD

INSERT INTO opstage (
  opstage_id,
  opstage_name,
  opstage_descrip,
  opstage_opinactive)
VALUES (
  new.id,
  new.name,
  new.description,
  new.deactivate);

-- udate rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_stage
  DO INSTEAD

UPDATE opstage
   SET opstage_name		= new.name,
       opstage_descrip		= new.description,
       opstage_opinactive	= new.deactivate
 WHERE opstage_id 		= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_stage
  DO INSTEAD

DELETE FROM opstage
 WHERE opstage_id = old.id;