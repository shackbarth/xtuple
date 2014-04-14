SELECT dropIfExists('VIEW', 'cashreceiptapplymisc', 'api');
CREATE OR REPLACE VIEW api.cashreceiptapplymisc AS
  SELECT
    cust_number::VARCHAR AS customer_number,
    CASE
      WHEN cashrcpt_fundstype='C' THEN
        'Check'::VARCHAR
      WHEN cashrcpt_fundstype='T' THEN
        'Certified Check'::VARCHAR
      WHEN cashrcpt_fundstype='M' THEN
        'Master Card'::VARCHAR
      WHEN cashrcpt_fundstype='V' THEN
        'Visa'::VARCHAR
      WHEN cashrcpt_fundstype='A' THEN
        'American Express'::VARCHAR
      WHEN cashrcpt_fundstype='D' THEN
        'Discover Card'::VARCHAR
      WHEN cashrcpt_fundstype='R' THEN
        'Other Credit Card'::VARCHAR
      WHEN cashrcpt_fundstype='K' THEN
        'Cash'::VARCHAR
      WHEN cashrcpt_fundstype='W' THEN
        'Wire Transfer'::VARCHAR
      WHEN cashrcpt_fundstype='O' THEN
        'Other'::VARCHAR
    END AS funds_type,
    cashrcpt_docnumber::VARCHAR AS check_document_number,
    formatGLAccount(accnt_id)::VARCHAR AS account,
    cust_name AS customer_name,
    addr_line1 AS customer_address,
    accnt_descrip AS account_description,
    curr_abbr AS currency,
    cashrcptmisc_amount AS amount_to_distribute,
    cashrcptmisc_notes AS notes
  FROM cashrcptmisc
    LEFT OUTER JOIN cashrcpt ON (cashrcpt_id=cashrcptmisc_cashrcpt_id)
    LEFT OUTER JOIN custinfo ON (cust_id=cashrcpt_cust_id)
    LEFT OUTER JOIN cntct mc ON (custinfo.cust_cntct_id = mc.cntct_id)
    LEFT OUTER JOIN addr m ON (mc.cntct_addr_id = m.addr_id)
    LEFT OUTER JOIN curr_symbol ON (curr_id=cashrcpt_curr_id)
    LEFT OUTER JOIN accnt ON (accnt_id=cashrcptmisc_accnt_id);
	
GRANT ALL ON TABLE api.cashreceiptapplymisc TO xtrole;
COMMENT ON VIEW api.cashreceiptapplymisc IS '
This view can be used as an interface to import Cash Receipt Miscellaneous Application
data directly into the system.  Required fields will be checked and default values
will be populated';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.cashreceiptapplymisc DO INSTEAD

  INSERT INTO cashrcptmisc (
    cashrcptmisc_cashrcpt_id,
    cashrcptmisc_accnt_id,
    cashrcptmisc_amount,
    cashrcptmisc_notes
    )
  VALUES (
    getCashrcptId(NEW.customer_number,
                  CASE
                    WHEN NEW.funds_type='Check' THEN
                      'C'
                    WHEN NEW.funds_type='Certified Check' THEN
                      'T'
                    WHEN NEW.funds_type='Master Card' THEN
                      'M'
                    WHEN NEW.funds_type='Visa' THEN
                      'V'
                    WHEN NEW.funds_type='American Express' THEN
                      'A'
                    WHEN NEW.funds_type='Discover Card' THEN
                      'D'
                    WHEN NEW.funds_type='Other Credit Card' THEN
                      'R'
                    WHEN NEW.funds_type='Cash' THEN
                      'K'
                    WHEN NEW.funds_type='Wire Transfer' THEN
                      'W'
                    ELSE
                      'O'
                  END,
                  NEW.check_document_number),
    getGlAccntId(NEW.account),
    COALESCE(NEW.amount_to_distribute, 0),
    COALESCE(NEW.notes, '')
    );

CREATE OR REPLACE RULE "_UPDATE" AS 
  ON UPDATE TO api.cashreceiptapplymisc DO INSTEAD

  UPDATE cashrcptmisc SET
    cashrcptmisc_accnt_id=getGlAccntId(NEW.account),
    cashrcptmisc_amount=NEW.amount_to_distribute,
    cashrcptmisc_notes=NEW.notes
    WHERE ( (cashrcptmisc_cashrcpt_id=getCashrcptId(
                       OLD.customer_number,
                       CASE
                         WHEN OLD.funds_type='Check' THEN
                           'C'
                         WHEN OLD.funds_type='Certified Check' THEN
                           'T'
                         WHEN OLD.funds_type='Master Card' THEN
                           'M'
                         WHEN OLD.funds_type='Visa' THEN
                           'V'
                         WHEN OLD.funds_type='American Express' THEN
                           'A'
                         WHEN OLD.funds_type='Discover Card' THEN
                           'D'
                         WHEN OLD.funds_type='Other Credit Card' THEN
                           'R'
                         WHEN OLD.funds_type='Cash' THEN
                           'K'
                         WHEN OLD.funds_type='Wire Transfer' THEN
                           'W'
                         ELSE
                           'O'
                       END,
                       OLD.check_document_number))
      AND   (cashrcptmisc_accnt_id=getGlAccntId(OLD.account)) );

CREATE OR REPLACE RULE "_DELETE" AS 
  ON DELETE TO api.cashreceiptapplymisc DO INSTEAD
	
    DELETE FROM cashrcptmisc
    WHERE ( (cashrcptmisc_cashrcpt_id=getCashrcptId(
                       OLD.customer_number,
                       CASE
                         WHEN OLD.funds_type='Check' THEN
                           'C'
                         WHEN OLD.funds_type='Certified Check' THEN
                           'T'
                         WHEN OLD.funds_type='Master Card' THEN
                           'M'
                         WHEN OLD.funds_type='Visa' THEN
                           'V'
                         WHEN OLD.funds_type='American Express' THEN
                           'A'
                         WHEN OLD.funds_type='Discover Card' THEN
                           'D'
                         WHEN OLD.funds_type='Other Credit Card' THEN
                           'R'
                         WHEN OLD.funds_type='Cash' THEN
                           'K'
                         WHEN OLD.funds_type='Wire Transfer' THEN
                           'W'
                         ELSE
                           'O'
                       END,
                       OLD.check_document_number))
      AND   (cashrcptmisc_accnt_id=getGlAccntId(OLD.account)) );
