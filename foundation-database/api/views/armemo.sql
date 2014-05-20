CREATE OR REPLACE VIEW api.armemo AS
  SELECT cust_number AS customer_number,
         aropen_docdate AS document_date,
         aropen_duedate AS due_date,
         CASE WHEN (aropen_doctype='C') THEN 'Credit Memo'
              ELSE 'Debit Memo'
         END AS document_type,
         aropen_docnumber AS document_number,
         aropen_applyto AS order_number,
         aropen_journalnumber AS journal_number,
         rsncode_code AS reason_code,
         terms_code AS terms,
         salesrep_number AS sales_rep,
         curr.curr_abbr AS currency,
         aropen_amount AS amount,
         aropen_paid AS paid,
         (aropen_amount - aropen_paid) AS balance,
         aropen_commission_due AS commission_due,
         aropen_commission_paid AS commission_paid,
         aropen_notes AS notes,
         salescat_name AS alternate_prepaid_sales_category,
         CASE WHEN (aropen_accnt_id=-1) THEN NULL
              ELSE formatglaccount(aropen_accnt_id)
         END AS alternate_prepaid_account
  FROM aropen
         LEFT OUTER JOIN custinfo ON (cust_id=aropen_cust_id)
         LEFT OUTER JOIN curr_symbol AS curr ON (curr.curr_id=aropen_curr_id)
         LEFT OUTER JOIN salesrep ON (salesrep_id=aropen_salesrep_id)
         LEFT OUTER JOIN terms ON (terms_id=aropen_terms_id)
         LEFT OUTER JOIN salescat ON (salescat_id=aropen_salescat_id)
         LEFT OUTER JOIN rsncode ON (rsncode_id=aropen_rsncode_id)
  WHERE (aropen_doctype IN ('C', 'D'));
	
GRANT ALL ON TABLE api.armemo TO xtrole;
COMMENT ON VIEW api.armemo IS 'A/R Credit and Debit Memo';


CREATE OR REPLACE FUNCTION insertARMemo(api.armemo) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pNew ALIAS FOR $1;
  _result INTEGER;

BEGIN
  IF (pNew.document_type = 'Credit Memo') THEN
    SELECT createARCreditMemo( NULL,
                               getCustId(pNew.customer_number),
                               pNew.document_number,
                               pNew.order_number,
                               pNew.document_date,
                               pNew.amount,
                               pNew.notes,
                               getRsnId(pNew.reason_code),
                               getSalescatId(pNew.alternate_prepaid_sales_category),
                               getGLAccntId(pNew.alternate_prepaid_account),
                               pNew.due_date,
                               getTermsId(pNew.terms),
                               getSalesrepId(pNew.sales_rep),
                               pNew.commission_due,
                               pNew.journal_number,
                               COALESCE(getCurrId(pNew.currency), baseCurrId()) ) INTO _result;
    IF (_result <= 0) THEN
      RAISE EXCEPTION 'Function createARCreditMemo failed with result = %', _result;
    END IF;
  ELSE
    IF (pNew.document_type = 'Debit Memo') THEN
      SELECT createARDebitMemo( null, getCustId(pNew.customer_number),
                                pNew.journal_number,
                                pNew.document_number,
                                pNew.order_number,
                                pNew.document_date,
                                pNew.amount,
                                pNew.notes,
                                getRsnId(pNew.reason_code),
                                getSalescatId(pNew.alternate_prepaid_sales_category),
                                getGLAccntId(pNew.alternate_prepaid_account),
                                pNew.due_date,
                                getTermsId(pNew.terms),
                                getSalesrepId(pNew.sales_rep),
                                pNew.commission_due,
                                COALESCE(getCurrId(pNew.currency), baseCurrId()) ) INTO _result;
      IF (_result <= 0) THEN
        RAISE EXCEPTION 'Function createARDebitMemo failed with result = %', _result;
      END IF;
    ELSE
      RAISE EXCEPTION 'Function insertARMemo failed, invalid Document Type';
    END IF;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE 'plpgsql';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
  ON INSERT TO api.armemo DO INSTEAD
    SELECT insertARMemo(NEW);


CREATE OR REPLACE RULE "_UPDATE" AS 
  ON UPDATE TO api.armemo DO INSTEAD
    UPDATE aropen SET aropen_duedate=NEW.due_date,
                      aropen_terms_id=getTermsId(NEW.terms),
                      aropen_salesrep_id=getSalesrepId(NEW.sales_rep),
                      aropen_amount=NEW.amount,
                      aropen_commission_due=NEW.commission_due,
                      aropen_notes=NEW.notes,
                      aropen_rsncode_id=getRsnId(NEW.reason_code)
    WHERE ( (aropen_docnumber=OLD.document_number)
      AND   (aropen_doctype = CASE WHEN (OLD.document_type='Credit Memo') THEN 'C'
                                   WHEN (OLD.document_type='Debit Memo') THEN 'D'
                                   ELSE ''
                              END) );


CREATE OR REPLACE RULE "_DELETE" AS 
  ON DELETE TO api.armemo DO INSTEAD

    NOTHING;
