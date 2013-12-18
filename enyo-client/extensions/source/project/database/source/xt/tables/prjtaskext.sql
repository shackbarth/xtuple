select xt.create_table('prjtaskext');

select xt.add_column('prjtaskext','prjtaskext_id', 'integer', 'primary key');
select xt.add_column('prjtaskext','prjtaskext_priority_id', 'integer', 'references incdtpriority (incdtpriority_id)');
select xt.add_column('prjtaskext','prjtaskext_pct_complete', 'numeric');

comment on table xt.prjtaskext is 'Project extension table';

insert into xt.prjtaskext
select prjtask_id, null, case when prjtask_status = 'C' then 1 else 0 end
from prjtask
where not exists (
  select prjtaskext_id 
  from xt.prjtaskext 
  where prjtask_id=prjtaskext_id
);
