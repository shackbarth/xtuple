-- table definition

select private.create_table('nested');
select private.add_column('nested','nested_id', 'serial', 'primary key');
select private.add_column('nested','nested_model_id', 'integer', 'not null unique references private.model (model_id) on delete cascade ');

comment on table private.model is 'xTuple Nested Models';
