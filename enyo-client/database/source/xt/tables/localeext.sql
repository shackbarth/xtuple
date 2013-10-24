select xt.create_table('localeext');

select xt.add_column('localeext','localeext_id', 'integer', 'primary key');
select xt.add_column('localeext','localeext_hours_scale', 'integer', 'default 2', 'xt');

comment on table xt.localeext is 'Extension of locale table';

insert into xt.localeext
select locale_id, 2
from locale
where not exists (
  select localeext_id 
  from xt.localeext 
  where localeext_id=locale_id
);

