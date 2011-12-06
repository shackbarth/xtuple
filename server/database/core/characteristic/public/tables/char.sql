select dropIfExists('TRIGGER', 'core_sync_char_to_charroleass', 'public');
create trigger core_sync_char_to_charroleass after delete on public.char for each row execute procedure private.core_sync_char_to_charroleass();
