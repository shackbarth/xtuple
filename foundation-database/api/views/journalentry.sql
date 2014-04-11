-- Simple Journal Entry
SELECT dropIfExists('VIEW', 'journalentry', 'api');
CREATE VIEW api.journalentry AS 
   SELECT  
     curr_abbr AS currency,
     c.gltrans_amount AS amount,
     c.gltrans_date as dist_date,
     c.gltrans_docnumber as doc_number,
     formatglaccount(da.accnt_id) AS debit,
     formatglaccount(ca.accnt_id) AS credit,
     c.gltrans_notes AS notes
   FROM gltrans d, gltrans c, accnt da, accnt ca, curr_symbol
   WHERE ((d.gltrans_sequence=c.gltrans_sequence)
   AND (d.gltrans_accnt_id=da.accnt_id)
   AND (c.gltrans_accnt_id=ca.accnt_id)
   AND (d.gltrans_amount < 0)
   AND (c.gltrans_amount > 0)
   AND (d.gltrans_doctype='JE')
   AND (c.gltrans_doctype='JE')
   AND (curr_id=basecurrid()))
   ORDER BY d.gltrans_date DESC;

GRANT ALL ON TABLE api.journalentry TO xtrole;
COMMENT ON VIEW api.journalentry IS 'Journal Entry';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.journalentry DO INSTEAD

SELECT insertGLTransaction( 
     'G/L'::text,
     'JE'::text, 
     NEW.doc_number, 
     NEW.notes,
     getGlAccntId(NEW.credit),
     getGlAccntId(NEW.debit),
     -1,
     currtobase(getCurrId(NEW.currency),NEW.amount,NEW.dist_date),
     NEW.dist_date 
     );

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.journalentry DO INSTEAD

  NOTHING;
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.journalentry DO INSTEAD

  NOTHING;
