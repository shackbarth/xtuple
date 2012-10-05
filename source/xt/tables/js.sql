-- table definition

select xt.create_table('js');
select xt.add_column('js','js_id', 'serial', 'primary key');
select xt.add_column('js','js_text', 'text', 'not null');
select xt.add_column('js','js_namespace', 'text', E'not null');
select xt.add_column('js','js_type', 'text', 'not null');
select xt.add_column('js','js_context', 'text', 'not null');
select xt.add_column('js','js_ext', 'bool', 'not null default false');
select xt.add_column('js','js_active', 'boolean', 'not null default true');
select xt.add_constraint('js','js_js_namespace_js_type_js_context', 'unique(js_namespace, js_type, js_context)');

comment on table xt.js is 'Core table for xTuple JavaScript Objects Reference';
