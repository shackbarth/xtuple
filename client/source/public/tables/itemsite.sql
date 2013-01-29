-- remove old trigger if any
drop trigger if exists itemsite_did_change on public.itemsite;

-- create trigger
create trigger itemsite_did_change before insert on public.itemsite for each row execute procedure xt.itemsite_did_change();





