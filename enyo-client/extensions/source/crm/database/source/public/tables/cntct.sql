-- Share Users Cache trigger.
drop trigger if exists cntct_share_users_cache on cntct;
create trigger cntct_share_users_cache after insert or update or delete on cntct for each row execute procedure xt.refresh_cntct_share_users_cache();
