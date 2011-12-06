SELECT dropIfExists('VIEW', 'opportunity_comment', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_comment AS

SELECT comment_id 			AS id,
	   comment_source_id 	AS opportunity,
	   comment_date 		AS "date",
	   comment_user 		AS user,
	   comment_cmnttype_id 	AS comment_type,
	   comment_text 		AS "text",
	   comment_public 		AS is_public
	   -- comment_update    AS can_update - value derived from role(s), privileges, etc...(not implemented yet))
  FROM comment
 WHERE ( comment_source = 'OPP' );

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_comment
  DO INSTEAD

INSERT INTO comment (
  comment_id,
  comment_source_id,
  comment_source,
  comment_date,
  comment_user,
  comment_cmnttype_id,
  comment_text,
  comment_public)
VALUES(
  new.id,
  new.opportunity,
  'OPP',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_comment
  DO INSTEAD

UPDATE comment
   SET comment_text = new.text
 WHERE ( comment_id = old.id );

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_comment
  DO INSTEAD NOTHING;