CREATE OR REPLACE FUNCTION cntctdups(text, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean) RETURNS SETOF cntctdup AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSearchText ALIAS FOR $1;
  pSearchContactName ALIAS FOR $2;
  pSearchPhone ALIAS FOR $3;
  pSearchEmail ALIAS FOR $4;
  pSearchNumber ALIAS FOR $5;
  pSearchName ALIAS FOR $6;
  pShowInactive ALIAS FOR $7;
  pIgnoreBlanks ALIAS FOR $8;
  pIndentedDups ALIAS FOR $9;
  pCheckHnfc ALIAS FOR $10;
  pCheckFirst ALIAS FOR $11;
  pCheckMiddle ALIAS FOR $12;
  pCheckLast ALIAS FOR $13;
  pCheckSuffix ALIAS FOR $14;
  pCheckPhone ALIAS FOR $15;
  pCheckEmail ALIAS FOR $16;
  _cntct cntctdup%ROWTYPE;
  _cntctdup cntctdup%ROWTYPE;
  _rec RECORD;
  _operator TEXT := '';
  _clause TEXT;
  _qry  TEXT := '';
  _return BOOLEAN := true;
  _text TEXT;
  _first BOOLEAN := true;

BEGIN
  -- Validate
  IF (pIndentedDups AND NOT pCheckHnfc AND NOT pCheckFirst AND NOT pCheckMiddle AND 
      NOT pCheckLast AND NOT pCheckSuffix AND NOT pCheckEmail AND NOT pCheckPhone) THEN
    RETURN;
  END IF;

  _text = quote_literal(pSearchText);

  IF (pIndentedDups) THEN
    _qry := 'SELECT 
	-1 AS cntct_id,
	-1 AS cntct_crmacct_id,
	-1 AS cntct_addr_id,';
    IF (NOT pCheckFirst) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_first_name,';
    IF (NOT pCheckLast) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_last_name,';
    IF (NOT pCheckHnfc) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_honorific,';
    _qry := _qry || ' '''' AS cntct_initials,';
    _qry := _qry || ' NULL AS cntct_active,';
    IF (NOT pCheckPhone) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_phone,';
    IF (NOT pCheckPhone) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_phone2,';
    _qry := _qry || ' '''' AS cntct_fax,';
    IF (NOT pCheckEmail) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_email,';
    _qry := _qry || ' '''' AS cntct_webaddr,';
    _qry := _qry || ' '''' AS cntct_notes,';
    _qry := _qry || ' '''' AS cntct_title,';
    _qry := _qry || ' '''' AS cntct_number,';
    IF (NOT pCheckMiddle) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_middle,';
    IF (NOT pCheckSuffix) THEN
      _qry := _qry || ''''' AS ';
    END IF;
    _qry := _qry || ' cntct_suffix,';
    _qry := _qry || ' '''' AS cntct_owner_username,';
    _qry := _qry || ' '''' AS cntct_name,';
    _qry := _qry || ' '''' AS crmacct_number, ';
    _qry := _qry || ' '''' AS crmacct_name, ';
    _qry := _qry || ' NULL AS addr_id,
		NULL AS addr_active,
		'''' AS addr_line1,
		'''' AS addr_line2,
		'''' AS addr_line3,
		'''' AS addr_city,
		'''' AS addr_state,
		'''' AS addr_postalcode,
		'''' AS addr_country,
		'''' AS addr_notes,
		'''' AS addr_number,
		cntctdup_level FROM (';
  END IF;
    _clause := 'SELECT 
		cntct_id,
		cntct_crmacct_id,
		cntct_addr_id,
		UPPER(cntct_first_name) AS cntct_first_name,
		UPPER(cntct_last_name) AS cntct_last_name,
		UPPER(cntct_honorific) AS cntct_honorific,
		cntct_initials,
		cntct_active,
		cntct_phone,
		cntct_phone2,
		cntct_fax,
		UPPER(cntct_email) AS cntct_email,
		cntct_webaddr,
		cntct_notes,
		cntct_title,
		cntct_number,
		UPPER(cntct_middle) AS cntct_middle,
		UPPER(cntct_suffix) AS cntct_suffix,
		cntct_owner_username,
                cntct_name,
		crmacct_number, 
		crmacct_name,
		addr.*,
		0 AS cntctdup_level
             FROM cntct()
               LEFT OUTER JOIN crmacct ON (cntct_crmacct_id=crmacct_id) 
               LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id) 
	     WHERE ';

  IF (NOT pIndentedDups) THEN
    WHILE position('UPPER' in _clause) > 0
    LOOP
      _clause := regexp_replace(_clause, 'UPPER', '');
    END LOOP;
  END IF;

  _qry := _qry || _clause;
  	   
  IF (NOT pShowInactive) THEN
    _qry := _qry || ' cntct_active AND ';
  END IF;

  IF (pIgnoreBlanks) THEN
    _qry := _qry || ' (COALESCE(LENGTH(cntct_first_name || cntct_last_name),0) > 0) AND ';
  END IF;

    _qry := _qry || '(false ';

  IF (pSearchNumber) THEN
    _qry := _qry || ' OR (crmacct_number ~* ' || quote_literal(pSearchText) || ') ';
  END IF;

  IF (pSearchName) THEN
    _qry := _qry || ' OR (crmacct_name ~* ' || quote_literal(pSearchText) || ') ';
  END IF;

  IF (pSearchContactName) THEN
    _qry := _qry || ' OR (cntct_first_name || '' '' || cntct_last_name ~* ' || quote_literal(pSearchText) || ') ';
  END IF;
  
  IF (pSearchPhone) THEN
    _qry := _qry || ' OR (cntct_phone || '' '' || cntct_phone2 || '' '' || cntct_fax ~* ' || quote_literal(pSearchText) || ') ';
  END IF;

  IF (pSearchEmail) THEN
    _qry := _qry || ' OR (cntct_email ~* ' || quote_literal(pSearchText) || ') ';
  END IF;

  _qry := _qry || ' ) ';
  
  IF (pIndentedDups) THEN
    _qry := _qry || ') data';
    _clause := ' GROUP BY cntctdup_level';
    IF (pCheckHnfc) THEN
      _clause := _clause || ',cntct_honorific';
    END IF;
    IF (pCheckFirst) THEN
      _clause := _clause || ',cntct_first_name';
    END IF;
    IF (pCheckMiddle) THEN
      _clause := _clause || ',cntct_middle';
    END IF;
    IF (pCheckLast) THEN
      _clause := _clause || ',cntct_last_name';
    END IF;
    IF (pCheckSuffix) THEN
      _clause := _clause || ',cntct_suffix';
    END IF;
    IF (pCheckEmail) THEN
      _clause := _clause || ',cntct_email';
    END IF;
    IF (pCheckPhone) THEN
      _clause := _clause || ',cntct_phone';
      _clause := _clause || ',cntct_phone2';
    END IF;

    _qry := _qry || _clause; 

    _clause := ' HAVING(';
    IF (pCheckHnfc) THEN
      _clause := _clause || 'OR COUNT(cntct_honorific) > 1 ';
    END IF;
    IF (pCheckFirst) THEN
      _clause := _clause || 'OR COUNT(cntct_first_name) > 1 ';
    END IF;
    IF (pCheckMiddle) THEN
      _clause := _clause || 'OR COUNT(cntct_middle) > 1 ';
    END IF;
    IF (pCheckLast) THEN
      _clause := _clause || 'OR COUNT(cntct_last_name) > 1 ';
    END IF;
    IF (pCheckSuffix) THEN
      _clause := _clause || 'OR COUNT(cntct_suffix) > 1 ';
    END IF;
    IF (pCheckEmail) THEN
      _clause := _clause || 'OR COUNT(cntct_email) > 1 ';
    END IF;
    IF (pCheckPhone) THEN
      _clause := _clause || 'OR (COUNT(cntct_phone) > 1 AND LENGTH(cntct_phone) > 0) ';
      _clause := _clause || 'OR (COUNT(cntct_phone2) > 1 AND LENGTH(cntct_phone2) > 0) ';
    END IF;
    _clause := _clause || ') ';
    _clause := overlay(_clause placing '' from 9 for 2);

    IF (pCheckHnfc) THEN
      _clause := _clause || 'AND LENGTH(cntct_honorific) > 0 ';
    END IF;
    IF (pCheckFirst) THEN
      _clause := _clause || 'AND LENGTH(cntct_first_name) > 0  ';
    END IF;
    IF (pCheckMiddle) THEN
      _clause := _clause || 'AND LENGTH(cntct_middle) > 0  ';
    END IF;
    IF (pCheckLast) THEN
      _clause := _clause || 'AND LENGTH(cntct_last_name) > 0  ';
    END IF;
    IF (pCheckSuffix) THEN
      _clause := _clause || 'AND LENGTH(cntct_suffix) > 0  ';
    END IF;
    IF (pCheckEmail) THEN
      _clause := _clause || 'AND LENGTH(cntct_email) > 0  ';
    END IF;
    
    _qry := _qry || _clause;
  END IF;

  _qry := _qry || ' ORDER BY cntct_last_name, cntct_first_name;'; 

