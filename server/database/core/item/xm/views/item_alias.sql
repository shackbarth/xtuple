select private.create_model(

-- Model name, schema, table

'item_alias', 'public', 'itemalias',

-- Columns

E'{
  "itemalias.itemalias_id as id",
  "itemalias.itemalias_item_id as item",
  "itemalias.itemalias_number  as \\"number\\"",
  "itemalias.itemalias_usedescrip as use_description",
  "itemalias.itemalias_descrip1 as description1",
  "itemalias.itemalias_descrip2 as description2",
  "itemalias.itemalias_comments as notes"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_alias
  do instead

insert into itemalias (
  itemalias_id,
  itemalias_item_id,
  itemalias_number,
  itemalias_usedescrip,
  itemalias_descrip1,
  itemalias_descrip2,
  itemalias_comments )
values (
  new.id,
  new.item,
  new.number,
  new.use_description,
  new.description1,
  new.description2,
  new.notes );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_alias
  do instead

update itemalias set
  itemalias_usedescrip = new.use_description,
  itemalias_descrip1 = new.description1,
  itemalias_descrip2 = new.description2,
  itemalias_comments = new.notes
where ( itemalias_id = old.id );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.item_alias
  do instead

delete from itemalias
where (itemalias_id = old.id);

"}',

-- Conditions, Comment, System

'{}', 'Item Alias Model', true);
