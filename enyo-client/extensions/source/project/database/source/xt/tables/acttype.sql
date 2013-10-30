insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prj', 'PRJ'
where not exists (select * from xt.acttype where acttype_tblname = 'prj');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prjtask', 'TASK'
where not exists (select * from xt.acttype where acttype_tblname = 'prjtask');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prjwf', 'WF'
where not exists (select * from xt.acttype where acttype_tblname = 'prjwf');
