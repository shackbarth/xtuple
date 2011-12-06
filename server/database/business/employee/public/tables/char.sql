select dropIfExists('TRIGGER', 'employee_sync_char_to_charroleass', 'public');
create trigger employee_sync_char_to_charroleass after insert or update on public.char for each row execute procedure private.employee_sync_char_to_charroleass();
