-- trigger: incdt_after_delete_check_relass_trigger on incdt

create trigger incdt_after_delete_check_incdtrelass_trigger
  after delete
  on incdt
  for each row
  execute procedure private.incdtrelass_incdt_delete();