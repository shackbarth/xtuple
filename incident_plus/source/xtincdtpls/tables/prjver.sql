-- table definition

select xt.create_table('prjver', 'xtincdtpls');
select xt.add_column('prjver','prjver_id', 'serial', null, 'xtincdtpls');
select xt.add_column('prjver','prjver_prj_id', 'integer', null, 'xtincdtpls');
select xt.add_column('prjver','prjver_version', 'text', null, 'xtincdtpls');
select xt.add_primary_key('prjver', 'prjver_id', 'xtincdtpls');
select xt.add_constraint('prjver', 'prjver_prjver_prj_id_fkey', 'foreign key (prjver_prj_id) references prj (prj_id) on delete cascade', 'xtincdtpls');


comment on table xtincdtpls.prjver is 'Extend project table with version numbers';
