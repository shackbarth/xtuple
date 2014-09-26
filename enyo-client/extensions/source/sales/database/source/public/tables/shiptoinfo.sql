-- Share Users Cache trigger.
drop trigger if exists shiptoinfo_share_users_cache on shiptoinfo;
create trigger shiptoinfo_share_users_cache after insert or update or delete on shiptoinfo for each row execute procedure xt.refresh_shiptoinfo_share_users_cache();
