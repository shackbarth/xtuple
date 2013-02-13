/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

X.MongooseSchema.create({
  name: "Organization",
  definition: {
    name:           {type: String, index: {unique: true}},
    databaseServer: {type: String, required: true}, // maps to database name entry
    description:    {type: String},
    cloud:          {type: String} // TODO: eventually we should track instances too
  }
});