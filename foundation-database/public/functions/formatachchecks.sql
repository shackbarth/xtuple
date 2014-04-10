CREATE OR REPLACE FUNCTION formatACHChecks(INTEGER, INTEGER, TEXT) RETURNS SETOF achline AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pbankaccntid     ALIAS FOR $1;   -- all unprinted checks for this bankaccnt
  pcheckheadid     ALIAS FOR $2;   -- but if 2nd arg not null then just 1 check
  penckey          ALIAS FOR $3;
  _bank            RECORD;
  _batchcount      INTEGER := 0;
  _batchcr         NUMERIC := 0;
  _batchdate       DATE;
  _batchdb         NUMERIC := 0;
  _batchhash       INTEGER := 0;
  _check           RECORD;
  _ccdnumber       TEXT;
  _ccdname         TEXT;
  _entrycount      INTEGER := 0;
  _filenum         TEXT;
  _prevsec         TEXT;
  _row             achline%ROWTYPE;
  _rowcount        INTEGER := 0;
  _sec             TEXT;
  _serviceclass    TEXT := '200';    -- 220 = credits, 225 = debits, 200 = mixed
  _totalcr         NUMERIC := 0;
  _totaldb         NUMERIC := 0;
  _totalentrycnt   INTEGER := 0;
  _totalhash       INTEGER := 0;
  _transactionprefix TEXT;

