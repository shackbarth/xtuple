-- Put schema in path
delete from schemaord where schemaord_name in ('xc','xt');
insert into schemaord (schemaord_name, schemaord_order) values ('xc', 25);
insert into schemaord (schemaord_name, schemaord_order) values ('xt', 50);