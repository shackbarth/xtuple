
insert into xt.wftype (wftype_tblname, wftype_code, wftype_src_tblname) 
select 'powf', 'PO', 'potypewf'
where not exists (select * from xt.wftype where wftype_tblname = 'powf');
