select xt.create_view('xt.itemsitedtl', $$
   select itemloc.*,  
     0 as distributed
   from itemloc
     join itemsite on itemsite_id = itemloc_itemsite_id;
$$);
