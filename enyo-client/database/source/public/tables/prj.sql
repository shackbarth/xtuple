-- trigger
drop trigger if exists prj_owner_change on prj;
create trigger prj_owner_change after insert on prj for each row execute procedure xt.owner_record_did_change();
