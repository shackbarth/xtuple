select xt.create_table('prjtypeext');

select xt.add_column('prjtypeext','prjtypeext_id', 'integer', 'primary key');
select xt.add_column('prjtypeext','prjtypeext_char', 'boolean');

comment on table xt.prjtypeext is 'Project type extension table';

insert into xt.prjtypeext
select prjtype_id, false
from prjtype
where not exists (
  select prjtypeext_id 
  from xt.prjtypeext 
  where prjtype_id=prjtypeext_id
);
