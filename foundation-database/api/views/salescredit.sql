SELECT dropIfExists('VIEW', 'salescredit', 'api');

CREATE OR REPLACE VIEW api.salescredit AS 
 SELECT custinfo.cust_number AS customer_number, aropen.aropen_docnumber AS cm_number, cohead.cohead_number AS so_number,
        aropenalloc.aropenalloc_amount::numeric(16,4) AS amount, curr.curr_abbr AS currency
   FROM aropenalloc
   LEFT JOIN aropen ON aropen.aropen_id = aropenalloc.aropenalloc_aropen_id
   LEFT JOIN custinfo ON custinfo.cust_id = aropen.aropen_cust_id
   LEFT JOIN cohead ON aropenalloc.aropenalloc_doctype='S' AND cohead.cohead_id = aropenalloc.aropenalloc_doc_id
   LEFT JOIN curr_symbol curr ON curr.curr_id = aropenalloc.aropenalloc_curr_id
 WHERE (aropenalloc_doctype='S');

GRANT ALL ON TABLE api.salescredit TO xtrole;
COMMENT ON VIEW api.salescredit IS 'Payments (credit memos) pre-applied to sales orders';

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.salescredit DO INSTEAD
    INSERT INTO aropenalloc VALUES ( 
    getaropenid( new.customer_number, 'C', new.cm_number ),
    'S', getcoheadid(new.so_number),
    new.amount, getcurrid(new.currency) );
