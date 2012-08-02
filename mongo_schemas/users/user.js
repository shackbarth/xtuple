/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

XT.MongooseSchema.create({
  name: "User",
  definition: {
    id:           {type: String, required: true, index: {unique: true}}, // can be anything really?
    password:     {type: String, required: true},
    organizations:{type: [{}]}
  }
});