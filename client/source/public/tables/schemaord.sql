-- Put schema in path
delete from schemaord where schemaord_name in ('xt');
insert into schemaord (schemaord_name, schemaord_order) values ('xt', 50);