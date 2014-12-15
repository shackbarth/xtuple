-- Share Users Cache trigger.
drop trigger if exists invchead_share_users_cache on invchead;
create trigger invchead_share_users_cache after insert or update or delete on invchead for each row execute procedure xt.refresh_invchead_share_users_cache();
