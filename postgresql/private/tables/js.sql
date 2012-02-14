-- table definition

select private.create_table('js');
select private.add_column('js','js_id', 'serial', 'primary key');
select private.add_column('js','js_namespace', 'text', E'not null');
select private.add_column('js','js_type', 'text', 'not null');
select private.add_column('js','js_context', 'text', 'not null');
select private.add_column('js','js_require', 'text', 'not null');
select private.add_column('js','js_ext', 'bool', 'not null default false');
select private.add_column('js','js_active', 'boolean', 'not null default true');
select private.add_constraint('js','js_js_namespace_js_type_js_context', 'unique(js_namespace, js_type, js_context)');

comment on table private.js is 'Core table for xTuple Javascript Objects Reference';
