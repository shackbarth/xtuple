select dropIfExists('TRIGGER', 'incident_sync_char_to_charroleass', 'public');
create trigger incident_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.incident_sync_char_to_charroleass();
