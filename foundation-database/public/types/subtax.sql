SELECT dropIfExists('FUNCTION', 'getsubtax(integer,integer)');
SELECT dropIfExists('TYPE', 'subtax');

CREATE TYPE subtax AS
   (subtax_taxcode_id integer,
    subtax_taxcode_code "text",
    subtax_taxcode_descrip "text",
    subtax_taxcode_level integer);
ALTER TYPE subtax OWNER TO "admin";
