SELECT dropIfExists('VIEW', 'opportunity_type', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_type AS

SELECT optype_id 		AS id,
       optype_name		AS "name",
       optype_descrip		AS description
  FROM optype;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_type
  DO INSTEAD

INSERT INTO optype (
  optype_id,
  optype_name,
  optype_descrip)
VALUES (
  new.id,
  new.name,
  new.description);

-- udate rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_type
  DO INSTEAD

UPDATE optype
   SET optype_name		= new.name,
       optype_descrip		= new.description
 WHERE optype_id 		= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_type
  DO INSTEAD

DELETE FROM optype
 WHERE optype_id = old.id;