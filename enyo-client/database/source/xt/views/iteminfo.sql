select xt.create_view('xt.iteminfo', $$
   select *,  
     stdcost(item_id) as std_cost,  
     iteminvpricerat(item_id) as inv_price_ratio  
   from item;
$$);
