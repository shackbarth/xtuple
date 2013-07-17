-- trigger
drop trigger if exists prjtask_owner_change on prjtask;
create trigger prjtask_owner_change after insert on prjtask for each row execute procedure xt.owner_record_did_change();
