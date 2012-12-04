-- remove old trigger if any
drop trigger if exists usrpriv_did_change on public.usrpriv;

delete from usrpriv where usrpriv_priv_id not in (select priv_id from public.priv);

-- create trigger
create trigger usrpriv_did_change after insert or delete on public.usrpriv for each row execute procedure xt.usrpriv_did_change();





