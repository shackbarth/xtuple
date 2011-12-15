-- parent table for relationship type declarations
-- table definition

select private.create_table('rel');
select private.add_column('rel', 'rel_id', 'serial');
select private.add_column('rel', 'rel_datatype_id', 'integer');