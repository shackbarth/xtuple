-- trigger
drop trigger if exists crmacct_owner_change on crmacct;
create trigger crmacct_owner_change after insert on crmacct for each row execute procedure xt.owner_record_did_change();