-- raise exception '%',_qry;
  FOR _cntct IN
    EXECUTE _qry
  LOOP

    RETURN NEXT _cntct;

    -- If duplicates, get duplicates
    IF (pIndentedDups) THEN
    
      _qry := 'SELECT                
                 cntct.*,
                 crmacct_number, 
                 crmacct_name,
                 addr.*,
                 1 AS cntctdup_level
               FROM cntct()
                 LEFT OUTER JOIN crmacct ON (cntct_crmacct_id=crmacct_id) 
                 LEFT OUTER JOIN addr ON (cntct_addr_id=addr_id)
               WHERE (true) ';

      IF (pCheckHnfc) THEN
        _qry := _qry || ' AND (UPPER(cntct_honorific)=' || quote_literal(_cntct.cntct_honorific) || ')';
      END IF;

      IF (pCheckFirst) THEN
        _qry := _qry || ' AND (UPPER(cntct_first_name)=' || quote_literal(_cntct.cntct_first_name) || ')';
      END IF;

      IF (pCheckMiddle) THEN
        _qry := _qry || ' AND (UPPER(cntct_middle)=' || quote_literal(_cntct.cntct_middle) || ')';
      END IF;

      IF (pCheckLast) THEN
        _qry := _qry || ' AND (UPPER(cntct_last_name)=' || quote_literal(_cntct.cntct_last_name) || ')';
      END IF;

      IF (pCheckSuffix) THEN
        _qry := _qry || ' AND (UPPER(cntct_suffix)=' ||  quote_literal(_cntct.cntct_suffix) || ')';
      END IF;

      IF (pCheckPhone) THEN
        _qry := _qry || ' AND (cntct_phone=' || quote_literal(_cntct.cntct_phone)  || ')';
      END IF;

      IF (pCheckEmail) THEN
        _qry := _qry || ' AND (UPPER(cntct_email)=' || quote_literal(_cntct.cntct_email) || ')';
      END IF;

-- raise exception '%',_qry;
      FOR _cntctdup IN
        EXECUTE _qry
      LOOP
        RETURN NEXT _cntctdup;
      END LOOP;

    END IF;
    
  END LOOP;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';
