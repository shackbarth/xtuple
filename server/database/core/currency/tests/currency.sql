insert into xm.currency (
  id, name, symbol, abbreviation, is_base )
values (
  99999, 'Zingos', 'Z', 'ZGS', false
);

insert into xm.currency_rate (
  id, currency, rate, effective, expires )
values (
  99999, 99999, 2, current_date - 100, current_date + 100);

select * from xm.currency;
select * from xm.currency_rate;

update xm.currency set
  name = 'Dingos',
  symbol = 'D',
  abbreviation = 'DGS'
where id = 99999;

update xm.currency_rate set
  rate = 1.5,
  effective = current_date,
  expires = current_date + 365
where id = 99999;

delete from xm.currency where id = 99999;
