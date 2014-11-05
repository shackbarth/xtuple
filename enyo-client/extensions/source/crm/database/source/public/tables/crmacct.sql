-- Share Users Cache trigger.
drop trigger if exists crmacct_share_users_cache on crmacct;
create trigger crmacct_share_users_cache after insert or update or delete on crmacct for each row execute procedure xt.refresh_crmacct_share_users_cache();
