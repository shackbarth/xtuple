-- Put schema in path
-- TODO: This can be removed if and when these scripts are converted to a package
insert into schemaord (schemaord_name, schemaord_order) 
select 'xt', 0
where not exists (
  select * 
  from schemaord 
  where schemaord_name='xt');