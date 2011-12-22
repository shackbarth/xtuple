select private.create_model(

-- Model name, schema, table

'language', 'public', 'lang',

-- Columns

E'{
  "lang_id as id",
  "lang_name as name",
  "lang_abbr2 as abbreviation_short",
  "lang_abbr3 as abbreviation_long"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.language
  do instead nothing;

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.language
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.language
  do instead nothing;

"}', 

-- Conditions, Comment, System

'{}', 'Language Model', true);
