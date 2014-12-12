-- Share Users Cache trigger.
drop trigger if exists custinfo_share_users_cache on custinfo;
create trigger custinfo_share_users_cache after insert or update or delete on custinfo for each row execute procedure xt.refresh_custinfo_share_users_cache();
