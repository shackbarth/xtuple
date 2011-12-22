insert into xm.honorific (
  id, code )
values (
  99999, 'Sr'
);

insert into xm.address (
  id, number, is_active, line1, line2, line3, city, state, postalcode, country )
values (
  99999, '99999', true, '15123 206th NE. Ave.', '', '', 'Woodinville', 'WA','98072','United States' );

insert into xm.contact (
  id, number, is_active, honorific, first_name, middle_name, last_name, suffix,
  phone, alternate, fax, web_address, primary_email, 
  owner, notes, address )
values (
  99999, '99999', true, 'Mr.', 'John' , 'A', 'Doe', 'Jr.',
  '555-5656', '555-5555', '890-2345', 'www.xtuple.com', 'johnd@xm.ple.com', 
  current_user, 'Read my notes.', 99999 );

insert into xm.contact_comment (
  id, contact, date, username, comment_type, text, is_public )
values (
  99999, 99999, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'General'), 'Foo.', false );

insert into xm.contact_characteristic (
  id, contact, characteristic, value )
values (
  99999, 99999, (select char_id from char where char_name = 'ADR-STOP'), 'Yes' );

insert into xm.contact_document (
  id, contact, target, target_type, purpose )
values (
  99999, 99999, (select incdt_id from incdt where incdt_number = '15000'), private.get_id('datatype', 'datatype_source', 'INCDT'), 'S' );

insert into xm.file (
  id, name, data )
values (
  99999, 'now.txt', 'Now is the time...' );

insert into xm.contact_document (
  id, contact, target, target_type, purpose )
values (
  99998, 99999, (select file_id from file where file_title = 'now.txt'), private.get_id('datatype', 'datatype_source', 'FILE'), 'S' );

select * from xm.honorific;
select * from xm.contact where id = 99999;
select * from xm.contact_comment where id = 99999;
select * from xm.contact_characteristic where id = 99999;

update xm.honorific set
  code = 'Sr.'
where ( id = 99999 );

update xm.contact set
  honorific = 'Ms.',
  first_name = 'Jane',
  last_name = 'Doenut',
  suffix = ''
where id = 99999;

update xm.contact_comment set
  text = 'Foobar.'
where id = 99999;

update xm.contact_characteristic set
  value = 'Foobar.'
where id = 99999;

select * from xm.contact where id = 99999;
select * from xm.contact_comment where id = 99999;
select * from xm.contact_characteristic where id = 99999;
select * from xm.contact_document where id in (99998,99999);

delete from xm.honorific where id = 99999;
delete from xm.contact where id = 99999;
delete from xm.file where id = 99999;
delete from xm.address where id = 99999;

select * from xm.address where id = 99999;
select * from xm.address_comment where id = 99999;
select * from xm.address_characteristic where id = 99999;

---------- TEST FOR MODEL EXTENSIONS ---------

select private.extend_model(
-- Context, name, schema, table, join type, join clause
'test', 'contact','public','cntct test','join','cntct.cntct_id=test.cntct_id',
-- columns
'{"test.cntct_crmacct_id as account"}',
-- rules
'{"

-- insert rule

create or replace rule _insert_test as on insert to xm.contact 
  do instead

update cntct set
  cntct_crmacct_id = new.account
where ( cntct_id = new.id );

-- update rule

create or replace rule _update_test as on update to xm.contact 
  do instead

update cntct set
  cntct_crmacct_id = new.account
where ( cntct_id = old.id );

"}', 
-- conditions, comment, sequence, system
'{}', 'Extended by TEST', 50, true);

select * from private.modelext;
select * from xm.contact;

update xm.contact set account = getCrmAcctId('TTOYS') where first_name = 'Jed' and last_name = 'Hastings';
select * from xm.contact;
insert into xm.contact(id, number, first_name, last_name, account) values (9999, 9999, 'Bradly', 'Johnson', getCrmAcctId('TTOYS'));
select * from xm.contact;

update xm.contact set account = null where first_name = 'Jed' and last_name = 'Hastings';
delete from xm.contact where id = 9999;
select * from xm.contact;

update private.modelext set model_active = false where modelext_context = 'test' and model_name='contact';
update xm.contact set account = null where first_name = 'Jed' and last_name = 'Hastings'; -- should error
delete from private.modelext where modelext_context = 'test' and model_name='contact';
select * from xm.contact;








  
  
