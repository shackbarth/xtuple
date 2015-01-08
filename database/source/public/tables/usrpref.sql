-- remove old trigger if any

select dropIfExists('TRIGGER', 'usrpref_did_change');

-- create trigger

create trigger usrpref_did_change after insert or update on usrpref for each row execute procedure xt.usrpref_did_change();
