/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

require("./organization");

XT.MongooseSchema.create({
  name: "User",
  definition: {
    id:           {type: String}, // can be anything really?
    password:     {type: String},
    organizations:{type: [XT.schemas.OrganizationSchema]}
  }
});