SELECT dropIfExists('VIEW', 'item_substitute', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_substitute AS

SELECT	itemsub_id 			AS id,
	itemsub_parent_item_id 		AS root_item,
	itemsub_sub_item_id 		AS substitute_item,
	itemsub_uomratio 		AS conversion_ratio,
	itemsub_rank 			AS rank
  FROM	itemsub;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_substitute
  DO INSTEAD

INSERT INTO itemsub (
  itemsub_id,
  itemsub_parent_item_id,
  itemsub_sub_item_id,
  itemsub_uomratio,
  itemsub_rank)
VALUES (
  new.id,
  new.root_item,
  new.substitute_item,
  new.conversion_ratio,
  new.rank);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_substitute
  DO INSTEAD

UPDATE 	itemsub 
   SET	itemsub_sub_item_id 	= new.substitute_item,
	itemsub_uomratio	= new.conversion_ratio,
	itemsub_rank		= new.rank
 WHERE	itemsub_id = old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_substitute
  DO INSTEAD (

DELETE FROM itemsub
 WHERE (itemsub_id = old.id);

)