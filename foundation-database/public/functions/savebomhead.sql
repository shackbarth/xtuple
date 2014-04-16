CREATE OR REPLACE FUNCTION saveBomHead(integer,text,date,text,numeric,numeric)
  RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pRevision ALIAS FOR $2;
  pRevisionDate ALIAS FOR $3;
  pDocumentNumber ALIAS FOR $4;
  pBatchSize ALIAS FOR $5;
  pRequiredQtyPer ALIAS FOR $6;
  _seq INTEGER;
  _p RECORD;
  _revid INTEGER;
  
BEGIN

  IF (NOT fetchMetricBool(''RevControl'')) THEN -- Deal with BOM if Rev Control Turned off
    SELECT bomhead_id INTO _seq
    FROM bomhead 
    WHERE (bomhead_item_id=pItemid);

    IF (NOT FOUND) THEN  -- No bomhead exists
      _seq := NEXTVAL(''bomhead_bomhead_id_seq'');
      
      INSERT INTO bomhead 
        (bomhead_id,bomhead_item_id,bomhead_docnum,bomhead_revision,
        bomhead_revisiondate,bomhead_batchsize,bomhead_requiredqtyper,bomhead_rev_id)
        VALUES 
        (_seq,pItemid, pDocumentNumber, pRevision, pRevisionDate, pBatchSize, pRequiredQtyPer,-1);   
    ELSE
      UPDATE bomhead SET
        bomhead_revision	= pRevision,
        bomhead_revisiondate	= pRevisionDate,
        bomhead_docnum		= pDocumentNumber,
        bomhead_batchsize	= pBatchSize,
        bomhead_requiredqtyper = pRequiredQtyPer
      WHERE (bomhead_id=_seq);
    END IF;
    
    RETURN _seq;
  ELSE  -- Deal with Revision Control
    IF (COALESCE(pRevision,'''') = '''' AND getActiveRevId(''BOM'',pItemid) != -1) THEN 
        RAISE EXCEPTION ''Revision Control records exist for item.  You must provide a new or existing revision number.'';
    END IF;
    
    SELECT * INTO _p
    FROM bomhead
      LEFT OUTER JOIN rev ON (bomhead_rev_id=rev_id),
      item
    WHERE ((bomhead_item_id=pItemid)
    AND (COALESCE(bomhead_revision,'''')=COALESCE(pRevision,''''))
    AND (bomhead_item_id=item_id));

    IF (NOT FOUND) THEN  -- This is a new bomhead record
      IF LENGTH(pRevision) > 0 THEN  -- We need to create a revision record   
        SELECT createbomrev(pItemid, pRevision) INTO _revid;
        
        UPDATE bomhead SET
          bomhead_revisiondate		= pRevisiondate,
          bomhead_docnum		= pDocumentNumber,
          bomhead_batchsize		= pBatchsize,
          bomhead_requiredqtyper	= pRequiredqtyper
        WHERE (bomhead_rev_id=_revid);
        
        SELECT bomhead_id INTO _seq
        FROM bomhead
        WHERE (bomhead_rev_id=_revid);
        
        RETURN _seq;      
      ELSE  -- Just create a regular bom header record
       _seq := NEXTVAL(''bomhead_bomhead_id_seq'');
       
       INSERT INTO bomhead 
        (bomhead_id,bomhead_item_id,bomhead_docnum,bomhead_revision,
        bomhead_revisiondate,bomhead_batchsize,bomhead_requiredqtyper,bomhead_rev_id)
        VALUES 
        (_seq,pItemid, pDocumentNumber, pRevision, pRevisionDate, pBatchSize, pRequiredQtyPer,-1);
        
        RETURN _seq;      
        
      END IF;
    ELSE  -- We need to update a record
      IF (_p.rev_status = ''I'') THEN
        RAISE EXCEPTION ''Revision % for % is inactive.  Update not allowed.'', _p.rev_number, _p.item_number;

      ELSIF (COALESCE(pRevision,'''') = COALESCE(_p.bomhead_revision,'''')) THEN  -- No change, just update
        UPDATE bomhead SET
          bomhead_revisiondate		= pRevisiondate,
          bomhead_docnum		= pDocumentNumber,
          bomhead_batchsize		= pBatchSize,
          bomhead_requiredqtyper	= pRequiredqtyper
        WHERE (bomhead_id=_p.bomhead_id);

        RETURN _p.bomhead_id;
        
      ELSE -- Need a new revision
        SELECT createbomrev(pItemid, pRevision) INTO _revid;
        
        UPDATE bomhead SET
          bomhead_revisiondate		= pRevisiondate,
          bomhead_docnum		= pDocumentNumber,
          bomhead_batchsize		= pBatchSize,
          bomhead_requiredqtyper	= pRequiredqtyper
        WHERE (bomhead_rev_id=_revid);

        SELECT bomhead_id INTO _seq
        FROM bomhead
        WHERE (bomhead_rev_id=_revid);
        
        RETURN _seq;
      END IF;
    END IF;
  END IF;

  RETURN _seq;

END;
' LANGUAGE 'plpgsql';
