-- incident 23507:change how qoh, qoh available, and qoh netable are determined
do $$
begin
if fetchMetricText('ServerVersion') < '4.7.0' then
  update itemsite set itemsite_qtyonhand=(itemsite_qtyonhand + itemsite_nnqoh);
  alter table itemsite drop column itemsite_nnqoh cascade;
end if;
end$$;