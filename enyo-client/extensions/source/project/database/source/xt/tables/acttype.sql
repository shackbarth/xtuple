insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prj', 'Project'
where not exists (select * from xt.acttype where acttype_tblname = 'prj');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prjtask', 'ProjectTask'
where not exists (select * from xt.acttype where acttype_tblname = 'prjtask');

insert into xt.acttype (acttype_tblname, acttype_code) 
select 'prjwf', 'ProjectWorkflow'
where not exists (select * from xt.acttype where acttype_tblname = 'prjwf');