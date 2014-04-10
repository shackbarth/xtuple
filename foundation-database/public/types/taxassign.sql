SELECT dropIfExists('FUNCTION', 'taxassignments(integer,integer)');
SELECT dropIfExists('TYPE', 'taxassign');

CREATE TYPE taxassign AS
   (taxassign_taxzone_id integer,
    taxassign_taxtype_id integer,
    taxassign_level integer,
    taxassign_zone_code "text",
    taxassign_type_descrip "text",
    taxassign_taxclass_code "text",
    taxassign_taxclass_sequence integer);
ALTER TYPE taxassign OWNER TO "admin";
