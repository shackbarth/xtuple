insert into xm.account (
  id, "number", name, is_active, "type", owner, parent, notes, primary_contact, secondary_contact, "user")
values (
  99999, 'TEST NUMBER', 'TEST NAME', true, 'O', 'admin', NULL, 'TEST NOTES', 1, 6, 'admin');

insert into xm.account_comment (
  id, account, "date", username, comment_type, text, is_public)
values (
  99999, 99999, now(), 'admin', 1, 'TESTING ACCOUNT_COMMNET INSERT', true);

insert into xm.account_characteristic (
  id, account, characteristic, value)
values (
  99999, 99999, 16, 'TEST XM.ACCOUNT_CHARACTERISTIC VIEW INSERT');

insert into xm.account_document (
  id, account, target, target_type, purpose)
values (
  99999, 99999, (select incdt_id from incdt where incdt_number = '15000'), private.get_id('datatype', 'datatype_source', 'INCDT'),  'S');

insert into xm.account_document (
  id, account, target, target_type, purpose )
values (
  99998, 99999, (select file_id from file where file_title = 'Project Contract'), private.get_id('datatype', 'datatype_source', 'FILE'), 'S' );

insert into xm.account_document (
  id, account, target, target_type, purpose)
values (
  99997, 99999, (select min(image_id) from image), (select private.get_id('datatype', 'datatype_name', 'Image')), 'S');

select * from xm.account where id = 99999;

select * from xm.account_comment where id = 99999;

select * from xm.account_characteristic where id = 99999;

select * from xm.account_document where id in (99999,99998,99997);

update xm.account set
  "number" = '**UPDATED NUMBER**',
  name = '**UPDATED NAME**',
  is_active = false,
  "type" = 'I',
  owner = 'web',
  parent = 1,
  notes = '**UPDATED NOTES**',
  primary_contact = 2,
  secondary_contact = 7,
  "user" = null
where id = 99999;

update xm.account_comment set
  text = '**TESTING ACCOUNT_COMMENT UPDATE**',
  is_public = false;

update xm.account_characteristic set
  characteristic = 12,
  value = '**TEST XM.ACCOUNT_CHARACTERISTIC UPDATE**';

-- the xm.account.user field must be null
delete from xm.account
where id = 99999;

-- should do nothing
delete from xm.account_comment
where id = 99999;

delete from xm.account_characteristic
where id = 99999;

delete from xm.account_document
where id in (99999,99998,99997);

