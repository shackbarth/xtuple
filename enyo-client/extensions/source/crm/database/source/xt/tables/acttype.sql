insert into xt.acttype (acttype_tblname, acttype_code) 
select 'todoitem', 'TODO'
where not exists (select * from xt.acttype where acttype_tblname = 'todoitem');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'incdt', 'INCDT'
where not exists (select * from xt.acttype where acttype_tblname = 'incdt');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'ophead', 'OPP'
where not exists (select * from xt.acttype where acttype_tblname = 'ophead');
