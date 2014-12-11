-- Share Users Cache trigger.
drop trigger if exists cohead_share_users_cache on cohead;
create trigger cohead_share_users_cache after insert or update or delete on cohead for each row execute procedure xt.refresh_cohead_share_users_cache();
