-- incident 23507:change how qoh, qoh available, and qoh netable are determined
do $$
begin
if fetchMetricText('ServerVersion') < '4.7.0' then
  update itemsite set itemsite_qtyonhand=(itemsite_qtyonhand + itemsite_nnqoh);
  -- drop column itemsite_nnqoh ???
  update itemsite set itemsite_nnqoh=0;
end if;
end$$;