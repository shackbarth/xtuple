CREATE OR REPLACE FUNCTION saveAddr(int4, text, text, text, text, text, text, text, text, boolean, text, text)
  RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAddrId ALIAS FOR $1;
  pNumber ALIAS FOR $2;
  pAddr1 ALIAS FOR $3;
  pAddr2 ALIAS FOR $4;
  pAddr3 ALIAS FOR $5;
  pCity ALIAS FOR $6;
  pState ALIAS FOR $7;
  pPostalCode ALIAS FOR $8;
  pCountry ALIAS FOR $9;
  pActive ALIAS FOR $10;
  pNotes ALIAS FOR $11;
  pFlag ALIAS FOR $12;
  _addrId INTEGER;
  _addrNumber INTEGER;
  _flag TEXT;
  _p RECORD;
  _cnt INTEGER;
  _notes TEXT;

BEGIN
  --Validate
  IF ((pFlag IS NULL) OR (pFlag = '') OR (pFlag = 'CHECK') OR (pFlag = 'CHANGEONE') OR (pFlag = 'CHANGEALL')) THEN
    IF (pFlag='') THEN
      _flag := 'CHECK';
    ELSE
      _flag := COALESCE(pFlag,'CHECK');
    END IF;
  ELSE
	RAISE EXCEPTION 'Invalid Flag (%). Valid flags are CHECK, CHANGEONE or CHANGEALL', pFlag;
  END IF;

  _notes := COALESCE(pNotes,'');
  
  --If there is nothing here, get out
  IF ( (pNumber = '' OR pNumber IS NULL)
    AND (pAddr1 = '' OR pAddr1 IS NULL)
    AND (pAddr2 = '' OR pAddr2 IS NULL)
    AND (pAddr3 = '' OR pAddr3 IS NULL)
    AND (pCity = '' OR pCity IS NULL)
    AND (pState = '' OR pState IS NULL)
    AND (pPostalCode = '' OR pPostalCode IS NULL)
    AND (pCountry = '' OR pCountry IS NULL) ) THEN
    RETURN NULL;
  
  END IF;
  
  _addrId := COALESCE(pAddrId,-1);

  --If we have an ID see if anything has changed, if not get out
  IF (_addrId >= 0) THEN
    SELECT * FROM addr INTO _p
    WHERE ((pAddrId=addr_id)
    AND (COALESCE(pNumber,addr_number)=addr_number)
    AND (COALESCE(pAddr1, '')=COALESCE(addr_line1, ''))
    AND (COALESCE(pAddr2, '')=COALESCE(addr_line2, ''))
    AND (COALESCE(pAddr3, '')=COALESCE(addr_line3, ''))
    AND (COALESCE(pCity, '')=COALESCE(addr_city, ''))
    AND (COALESCE(pState, '')=COALESCE(addr_state, ''))
    AND (COALESCE(pPostalCode, '')=COALESCE(addr_postalcode, ''))
    AND (COALESCE(pCountry, '')=COALESCE(addr_country, ''))
    AND (pActive=addr_active)
    AND (_notes=COALESCE(addr_notes,'')));
    IF (FOUND) THEN
      RETURN _addrId;
    END IF;
  END IF;
 
  --Check to see if duplicate address exists

    SELECT addr_id, addr_notes INTO _p
    FROM addr 
    WHERE ((_addrId <> addr_id)
    AND  (COALESCE(UPPER(addr_line1),'') = COALESCE(UPPER(pAddr1),''))
    AND  (COALESCE(UPPER(addr_line2),'') = COALESCE(UPPER(pAddr2),''))
    AND  (COALESCE(UPPER(addr_line3),'') = COALESCE(UPPER(pAddr3),''))
    AND  (COALESCE(UPPER(addr_city),'') = COALESCE(UPPER(pCity),''))
    AND  (COALESCE(UPPER(addr_state),'') = COALESCE(UPPER(pState),''))
    AND  (COALESCE(UPPER(addr_postalcode),'') = COALESCE(UPPER(pPostalcode),''))
    AND  (COALESCE(UPPER(addr_country),'') = COALESCE(UPPER(pCountry),'')));
    IF (FOUND) THEN
	--Note:  To prevent overwriting of existing notes, the application
	--needs to load any existing notes for a matching address before altering them.
	IF (_notes <> _p.addr_notes) THEN
		UPDATE addr 
		SET addr_notes=addr_notes || '
' || _notes
		WHERE addr_id=_p.addr_id;
	END IF;
        RETURN _p.addr_id;  --A matching address exits
    END IF;
 
  IF (_addrId < 0) THEN
    _flag := 'CHANGEONE';
  END IF;

  IF (_flag = 'CHECK') THEN
    IF addrUseCount(_addrId) > 1 THEN
      RETURN -2;
    ELSIF (SELECT COUNT(addr_id)=0 FROM addr WHERE (addr_id=_addrId)) THEN
      _flag := 'CHANGEONE';
    ELSE
      _flag := 'CHANGEALL';
    END IF;
  END IF;

  IF (_flag = 'CHANGEALL') THEN
    _addrNumber := pNumber;
    IF (_addrNumber IS NULL) THEN
      SELECT addr_number INTO _addrNumber
        FROM addr
       WHERE(addr_id = _addrId);
      IF (_addrNumber IS NULL) THEN
        _addrNumber := fetchNextNumber('AddressNumber');
      END IF;
    END IF;
   
    UPDATE addr SET
      addr_line1 = pAddr1, addr_line2 = pAddr2, addr_line3 = pAddr3,
      addr_city = pCity, addr_state = pState,
      addr_postalcode = pPostalcode, addr_country = pCountry,
      addr_active = pActive, addr_notes = pNotes
    WHERE addr_id = _addrId;
    RETURN _addrId;

  ELSE
    SELECT NEXTVAL('addr_addr_id_seq') INTO _addrId;

    IF (_flag = 'CHANGEONE') THEN
      _addrNumber := fetchNextNumber('AddressNumber');
    ELSE
      _addrNumber := COALESCE(pNumber::text,fetchNextNumber('AddressNumber'));
    END IF;

    INSERT INTO addr ( addr_id, addr_number,
    addr_line1, addr_line2, addr_line3, 
    addr_city, addr_state, addr_postalcode, addr_country, 
    addr_active, addr_notes  
    ) VALUES ( _addrId, _addrNumber,
    pAddr1, pAddr2, pAddr3, 
    pCity, pState, pPostalcode, pCountry,
    pActive, _notes);
    RETURN _addrId;
	
  END IF;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION saveAddr(int4, text, text, text, text, text, text, text, text, text)
  RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pAddrId ALIAS FOR $1;
  pNumber ALIAS FOR $2;
  pAddr1 ALIAS FOR $3;
  pAddr2 ALIAS FOR $4;
  pAddr3 ALIAS FOR $5;
  pCity ALIAS FOR $6;
  pState ALIAS FOR $7;
  pPostalCode ALIAS FOR $8;
  pCountry ALIAS FOR $9;
  pFlag ALIAS FOR $10;
  _returnVal INTEGER;

BEGIN
 
  SELECT saveAddr(pAddrId,pNumber, pAddr1,pAddr2,pAddr3,pCity,pState,pPostalCode,pCountry,true,'',pFlag) INTO _returnVal;
  
  RETURN _returnVal;

END;
$$ LANGUAGE 'plpgsql';
