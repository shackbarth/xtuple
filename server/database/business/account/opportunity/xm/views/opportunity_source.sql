SELECT dropIfExists('VIEW', 'opportunity_source', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_source AS

SELECT opsource_id 		AS id,
       opsource_name		AS "name",
       opsource_descrip		AS description
  FROM opsource;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_source
  DO INSTEAD

INSERT INTO opsource (
  opsource_id,
  opsource_name,
  opsource_descrip)
VALUES (
  new.id,
  new.name,
  new.description);

-- udate rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_source
  DO INSTEAD

UPDATE opsource
   SET opsource_name		= new.name,
       opsource_descrip		= new.description
 WHERE opsource_id 		= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_source
  DO INSTEAD

DELETE FROM opsource
 WHERE opsource_id = old.id;