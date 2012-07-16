insert into xm.country (
  id, abbreviation, "name", currency_abbreviation, currency_name, currency_number, currency_symbol )
values (
  99999, 'KS', 'Kerplekestan', 'TZS',  'Tanzanian Shilling', 834, '' );

insert into xm.state (
  id, "name", abbreviation, country )
values (
  99999, 'Odenstan', 'OS', 99999  );
  
insert into xm.address (
  id, number, is_active, line1, line2, line3, city, state, postalcode, country )
values (
  99999, '99999', true, '15123 206th NE. Ave.', '', '', 'Woodinville', 'WA','98072','United States' );

insert into xm.address_comment (
  id, address, date, username, comment_type, text, is_public )
values (
  99999, 99999, now(), current_user, (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'), 'Foo.', false );

insert into xm.address_characteristic (
  id, address, characteristic, value )
values (
  99999, 99999, (select characteristic from xm.characteristic where name = 'ADR-STOP'), 'Yes' );

select * from xm.address where id = 99999;
select * from xm.address_comment where id = 99999;
select * from xm.address_characteristic where id = 99999;

update xm.address set
  line1 = '867 Justice Drive',
  line2 = 'Apt 10C',
  line3 = '',
  city = 'Chesapeake',
  state = 'VA',
  postalcode = '23322'
where id = 99999;

update xm.address_comment set
  text = 'Foobar.'
where id = 99999;

update xm.address_characteristic set
  value = 'Foobar.'
where id = 99999;

select * from xm.address where id = 99999;
select * from xm.address_comment where id = 99999;
select * from xm.address_characteristic where id = 99999;

delete from xm.address where id = 99999;
delete from xm.state where id = 99999;
delete from xm.country where id = 99999;

select * from xm.address where id = 99999;
select * from xm.address_comment where id = 99999;
select * from xm.address_characteristic where id = 99999;







  
  
