select xt.create_table('prjext');

select xt.add_column('prjext','prjext_id', 'integer', 'primary key');
select xt.add_column('prjext','prjext_dept_id', 'integer', 'references dept (dept_id)');
select xt.add_column('prjext','prjext_priority_id', 'integer', 'references incdtpriority (incdtpriority_id)');
select xt.add_column('prjext','prjext_pct_complete', 'numeric');

comment on table xt.prjext is 'Project extension table';

insert into xt.prjext
select prj_id, null, null, case when prj_status = 'C' then 1 else 0 end
from prj
where not exists (
  select prjext_id 
  from xt.prjext 
  where prj_id=prjext_id
);
