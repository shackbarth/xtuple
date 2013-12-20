
insert into xt.wftype (wftype_tblname, wftype_code) 
select 'powf', 'PO'
where not exists (select * from xt.wftype where wftype_tblname = 'powf');
