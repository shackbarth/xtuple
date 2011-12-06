select dropIfExists('TRIGGER', 'contact_sync_char_to_charroleass', 'public');
create trigger contact_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.contact_sync_char_to_charroleass();
