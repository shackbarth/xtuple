-- table definition

select xt.create_table('incdtver', 'xtincdtpls');

-- remove old trigger if any
drop trigger if exists incdtvertrigger on xtincdtpls.incdtver;

select xt.add_column('incdtver','incdtver_id', 'serial', null, 'xtincdtpls');
select xt.add_column('incdtver','incdtver_incdt_id', 'integer', null, 'xtincdtpls');
select xt.add_column('incdtver','incdtver_found_prjver_id', 'integer', null, 'xtincdtpls');
select xt.add_column('incdtver','incdtver_fixed_prjver_id', 'integer', null, 'xtincdtpls');
select xt.add_primary_key('incdtver', 'incdtver_id', 'xtincdtpls');
select xt.add_constraint('incdtver', 'incdtver_incdtver_fixed_prjver_id_fkey', 'foreign key (incdtver_fixed_prjver_id) references xtincdtpls.prjver (prjver_id)', 'xtincdtpls');
select xt.add_constraint('incdtver', 'incdtver_incdtver_found_prjver_id_fkey', 'foreign key (incdtver_found_prjver_id) references xtincdtpls.prjver (prjver_id)', 'xtincdtpls');
select xt.add_constraint('incdtver', 'incdtver_incdtver_incdt_id_fkey', 'foreign key (incdtver_incdt_id) references incdt (incdt_id)', 'xtincdtpls');

comment on table xtincdtpls.prjver is 'Extend incident table with found and fixed in version numbers';

-- create trigger
create trigger incdtvertrigger after insert or update on xtincdtpls.incdtver for each row execute procedure xtincdtpls._incdtvertrigger();
