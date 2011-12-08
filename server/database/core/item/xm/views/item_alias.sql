SELECT dropIfExists('VIEW', 'item_alias', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_alias AS

SELECT	itemalias_id 		AS id,
	itemalias_item_id 	AS item,
	itemalias_number 	AS "number",
	itemalias_usedescrip 	AS use_description,
	itemalias_descrip1 	AS description1,
	itemalias_descrip2 	AS description2,
	itemalias_comments 	AS notes
  FROM	itemalias;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_alias
  DO INSTEAD

INSERT INTO itemalias (
  itemalias_id,
  itemalias_item_id,
  itemalias_number,
  itemalias_usedescrip,
  itemalias_descrip1,
  itemalias_descrip2,
  itemalias_comments)
VALUES (
  new.id,
  new.item,
  new.number,
  new.use_description,
  new.description1,
  new.description2,
  new.notes);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_alias
  DO INSTEAD

UPDATE 	itemalias 
   SET	itemalias_usedescrip 	= new.use_description,
	itemalias_descrip1 	= new.description1,
	itemalias_descrip2 	= new.description2,
	itemalias_comments 	= new.notes
 WHERE	itemalias_id 		= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_alias
  DO INSTEAD (

DELETE FROM itemalias
 WHERE (itemalias_id = old.id);

)