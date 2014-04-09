SELECT dropIfExists('VIEW', 'cashreceipt', 'api');
CREATE OR REPLACE VIEW api.cashreceipt AS
  SELECT
    cust_number::VARCHAR AS customer_number,
    cashrcpt_number AS cashreceipt_number,
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
    cust_name AS customer_name,
    addr_line1 AS customer_address,
    curr_abbr AS currency,
    cashrcpt_amount AS amount_received,
    bankaccnt_name AS post_to,
    formatDate(cashrcpt_distdate) AS distribution_date,
    CASE
      WHEN cashrcpt_usecustdeposit THEN
        'Customer Deposit'
      ELSE
        'Credit Memo'
    END AS apply_balance_as,
    salescat_name AS sales_category,
    cashrcpt_notes AS notes
  FROM cashrcpt
    LEFT OUTER JOIN custinfo ON (cust_id=cashrcpt_cust_id)
    LEFT OUTER JOIN cntct mc ON (custinfo.cust_cntct_id = mc.cntct_id)
    LEFT OUTER JOIN addr m ON (mc.cntct_addr_id = m.addr_id)
    LEFT OUTER JOIN curr_symbol ON (curr_id=cashrcpt_curr_id)
    LEFT OUTER JOIN bankaccnt ON (bankaccnt_id=cashrcpt_bankaccnt_id)
    LEFT OUTER JOIN salescat ON (salescat_id=cashrcpt_salescat_id);
	
GRANT ALL ON TABLE api.cashreceipt TO xtrole;
COMMENT ON VIEW api.cashreceipt IS '
This view can be used as an interface to import Cash Receipt data directly  
into the system.  Required fields will be checked and default values will be 
populated';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.cashreceipt DO INSTEAD

  INSERT INTO cashrcpt (
    cashrcpt_cust_id,
    cashrcpt_number,
    cashrcpt_amount,
    cashrcpt_fundstype,
    cashrcpt_docnumber,
    cashrcpt_bankaccnt_id,
    cashrcpt_notes,
    cashrcpt_distdate,
    cashrcpt_salescat_id,
    cashrcpt_curr_id,
    cashrcpt_usecustdeposit
    )
  VALUES (
    getCustId(NEW.customer_number),
    (SELECT fetchCashRcptNumber() ),
    COALESCE(NEW.amount_received, 0),
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
    COALESCE(NEW.check_document_number, ''),
    getBankAccntId(NEW.post_to),
    COALESCE(NEW.notes, ''),
    CASE
      WHEN NEW.distribution_date > '' THEN
        NEW.distribution_date::DATE
      ELSE
        now()
    END,
    COALESCE(getSalesCatId(NEW.sales_category), -1),
    getCurrId(NEW.currency),
    CASE
      WHEN NEW.apply_balance_as='Customer Deposit' THEN
        true
      ELSE
        false
    END
    );

CREATE OR REPLACE RULE "_UPDATE" AS 
  ON UPDATE TO api.cashreceipt DO INSTEAD

  UPDATE cashrcpt SET
    cashrcpt_amount=NEW.amount_received,
    cashrcpt_number=NEW.cashreceipt_number,
    cashrcpt_fundstype=
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
    cashrcpt_docnumber=NEW.check_document_number,
    cashrcpt_bankaccnt_id=getBankAccntId(NEW.post_to),
    cashrcpt_notes=NEW.notes,
    cashrcpt_distdate=
      CASE
        WHEN NEW.distribution_date > '' THEN
          NEW.distribution_date::DATE
        ELSE
          NULL
      END,
    cashrcpt_salescat_id=getSalesCatId(NEW.sales_category),
    cashrcpt_curr_id=getCurrId(NEW.currency),
    cashrcpt_usecustdeposit=
      CASE
        WHEN NEW.apply_balance_as='Customer Deposit' THEN
          true
        ELSE
          false
      END
    WHERE (cashrcpt_id=getCashrcptId(
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
                       OLD.check_document_number) );


CREATE OR REPLACE RULE "_DELETE" AS 
  ON DELETE TO api.cashreceipt DO INSTEAD
	
    SELECT deleteCashrcpt(cashrcpt_id)
	FROM cashrcpt
    WHERE (cashrcpt_id=getCashrcptId(
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
                       OLD.check_document_number) );
