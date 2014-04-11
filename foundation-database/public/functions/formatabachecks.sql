-- Function: formatabachecks(integer, integer, text)

CREATE OR REPLACE FUNCTION formatabachecks(integer, integer, text)
  RETURNS SETOF achline AS
$BODY$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pbankaccntid     ALIAS FOR $1;   -- all unprinted checks for this bankaccnt
  pcheckheadid     ALIAS FOR $2;   -- but if 2nd arg not null then just 1 check
  penckey          ALIAS FOR $3;
  _bank            RECORD;
  _batchcount      INTEGER := 0;
  _batchdate       DATE;
  _check           RECORD;
  _vendnumber      TEXT;
  _vendname        TEXT;
  _filenum         TEXT;
  _prevsec         TEXT;
  _row             achline%ROWTYPE;
  _totalcr         NUMERIC := 0;
  _totaldb         NUMERIC := 0;
  _detailcount     INTEGER := 0;     -- count of type 1 entries
  _vendbsb         TEXT;

BEGIN
  -- General notes:
  -- Numeric values are formatted using RPAD(TO_CHAR(#, '0..0SG', #)).
  --    TO_CHAR(#, ...) (at least in the default server locale) puts a space at
  --    the beginning of the string for numbers >= 0 and '-' for numbers < 0.
  --    'SG' pushes the sign char to the end, then RPAD cuts it off.
  -- This whole thing is for Australian bank transactions only, and generates entries for an ABA file.
  -- Currently restricted to checks to Vendor; there's no support for checks to
  --    customers or tax authorities, or for debits or corrections.
  -- This function has been adapted from the US-centric ACH formatACHChecks function.

  IF (NOT fetchMetricBool('ACHEnabled')) THEN
    RAISE EXCEPTION 'Cannot format the ABA file because the system is not configured for ABA file generation.';
  END IF;
  IF (LENGTH(COALESCE(penckey, '')) <= 0) THEN
    RAISE EXCEPTION 'Cannot format the ABA file because there is no encryption key.';
  END IF;

  SELECT * INTO _bank
  FROM bankaccnt
  WHERE (bankaccnt_id=pbankaccntid);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Could not find the bank information to create the ABA file.';
  ELSIF (NOT _bank.bankaccnt_ach_enabled) THEN
    RAISE EXCEPTION 'Cannot format the ABA file because the Bank Account % is not configured for ABA transactions.',
      _bank.bankaccnt_name;
  ELSIF (LENGTH(COALESCE(_bank.bankaccnt_routing, '')) <= 0) THEN 
    RAISE EXCEPTION 'Cannot format the ABA file because the Bank Account % has no BSB number.', _bank.bankaccnt_name;
  END IF;

  -- Check the BSB number is in the right format and then re-format for output.
  -- Valid format is \d{3}-\d{3}|\d{6}000
  IF (_bank.bankaccnt_routing ~ E'^(\\d{3})(?:-(?=\\d{3}$)|(?=\\d{3}0{3}$))(\\d{3})(0{3})?$') THEN
    _bank.bankaccnt_routing := regexp_replace(
      _bank.bankaccnt_routing,
      E'^(\\d{3})(?:-(?=\\d{3}$)|(?=\\d{3}0{3}$))(\\d{3})(0{3})?$', E'\\1-\\2'
    );
  ELSE RAISE EXCEPTION 'Cannot format the ABA file because the Bank Account % has an invalid BSB number.',
    _bank.bankaccnt_name;
  END IF;


  _filenum := LPAD(fetchNextNumber('ACHBatch'), 8, '0');

  IF (COALESCE(_bank.bankaccnt_ach_lastdate,startOfTime()) < CURRENT_DATE
    OR _bank.bankaccnt_ach_lastfileid IS NULL) THEN
    _bank.bankaccnt_ach_lastfileid = '0';
  ELSIF (_bank.bankaccnt_ach_lastfileid = '9') THEN
    _bank.bankaccnt_ach_lastfileid = 'A';
  ELSIF (_bank.bankaccnt_ach_lastfileid = 'Z') THEN
    RAISE EXCEPTION 'Cannot write % check % to an ABA file because too many files have been written for this bank already today.',
      _bank.bankaccnt_name, _check.checkhead_number;
  ELSE
    _bank.bankaccnt_ach_lastfileid = CHR(ASCII(_bank.bankaccnt_ach_lastfileid) + 1);
  END IF;
  

  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'HEADER';
  _row.achline_value := RPAD(
    RPAD('0',18)                                    -- Record Type 0 blank filled with 17 spaces
    || '01'                                         -- Reel sequence number 
    || RPAD(_bank.bankaccnt_bankname,3)             -- Approved financial instition abbreviation.
    || RPAD('',7)                                   -- blank filled
    || RPAD(fetchMetricText('ACHCompanyName'), 26)  -- Name of user supplying ABA file
    || LPAD(fetchMetricText('ACHCompanyId'),6)      -- User identification number APCA issued
    || RPAD('PAYMENT',12)                           -- description of entries on file
                                                    --  currently only use payment description
    || TO_CHAR(CURRENT_DATE,      'DDMMYY'),        -- date to be processed
    120                                             -- blank filled to 120 characters
  );
  RETURN NEXT _row;

  FOR _check IN SELECT *
    FROM checkhead
    JOIN vendinfo ON (checkhead_recip_type='V'
      AND checkhead_recip_id=vend_id
      AND vend_ach_enabled)
    JOIN curr_symbol ON (checkhead_curr_id=curr_id)
    LEFT OUTER JOIN crmacct ON (crmacct_vend_id=vend_id)
    WHERE ((checkhead_bankaccnt_id=pbankaccntid)
      AND (checkhead_amount > 0)
      AND (checkhead_id=pcheckheadid OR pcheckheadid IS NULL)
      AND NOT checkhead_posted
      AND NOT checkhead_replaced
      AND NOT checkhead_deleted
      AND NOT checkhead_void
      AND NOT checkhead_printed
      AND (LENGTH(COALESCE(checkhead_ach_batch,'')) <= 0)
      AND (curr_abbr='AUD'))
    ORDER BY checkhead_checkdate, vend_name LOOP

    IF (COALESCE(_check.checkhead_number, -1) <= 0
      AND _bank.bankaccnt_ach_genchecknum) THEN
        _check.checkhead_number := fetchNextCheckNumber(_check.checkhead_bankaccnt_id);
    END IF;

    -- Although a crmacct record is not required for used in this function
    -- this code is retained for consistancy with the original formatachchecks function.
    IF (_check.crmacct_id IS NULL) THEN
      RAISE NOTICE 'Vendor % does not have a corresponding crmacct record.',
        _check.checkhead_recip_id;
    ELSIF (_check.crmacct_type IS NULL) THEN
      RAISE NOTICE 'crmacct for vendor % does not have a valid crmacct_type.',
         _check.checkhead_recip_id;
    END IF;

    _vendnumber := CASE WHEN _check.vend_ach_use_vendinfo THEN _check.vend_number
      ELSE _check.vend_ach_indiv_number
      END;
    _vendname := CASE WHEN _check.vend_ach_use_vendinfo THEN _check.vend_name
      ELSE _check.vend_ach_indiv_name
      END;

    IF (COALESCE(_check.vend_ach_routingnumber, '') = '') THEN
      RAISE EXCEPTION 'Cannot write % check % to an ABA file because the BSB number for % has not been supplied.',
        _bank.bankaccnt_name, _check.checkhead_number, _vendnumber;
    ELSIF (COALESCE(_check.vend_ach_accntnumber, '') = '') THEN
      RAISE EXCEPTION 'Cannot write % check % to an ABA file because the account number for % has not been supplied.',
        _bank.bankaccnt_name, _check.checkhead_number, _vendnumber;
    END IF;
    _check.vend_ach_routingnumber := decrypt(setbytea(_check.vend_ach_routingnumber),
      setbytea(penckey), 'bf');
    _check.vend_ach_accntnumber   := decrypt(setbytea(_check.vend_ach_accntnumber),
      setbytea(penckey), 'bf');
    
    -- Check the BSB number is in the right format and then re-format for output.
    -- Valid format is \d{3}-\d{3}|\d{6}000
    IF (formatbytea(_check.vend_ach_routingnumber) ~ E'^(\\d{3})(?:-(?=\\d{3}$)|(?=\\d{3}0{3}$))(\\d{3})(0{3})?$') THEN
      _vendbsb := regexp_replace(
        formatbytea(_check.vend_ach_routingnumber),
        E'^(\\d{3})(?:-(?=\\d{3}$)|(?=\\d{3}0{3}$))(\\d{3})(0{3})?$', E'\\1-\\2'
      );
    ELSE RAISE EXCEPTION 'Cannot write % check % to an ABA file because the BSB number for % is not valid.',
      _bank.bankaccnt_name, _check.checkhead_number, _vendnumber;
    END IF;

    _row.achline_checkhead_id := _check.checkhead_id;
    _row.achline_batch        := _filenum;
    _row.achline_type         := 'DETAIL';

    _totaldb      := _totaldb + _check.checkhead_amount;                -- Total debits for balancing entry
    _detailcount  := _detailcount + 1;                                  -- Detail record counter (type 1)
    _totalcr      := _totalcr + _check.checkhead_amount;                -- Total credits from payments
                                                                        
    _row.achline_value := RPAD('1'                                      -- record type 1
      || _vendbsb                                                       -- vendor BSB #
      || LPAD(formatbytea(_check.vend_ach_accntnumber), 9)              -- vendor account no.
      ||' '                                                             -- withholding tax indicator
      ||'50'                                                            -- transaction code, this should be calculated.
      || LPAD(to_char(_check.checkhead_amount,'FM99999999V99'),10,'0')  -- amount
      || RPAD(_vendname,   32)                                          -- vendor name
      || RPAD('Deposit',8) || RPAD('#'  , 2) || LPAD (_filenum,8,' ')   -- Lodgement Reference
      || _bank.bankaccnt_routing                                        -- BSB #
      || RPAD(_bank.bankaccnt_accntnumber, 9)                           -- company account number
      || RPAD(fetchMetricText('ACHCompanyName'), 16)                    -- company account name
      || LPAD('', 8, '0'),                                              -- Witholding Tax Amount
      120                                                               -- line width
    );
    RETURN NEXT _row;

    UPDATE checkhead
    SET checkhead_ach_batch=_filenum,
      checkhead_number=_check.checkhead_number
    WHERE (checkhead_id=_check.checkhead_id);

  END LOOP;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot write an ABA file for % because there are no checks pending in AUD for EFT-enabled Vendors.',
      _bank.bankaccnt_name;
  END IF;

  -- Place a final balancing detail record.
  -- Check that the balancing record actually balances.
  IF (_totalcr != _totaldb) THEN
    RAISE EXCEPTION 'Cannot write an ABA file for % because the total credits: % does not equal the total debits: %, file will not balance.',
    _bank.bankaccnt_name, _totalcr, _totaldb;
  END IF;
  

  _detailcount := _detailcount + 1;
  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'BALANCING';
  -- keep in sync with the other batchcontrol record format above
  -- THE FOLLOWING IS THE DEBIT BALANCING RECORD
  _row.achline_value := RPAD('1'                          -- record type 1
    || _bank.bankaccnt_routing                            -- Austalian BSB #
    || LPAD(_bank.bankaccnt_accntnumber, 9)               -- company account no.
    || ' '                                                -- withholding tax indicator
    || '13'                                               -- transaction code
    || to_char(_totaldb,'FM09999999V99')                  -- the balancing amount
    || RPAD(fetchMetricText('ACHCompanyName'),   32)      -- company name
    || RPAD('DIRECT DEPOSIT',18)                          
    || _bank.bankaccnt_routing                            -- Austalian BSB #
    || RPAD(_bank.bankaccnt_accntnumber, 9)               -- company account number
    || RPAD(fetchMetricText('ACHCompanyName'), 16)        -- company account name
    || LPAD('', 8, '0'),                                  -- Witholding Tax Amount
    120                                                   -- line width
  );
  RETURN NEXT _row;

  RAISE DEBUG 'formatABAChecks building TRAILER with _totaldb %, _totalcr %, _detailcount %',
               _totaldb, _totalcr, _detailcount;
  -- file control record
  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'TRAILER';
  _row.achline_value := RPAD('7'                                    -- record type 7
    || RPAD('999-999',   7)                                         -- BSB format filler
    || RPAD('' , 12)                                                -- blank
    || LPAD(to_char((_totaldb - _totalcr),'FM09999999V99'),10,'0')  -- net total amount
    || LPAD(to_char(_totalcr, 'FM09999999V99'),10,'0')              -- total credit amount
    || LPAD(to_char(_totaldb, 'FM09999999V99'),10,'0')              -- total debit amount
    || RPAD('', 24)                                                 -- blank
    || RPAD(to_char(_detailcount, 'FM000000'), 6,'0'),              -- count of type 1 records
    120                                                             -- blank fill
  );

  RETURN NEXT _row;


  UPDATE bankaccnt
  SET bankaccnt_ach_lastdate=CURRENT_DATE,
    bankaccnt_ach_lastfileid=_bank.bankaccnt_ach_lastfileid
  WHERE (bankaccnt_id=_bank.bankaccnt_id);

  RETURN;

END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
