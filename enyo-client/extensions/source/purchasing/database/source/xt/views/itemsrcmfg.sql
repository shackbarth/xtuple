select xt.create_view('xt.itemsrcmfg', $$

select itemsrc_manuf_name from itemsrc where length(trim(itemsrc_manuf_name)) > 0;

$$);

