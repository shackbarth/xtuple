CREATE FUNCTION tmpcreateTypeSeqiss() RETURNS VOID AS $$
BEGIN
  BEGIN
    CREATE TYPE seqiss AS (
      seqiss_number INTEGER,
      seqiss_time   TIMESTAMP WITH TIME ZONE
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Type seqiss already exists';
  END;
END;
$$ LANGUAGE PLPGSQL;

SELECT tmpcreateTypeSeqiss();
DROP FUNCTION tmpcreateTypeSeqiss();
