-- remove old trigger if any
drop trigger if exists usrpref_did_change on public.usrpref;

-- create trigger
create trigger usrpref_did_change after insert or update on public.usrpref for each row execute procedure xt.usrpref_did_change();





