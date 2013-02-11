-- remove old trigger if any
drop trigger if exists grppriv_did_change on public.grppriv;

delete from grppriv where grppriv_priv_id not in (select priv_id from public.priv);

-- create trigger
create trigger grppriv_did_change after insert or delete on public.grppriv for each row execute procedure xt.grppriv_did_change();





