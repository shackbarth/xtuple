select xt.create_view('xt.itemsiteinfo', $$
   select *,  
     xt.average_cost(itemsite_id) as avg_cost  
   from itemsite; ;
$$);
