insert into xt.acttype (acttype_tblname, acttype_code) 
select 'coheadwf', 'SalesOrderWorkflow'
where not exists (select * from xt.acttype where acttype_tblname = 'coheadwf');