BEGIN
  -- General notes:
  -- Numeric values are formatted using RPAD(TO_CHAR(#, '0..0SG', #)).
  --    TO_CHAR(#, ...) (at least in the default server locale) puts a space at
  --    the beginning of the string for numbers >= 0 and '-' for numbers < 0.
  --    'SG' pushes the sign char to the end, then RPAD cuts it off.
  -- This whole thing is US-centric, as that's where the NACHA is.
  -- Currently restricted to checks to Vendor; there's no support for checks to
  --    customers or tax authorities, or for debits or corrections.

  IF (NOT fetchMetricBool('ACHEnabled')) THEN
    RAISE EXCEPTION 'Cannot format the ACH file because the system is not configured for ACH file generation.';
  END IF;
  IF (LENGTH(COALESCE(penckey, '')) <= 0) THEN
    RAISE EXCEPTION 'Cannot format the ACH file because there is no encryption key.';
  END IF;

  SELECT * INTO _bank
  FROM bankaccnt
  WHERE (bankaccnt_id=pbankaccntid);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Could not find the bank information to create the ACH file.';
  ELSIF (NOT _bank.bankaccnt_ach_enabled) THEN
    RAISE EXCEPTION 'Cannot format the ACH file because the Bank Account % is not configured for ACH transactions.',
      _bank.bankaccnt_name;
  ELSIF (LENGTH(COALESCE(_bank.bankaccnt_routing, '')) <= 0) THEN 
    RAISE EXCEPTION 'Cannot format the ACH file because the Bank Account % has no routing number.',
      _bank.bankaccnt_name;
  END IF;

  _filenum := LPAD(fetchNextNumber('ACHBatch'), 8, '0');

  IF (COALESCE(_bank.bankaccnt_ach_lastdate,startOfTime()) < CURRENT_DATE
      OR _bank.bankaccnt_ach_lastfileid IS NULL) THEN
    _bank.bankaccnt_ach_lastfileid = '0';
  ELSIF (_bank.bankaccnt_ach_lastfileid = '9') THEN
    _bank.bankaccnt_ach_lastfileid = 'A';
  ELSIF (_bank.bankaccnt_ach_lastfileid = 'Z') THEN
    RAISE EXCEPTION 'Cannot write % check % to an ACH file because too many files have been written for this bank already today.',
                  _bank.bankaccnt_name, _check.checkhead_number;
  ELSE
    _bank.bankaccnt_ach_lastfileid = CHR(ASCII(_bank.bankaccnt_ach_lastfileid) + 1);
  END IF;

  _rowcount := _rowcount + 1;
  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'FILEHEADER';
  _row.achline_value := RPAD('1'
                          || '01'
                          || RPAD(CASE WHEN _bank.bankaccnt_ach_desttype = 'B' THEN ' ' || _bank.bankaccnt_routing
                                       WHEN _bank.bankaccnt_ach_desttype = 'F' THEN ' ' || _bank.bankaccnt_ach_fed_dest
                                       ELSE _bank.bankaccnt_ach_dest END, 10)
                          || RPAD(CASE WHEN _bank.bankaccnt_ach_origintype = 'B' THEN ' ' || _bank.bankaccnt_routing
                                       WHEN _bank.bankaccnt_ach_origintype = 'I' THEN formatAchCompanyId()
                                       ELSE _bank.bankaccnt_ach_origin END, 10)
                          || TO_CHAR(CURRENT_DATE,      'YYMMDD')
                          || TO_CHAR(CURRENT_TIMESTAMP, 'HH24MM')
                          || UPPER(_bank.bankaccnt_ach_lastfileid)
                          || '094'
                          || '10'
                          || '1'
                          || RPAD(CASE WHEN _bank.bankaccnt_ach_desttype = 'B' THEN _bank.bankaccnt_bankname
                                       WHEN _bank.bankaccnt_ach_desttype = 'F' THEN 'Federal Reserve'
                                       ELSE _bank.bankaccnt_ach_destname END, 23)
                          || RPAD(CASE WHEN _bank.bankaccnt_ach_origintype = 'B' THEN ' ' || _bank.bankaccnt_bankname
                                       WHEN _bank.bankaccnt_ach_origintype = 'I' THEN fetchMetricText('ACHCompanyName')
                                       ELSE _bank.bankaccnt_ach_originname END, 23)
                          || RPAD(_filenum, 8),
                          94);
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
                   AND (curr_abbr='USD'))
                ORDER BY checkhead_checkdate, vend_name LOOP

    IF (COALESCE(_check.checkhead_number, -1) <= 0
        AND _bank.bankaccnt_ach_genchecknum) THEN
      _check.checkhead_number := fetchNextCheckNumber(_check.checkhead_bankaccnt_id);
    END IF;

    _prevsec := _sec;

    IF (_check.crmacct_type = 'I') THEN
      _sec := 'PPD';
    ELSE
      _sec := 'CCD';
      IF (_check.crmacct_id IS NULL) THEN
        RAISE NOTICE 'Vendor % does not have a corresponding crmacct record.',
                     _check.checkhead_recip_id;
      ELSIF (_check.crmacct_type IS NULL) THEN
        RAISE NOTICE 'crmacct for vendor % does not have a valid crmacct_type.',
                     _check.checkhead_recip_id;
      END IF;
    END IF;

    _ccdnumber := CASE WHEN _check.vend_ach_use_vendinfo THEN _check.vend_number
                       ELSE _check.vend_ach_indiv_number
                  END;
    _ccdname := CASE WHEN _check.vend_ach_use_vendinfo THEN _check.vend_name
                     ELSE _check.vend_ach_indiv_name
                END;

    IF (COALESCE(_check.vend_ach_routingnumber, '') = '') THEN
      RAISE EXCEPTION 'Cannot write % check % to an ACH file because the routing number for % has not been supplied.',
                  _bank.bankaccnt_name, _check.checkhead_number, _ccdnumber;
    ELSIF (COALESCE(_check.vend_ach_accntnumber, '') = '') THEN
      RAISE EXCEPTION 'Cannot write % check % to an ACH file because the account number for % has not been supplied.',
                  _bank.bankaccnt_name, _check.checkhead_number, _ccdnumber;
    END IF;
    _check.vend_ach_routingnumber := decrypt(setbytea(_check.vend_ach_routingnumber),
                                         setbytea(penckey), 'bf');
    _check.vend_ach_accntnumber   := decrypt(setbytea(_check.vend_ach_accntnumber),
                                         setbytea(penckey), 'bf');
    _transactionprefix := CASE WHEN (_check.vend_ach_accnttype = 'K') THEN '2'
                               WHEN (_check.vend_ach_accnttype = 'C') THEN '3'
                          END;

    -- create separate batches for each check date and for PPD vs CCD
    IF (COALESCE(_batchdate, startOfTime()) != _check.checkhead_checkdate
        OR (_prevsec != _sec)) THEN
      IF (_batchcount > 0) THEN
        _rowcount := _rowcount + 1;
        _row.achline_checkhead_id := NULL;
        _row.achline_batch := _filenum;
        _row.achline_type := 'BATCHCONTROL';
        -- keep in sync with the other batchcontrol record format below
        _row.achline_value := RPAD('8'
                                || _serviceclass
                                || RPAD(TO_CHAR(_entrycount, '000000SG'), 6)
                                || RPAD(TO_CHAR(_batchhash % 10000000000,
                                                '0000000000SG'), 10)
                                || RPAD(TO_CHAR(_batchdb, '0000000000V99SG'), 12)
                                || RPAD(TO_CHAR(_batchcr, '0000000000V99SG'), 12)
                                || RPAD(formatAchCompanyId(), 10)
                                || RPAD(' ', 19)
                                || RPAD(' ',  6)
                                || RPAD(_bank.bankaccnt_routing, 8)
                                || RPAD(TO_CHAR(_batchcount, '0000000SG'), 7),
                                94);
        RETURN NEXT _row;
      END IF;

      _batchhash     := 0;
      _batchcr       := 0;
      _batchdb       := 0;
      _batchdate     := _check.checkhead_checkdate;
      _entrycount    := 0;
      _rowcount      := _rowcount + 1;
      _batchcount    := _batchcount + 1;
      _row.achline_checkhead_id := NULL;
      _row.achline_batch := _filenum;
      _row.achline_type := 'BATCHHEADER';

      -- effective entry date = 1 or 2 banking days after the banking day
      -- of processing (the following accounts for weekends but not holidays)

      _row.achline_value := RPAD('5'
                              || _serviceclass
                              || RPAD(fetchMetricText('ACHCompanyName'), 16)
                              || RPAD('', 20)   -- TODO: find a use
                              || RPAD(formatAchCompanyId(), 10)
                              || _sec
                              || RPAD('xTuple ERP', 10)
                              || TO_CHAR(_check.checkhead_checkdate, 'YYMMDD')
                              || TO_CHAR(CURRENT_DATE +
                                         COALESCE(_bank.bankaccnt_ach_leadtime,1) +
                                         CASE WHEN EXTRACT(DOW FROM CURRENT_DATE) = 5 THEN 2
                                              WHEN EXTRACT(DOW FROM CURRENT_DATE) = 6 THEN 1
                                              ELSE 0 END,
                                         'YYMMDD')
                              || RPAD('', 3)
                              || '1'
                              || RPAD(_bank.bankaccnt_routing, 8)
                              || RPAD(TO_CHAR(_batchcount, '0000000SG'), 7),
                              94);
      RETURN NEXT _row;
    END IF;

    _row.achline_checkhead_id := _check.checkhead_id;
    _row.achline_batch        := _filenum;
    _row.achline_type         := _sec;

    IF (_sec = 'CCD' OR _sec = 'PPD') THEN
      _rowcount      := _rowcount + 1;
      _entrycount    := _entrycount + 1;
      _totalentrycnt := _totalentrycnt + 1;
      _batchhash     := _batchhash + CAST(SUBSTRING(_bank.bankaccnt_routing FOR 8) AS INTEGER);
      _totalhash     := _totalhash + CAST(SUBSTRING(_bank.bankaccnt_routing FOR 8) AS INTEGER);
      _batchdb       := _batchdb + _check.checkhead_amount;
      _totaldb       := _totaldb + _check.checkhead_amount;

      _row.achline_value := RPAD('6'
                              || _transactionprefix || '7'              -- debit
                              || RPAD(_bank.bankaccnt_routing,      9)  -- 2 fields
                              || RPAD(_bank.bankaccnt_accntnumber, 17)
                              || RPAD(TO_CHAR(_check.checkhead_amount,
                                              '00000000V99SG'), 10)
                              || RPAD(fetchMetricText('ACHCompanyId'),   15)
                              || RPAD(fetchMetricText('ACHCompanyName'), 22)
                              || RPAD(TO_CHAR(_check.checkhead_id % 100, '00SG'),
                                      2)        -- last 2 digits of checkhead_id
                              || '0'
                              || RPAD(_bank.bankaccnt_routing, 9)  -- split field
                              || RPAD(TO_CHAR(_entrycount, '000000SG'), 15-9),
                              94);
      RETURN NEXT _row;

      _rowcount      := _rowcount + 1;
      _entrycount    := _entrycount + 1;
      _totalentrycnt := _totalentrycnt + 1;
      _batchhash     := _batchhash + CAST(SUBSTRING(formatbytea(_check.vend_ach_routingnumber) FOR 8) AS INTEGER);
      _totalhash     := _totalhash + CAST(SUBSTRING(formatbytea(_check.vend_ach_routingnumber) FOR 8) AS INTEGER);
      _totalcr       := _totalcr + _check.checkhead_amount;
      _batchcr       := _batchcr + _check.checkhead_amount;
      _row.achline_value := RPAD('6'
                              || _transactionprefix || '2'              -- credit
                              || RPAD(formatbytea(_check.vend_ach_routingnumber), 9)   -- 2 fields
                              || RPAD(formatbytea(_check.vend_ach_accntnumber), 17)
                              || RPAD(TO_CHAR(_check.checkhead_amount,
                                              '00000000V99SG'), 10)
                              || RPAD(_ccdnumber, 15)
                              || RPAD(_ccdname,   22)
                              || RPAD(TO_CHAR(_check.checkhead_id % 100, '00SG'),
                                      2)        -- last 2 digits of checkhead_id
                              || '0'
                              || RPAD(_bank.bankaccnt_routing, 9)  -- split field
                              || RPAD(TO_CHAR(_entrycount, '000000SG'), 15-9),
                              94);
      RETURN NEXT _row;

    ELSE
      RAISE EXCEPTION 'Cannot write % check % to an ACH file because % is not a supported SEC code.',
                    _bank.bankaccnt_name, _check.checkhead_number, _sec;
    END IF;

    UPDATE checkhead
    SET checkhead_ach_batch=_filenum,
        checkhead_number=_check.checkhead_number
    WHERE (checkhead_id=_check.checkhead_id);

  END LOOP;

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Cannot write an ACH file for % because there are no checks pending in USD for ACH-enabled Vendors.',
                    _bank.bankaccnt_name;
  END IF;

  -- place a final batch control record
  IF (_batchcount > 0) THEN
    _rowcount := _rowcount + 1;
    _row.achline_checkhead_id := NULL;
    _row.achline_batch := _filenum;
    _row.achline_type := 'BATCHCONTROL';
    -- keep in sync with the other batchcontrol record format above
    _row.achline_value := RPAD('8'
                            || _serviceclass
                            || RPAD(TO_CHAR(_entrycount, '000000SG'), 6)
                            || RPAD(TO_CHAR(_batchhash % 10000000000,
                                            '0000000000SG'), 10)
                            || RPAD(TO_CHAR(_batchdb, '0000000000V99SG'), 12)
                            || RPAD(TO_CHAR(_batchcr, '0000000000V99SG'), 12)
                            || RPAD(formatAchCompanyId(), 10)
                            || RPAD(' ', 19)
                            || RPAD(' ',  6)
                            || RPAD(_bank.bankaccnt_routing, 8)
                            || RPAD(TO_CHAR(_batchcount, '0000000SG'), 7),
                            94);
    RETURN NEXT _row;
  END IF;

  -- and end with a file control record
  _rowcount := _rowcount + 1;
  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'FILECONTROL';
  _row.achline_value := RPAD('9'
                          || RPAD(TO_CHAR(_batchcount,    '000000SG'),   6)
                          || RPAD(TO_CHAR(_rowcount,      '000000SG'),   6)
                          || RPAD(TO_CHAR(_totalentrycnt, '00000000SG'), 8)
                          || RPAD(TO_CHAR(_totalhash % 10000000000,
                                          '0000000000SG'), 10)
                          || RPAD(TO_CHAR(_totaldb, '0000000000V99SG'), 12)
                          || RPAD(TO_CHAR(_totalcr, '0000000000V99SG'), 12)
                          || RPAD('', 39),
                          94);

  RETURN NEXT _row;

  -- file must be a multiple of 10 lines long
  _row.achline_checkhead_id := NULL;
  _row.achline_batch := _filenum;
  _row.achline_type := 'BLOCKFILL';
  WHILE (_rowcount % 10 > 0) LOOP
    _rowcount := _rowcount + 1;
    _row.achline_value := RPAD('99999999999999999999'
                            || '99999999999999999999'
                            || '99999999999999999999'
                            || '99999999999999999999'
                            || '99999999999999999999', 94);
    RETURN NEXT _row;
  END LOOP;

  UPDATE bankaccnt
  SET bankaccnt_ach_lastdate=CURRENT_DATE,
      bankaccnt_ach_lastfileid=_bank.bankaccnt_ach_lastfileid
  WHERE (bankaccnt_id=_bank.bankaccnt_id);

  RETURN;

END;
$$
LANGUAGE 'plpgsql';
