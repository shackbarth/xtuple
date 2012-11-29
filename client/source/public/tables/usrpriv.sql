-- remove old trigger if any
drop trigger if exists usrpriv_did_change on public.usrpriv;

-- create trigger
create trigger usrpriv_did_change after insert or delete on public.usrpriv for each row execute procedure xt.usrpriv_did_change();





