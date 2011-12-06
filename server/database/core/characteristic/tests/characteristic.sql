insert into xm.characteristic (
  id, name, characteristic_type, "order", notes, mask, validator )
values (
  99999, 'Referral Source', 2, 0, 'Referral Source Options', '', ''
);

insert into xm.characteristic_role_assignment (
  id, characteristic, characteristic_role )
values (
  99999, 99999, (select charrole_id from private.charrole join private.datatype on charrole_datatype_id = datatype_id where datatype_name = 'Address')
);

insert into xm.characteristic_role_assignment (
  id, characteristic, characteristic_role )
values (
  99998, 99999, (select charrole_id from private.charrole join private.datatype on charrole_datatype_id = datatype_id where datatype_name = 'Account')
);

insert into xm.characteristic_option (
  id, characteristic, "value", "order" )
values (
  99998, 99999, 'Google', 0
);

insert into xm.characteristic_option (
  id, characteristic, "value", "order" )
values (
  99999, 99999, 'Friend', 0
);

select * from xm.characteristic;
select * from xm.characteristic_role_assignment;
select * from xm.characteristic_option;
select * from char

update xm.characteristic set
  name = 'Lead Source',
  notes = 'lead Source'
where id = 99999;
update char set char_customers = true where char_id in (19,20)
delete from xm.characteristic_option where id = 99999;
delete from xm.characteristic_role_assignment where id = 99999;

delete from xm.characteristic where id = 99999;

insert into char (
  char_id, char_name, char_type, char_order, char_notes, char_mask, char_validator,
  char_addresses, char_crmaccounts, char_contacts, char_customers, char_incidents,
  char_employees, char_items, char_opportunity, char_lotserial)
values (
  99999, 'Referral Source', 2, 0, 'Referral Source Options', '', '',
  --true, false, false, false, false, false, false, false, false
  true, true, true, true, true, true, true, true, true
);

update char set
  char_addresses = false,
  char_crmaccounts = false,
  char_contacts = false,
  char_customers = false,
  char_incidents = false,
  char_employees = false,
  char_items = false,
  char_opportunity = false
where char_id = 99999;

update char set
  char_addresses = true,
  char_crmaccounts = true,
  char_contacts = true,
  char_customers = true,
  char_incidents = true,
  char_employees = true,
  char_items = true,
  char_opportunity = true
where char_id = 99999;

delete from char where char_id = 99999;
