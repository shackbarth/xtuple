SELECT dropIfExists('FUNCTION', 'araging(date)', 'public');
SELECT dropIfExists('FUNCTION', 'araging(date, boolean)', 'public');
SELECT dropIfExists('FUNCTION', 'araging(date, boolean, boolean)', 'public');
SELECT dropIfExists('TYPE', 'araging', 'public');

CREATE TYPE araging AS (
  araging_docdate		 date,
  araging_duedate		 date,
  araging_ponumber		 text,
  araging_docnumber		 text,
  araging_doctype		 text,
  araging_cust_id		 integer,
  araging_cust_number		 text,
  araging_cust_name		 text,
  araging_cust_custtype_id	 integer,
  araging_custtype_code		 text,
  araging_terms_descrip		 text,
  araging_aropen_amount		 numeric,
  araging_cur_val		 numeric,
  araging_thirty_val		 numeric,
  araging_sixty_val		 numeric,
  araging_ninety_val		 numeric,
  araging_plus_val		 numeric,
  araging_total_val		 numeric
);
