insert into xt.acttype (acttype_tblname, acttype_code) 
select 'todoitem', 'ToDo'
where not exists (select * from xt.acttype where acttype_tblname = 'todoitem');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'incdt', 'Incident'
where not exists (select * from xt.acttype where acttype_tblname = 'incdt');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'ophead', 'Opportunity'
where not exists (select * from xt.acttype where acttype_tblname = 'ophead');
