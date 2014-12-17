select xt.create_view('xt.remittoinfo', $$

  select remitto_name, 1 as remitto_id, 1 as remitto_key,
    formatAddr(remitto_address1, remitto_address2, remitto_address3, remitto_citystatezip, remitto_country) AS remitto_adr
  from remitto;

$$);