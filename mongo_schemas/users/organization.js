/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

XT.MongooseSchema.create({
  name: "Organization",
  definition: {
    name:       {type: String, index: {unique: true}},
    username:   {type: String}
  }
});