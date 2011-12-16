select dropIfExists('VIEW', 'item_substitute', 'xm');

-- return rule

create or replace view xm.item_substitute as

select
  itemsub_id as id,
  itemsub_parent_item_id as root_item,
  itemsub_sub_item_id as substitute_item,
  itemsub_uomratio as conversion_ratio,
  itemsub_rank as rank
from itemsub;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.item_substitute
  do instead

insert into itemsub (
  itemsub_id,
  itemsub_parent_item_id,
  itemsub_sub_item_id,
  itemsub_uomratio,
  itemsub_rank )
values (
  new.id,
  new.root_item,
  new.substitute_item,
  new.conversion_ratio,
  new.rank );

-- update rule

create or replace rule "_UPDATE" as on update to xm.item_substitute
  do instead

update itemsub set
  itemsub_sub_item_id = new.substitute_item,
  itemsub_uomratio = new.conversion_ratio,
  itemsub_rank = new.rank
where ( itemsub_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.item_substitute
  do instead

delete from itemsub
where ( itemsub_id = old.id );
