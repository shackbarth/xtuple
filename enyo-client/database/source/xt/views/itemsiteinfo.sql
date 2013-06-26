select xt.create_view('xt.itemsiteinfo', $$
   select *,  
     round(itemcost(itemsite_id), 6) as "unit_cost"
   from itemsite; ;
$$);
