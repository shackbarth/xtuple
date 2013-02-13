/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

X.MongooseSchema.create({
  name: "Datasource",
  definition: {
    name:         {type: String, index: {unique: true}},
    hostname:     {type: String}, 
    port:         {type: Number},
    description:  {type: String},
    location:     {type: String},
    dateAdded:    {type: Date}
  }
});