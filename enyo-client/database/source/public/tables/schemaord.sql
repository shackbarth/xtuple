-- Put schema in path
delete from schemaord where schemaord_name in ('xt','pg_catalog');
insert into schemaord (schemaord_name, schemaord_order) values ('xt', 50);
-- This is so we can over-ride the pg_advisory_unlock function. For that to work on gui client pg_catalog has to be last.
insert into schemaord (schemaord_name, schemaord_order) values ('pg_catalog', 999);