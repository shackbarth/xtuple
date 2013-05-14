-- remove old trigger if any
drop trigger if exists usr_did_change on public.usr;

-- create trigger
create trigger usr_did_change after insert or update on public.usr for each row execute procedure xt.usr_did_change();





