-- table definition

select private.create_table('crmacctroleass');
select private.add_column('crmacctroleass', 'crmacctroleass_id', 'serial', 'primary key');
select private.add_column('crmacctroleass', 'crmacctroleass_crmacct_id', 'integer', 'not null');
select private.add_column('crmacctroleass', 'crmacctroleass_crmacctrole_id', 'integer', 'not null references private.crmacctrole (crmacctrole_id)');
select private.add_constraint('crmacctroleass', 'crmacctroleass_crmacct_id_crmacctroleass_crmacctrole_id_key', 'unique (crmacctroleass_crmacct_id, crmacctroleass_crmacctrole_id)');

-- remove old trigger if any

select dropIfExists('TRIGGER', 'user_sync_crmacctroleass_to_crmacct', 'private');

-- populate current data

insert into private.crmacctroleass (crmacctroleass_crmacct_id, crmacctroleass_crmacctrole_id, crmacctroleass_target_id)
select * from (
select
  crmacct_id,
  crmacctrole_id,
  usr_id
from crmacct
  join usr on crmacct_usr_username = usr_username, 
  private.crmacctrole
  join private.datatype on crmacctrole_datatype_id=datatype_id
where ( crmacct_usr_username is not null)
 and (datatype_name ='User')
 ) data
where not exists (
  select * 
  from private.crmacctroleass
  where (crmacctroleass_crmacct_id=crmacct_id)
   and (crmacctroleass_crmacctrole_id=crmacctrole_id)
);

-- create trigger

create trigger user_sync_crmacctroleass_to_crmacct after insert or update or delete on private.crmacctroleass for each row execute procedure private.user_sync_crmacctroleass_to_crmacct();
