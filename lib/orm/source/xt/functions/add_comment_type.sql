drop function if exists xt.add_comment_type(text, text, text);

create or replace function xt.add_comment_type(text, text, text) returns boolean volatile as $$
DECLARE
   _module  ALIAS FOR $1;
   _comment ALIAS FOR $2;
   _descr   ALIAS FOR $3;
   _cmntid INTEGER;

BEGIN
  SELECT source_id INTO _cmntid
	FROM source WHERE source_name = _comment;

  IF (NOT FOUND) THEN
    INSERT INTO source (source_module, source_name, source_descrip)
      VALUES (_module, _comment, _descr) 
      RETURNING source_id INTO _cmntid;

  INSERT INTO cmnttypesource (cmnttypesource_cmnttype_id, cmnttypesource_source_id)
  	VALUES (1, _cmntid);  -- General Comments
  INSERT INTO cmnttypesource (cmnttypesource_cmnttype_id, cmnttypesource_source_id)
	  VALUES (2, _cmntid);  -- ChangeLog Comments
  
  END IF;

  RETURN true;

END;

$$ language 'plpgsql';


