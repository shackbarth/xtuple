--ALTER TABLE location ADD COLUMN location_formatname TEXT;
--CREATE INDEX location_location_formatname_idx on location using btree (location_formatname);

--UPDATE location SET location_formatname=formatLocationName(location_id);


select xt.add_column('location','location_formatname', 'TEXT', NULL, 'public');
select xt.add_index('location', 'location_formatname','location_location_formatname_idx', 'btree', 'public');
UPDATE location SET location_formatname=formatLocationName(location_id) WHERE location_formatname IS NULL;

