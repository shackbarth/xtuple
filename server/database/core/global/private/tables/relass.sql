-- parent table for relationship assignments
-- table definition

select private.create_table('relass');
select private.add_column('relass', 'relass_id', 'serial');
select private.add_column('relass', 'relass_source_id', 'integer');
select private.add_column('relass', 'relass_rel_id', 'integer');
select private.add_column('relass', 'relass_target_id','integer');