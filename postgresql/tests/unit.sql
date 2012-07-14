insert into xm.unit (
  id, name, description, is_item_weight )
values (
  99999, 'KILO', 'Kilograms', false
);

insert into xm.unit_conversion (
  id, from_unit, from_value, to_unit, to_value )
values (
  99999, 99999, 1, (select uom_id from uom where uom_name = 'LB'), 2.20462262);

select * from xm.unit;
select * from xm.unit_conversion;

update xm.unit set
  name = 'N',
  description = 'Newtons'
where id = 99999;

update xm.unit_conversion set
  to_value=0.224808942443
where id = 99999;

delete from xm.unit where id = 99999;
