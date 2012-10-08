-- table definition

select xt.create_table('incdtcatemlprofile');
select xt.add_column('incdtcatemlprofile','incdtcatemlprofile_incdtcat_id', 'integer', 'primary key');
select xt.add_column('incdtcatemlprofile','incdtcatemlprofile_incdtemlprofile_id', 'integer', 'references xt.incdtemlprofile (emlprofile_id)');

comment on table xt.incdtcatemlprofile is 'Core table links incident categories to incident email profiles';
