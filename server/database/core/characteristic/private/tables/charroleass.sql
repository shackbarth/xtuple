-- table definition

select private.create_table('charroleass');
select private.add_column('charroleass', 'charroleass_id', 'serial', 'primary key');
select private.add_column('charroleass', 'charroleass_char_id', 'integer', 'not null');
select private.add_column('charroleass', 'charroleass_charrole_id', 'integer', 'not null references private.charrole (charrole_id)');
select private.add_constraint('charroleass', 'charroleass_char_id_charroleass_charrole_id_key', 'unique (charroleass_char_id, charroleass_charrole_id)');

