select dropIfExists('TRIGGER', 'core_sync_crmacct_to_crmacctroleass', 'public');
create trigger core_sync_crmacct_to_crmacctroleass after insert or update on public.crmacct for each row execute procedure private.core_sync_crmacct_to_crmacctroleass();

select dropIfExists('TRIGGER', 'user_sync_crmacct_to_crmacctroleass', 'public');
create trigger user_sync_crmacct_to_crmacctroleass after insert or update on public.crmacct for each row execute procedure private.user_sync_crmacct_to_crmacctroleass();
