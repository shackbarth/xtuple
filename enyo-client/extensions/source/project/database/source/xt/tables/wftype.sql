
insert into xt.wftype (wftype_tblname, wftype_code) 
select 'prjwf', 'PRJ'
where not exists (select * from xt.wftype where wftype_tblname = 'prj');
