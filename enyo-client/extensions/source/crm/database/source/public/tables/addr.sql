-- Share Users Cache trigger.
drop trigger if exists addr_share_users_cache on addr;
create trigger addr_share_users_cache after insert or update or delete on addr for each row execute procedure xt.refresh_addr_share_users_cache();
