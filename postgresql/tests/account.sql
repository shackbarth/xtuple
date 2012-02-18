insert into xm.account (
  guid, "number", name, is_active, "type", owner, parent, notes, primary_contact, secondary_contact)
values (
  99999, 'TEST NUMBER', 'TEST NAME', true, 'O', (select user_account_info from xm.user_account_info where username='admin'), NULL, 'TEST NOTES', 
    (select contact_info from xm.contact_info where guid =1), (select contact_info from xm.contact_info where guid =6));

insert into xm.account_comment (
  guid, account, "date", username, comment_type, text, is_public)
values (
  99999, 99999, now(), 'postgres', (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'), 'TESTING ACCOUNT_COMMNET INSERT', true);

insert into xm.account_characteristic (
  guid, account, characteristic, value)
values (
  99999, 99999, (select characteristic from xm.characteristic where guid=16), 'TEST XM.ACCOUNT_CHARACTERISTIC VIEW INSERT');

insert into xm.item_assignment (
  guid, source, source_type, item, purpose)
values (
  99999, 99999, 'CRMA', (select item_info from xm.item_info where number = 'BTRUCK1'), 'S');

insert into xm.contact_assignment (
  guid, source, source_type, contact, purpose)
values (
  99998, 99999, 'CRMA', (select contact_info from xm.contact_info where guid = 2), 'S');
  
insert into xm.image_assignment (
  guid, source, source_type, image, purpose)
values (
  99997, 99999, 'CRMA', (select image_info from xm.image_info order by guid limit 1), 'S');

select * from xm.account where guid = 99999;

select * from xm.account_comment where guid = 99999;

select * from xm.account_characteristic where guid = 99999;

select * from xt.docinfo where id in (99999,99998,99997);

select * from xm.account_info;

update xm.account set
  "number" = '**UPDATED NUMBER**',
  name = '**UPDATED NAME**',
  is_active = false,
  "type" = 'I',
  owner = null,
  parent = (select account_info from xm.account_info where guid=1),
  notes = '**UPDATED NOTES**',
  primary_contact = (select contact_info from xm.contact_info where guid=2),
  secondary_contact = (select contact_info from xm.contact_info where guid=7)
where guid = 99999;

update xm.account_comment set
  text = '**TESTING ACCOUNT_COMMENT UPDATE**',
  is_public = false
where guid = 99999;

update xm.account_characteristic set
  characteristic = (select characteristic from xm.characteristic where guid=12),
  value = '**TEST XM.ACCOUNT_CHARACTERISTIC UPDATE**';

-- the xm.account.user field must be null
delete from xm.account
where guid = 99999;

-- should do nothing
delete from xm.account_comment
where guid = 99999;

delete from xm.account_characteristic
where guid = 99999;


