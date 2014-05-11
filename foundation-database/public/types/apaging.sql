SELECT dropIfExists('FUNCTION', 'apaging(date)', 'public');
SELECT dropIfExists('FUNCTION', 'apaging(date,boolean)', 'public');
SELECT dropIfExists('TYPE', 'apaging', 'public');

CREATE TYPE apaging AS (
  apaging_docdate		text,
  apaging_duedate		date,
  apaging_ponumber		text,
  apaging_reference		text,
  apaging_invcnumber		text,
  apaging_docnumber		text,
  apaging_doctype		text,
  apaging_vend_id		integer,
  apaging_vend_number		text,
  apaging_vend_name		text,
  apaging_vend_vendtype_id	integer,
  apaging_vendtype_code		text,
  apaging_terms_descrip		text,
  apaging_apopen_amount		numeric,
  apaging_cur_val		numeric,
  apaging_thirty_val		numeric,
  apaging_sixty_val		numeric,
  apaging_ninety_val		numeric,
  apaging_plus_val		numeric,
  apaging_total_val		numeric,
  apaging_discdate		date,
  apaging_disc_val		numeric,
  apaging_discdays		numeric,
  apaging_discprcnt		numeric
);
