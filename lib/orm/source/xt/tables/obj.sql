-- table definition

select xt.create_table('obj');
select xt.add_column('obj','obj_uuid', 'text');

comment on table xt.js is 'Core table for xTuple Objects Reference';
