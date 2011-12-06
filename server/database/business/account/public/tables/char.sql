select dropIfExists('TRIGGER', 'account_sync_char_to_charroleass', 'public');
create trigger account_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.account_sync_char_to_charroleass();
