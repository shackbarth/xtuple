insert into xm.characteristic (
  guid, name, characteristic_type, "order", notes, mask, validator, is_addresses )
values (
  99999, 'Referral Source', 2, 0, 'Referral Source Options', '', '', true
);

insert into xm.characteristic_option (
  guid, characteristic, "value", "order" )
values (
  99998, 99999, 'Google', 0
);

insert into xm.characteristic_option (
  guid, characteristic, "value", "order" )
values (
  99999, 99999, 'Friend', 0
);

select * from xm.characteristic;
select * from xm.characteristic_option;
select * from char;

update xm.characteristic set
  name = 'Lead Source',
  notes = 'lead Source'
where guid = 99999;
update char set char_customers = true where char_id in (19,20);
delete from xm.characteristic_option where guid = 99999;

delete from xm.characteristic where guid = 99999;

