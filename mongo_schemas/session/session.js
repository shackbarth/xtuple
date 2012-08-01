/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global XT:true */

XT.MongooseSchema.create({
  name: "Session",
  definition: {
    id:           {type: String},
    sid:          {type: String, index: { unique: true }},
    lastModified: {type: Date},
    created:      {type: Date},
    checksum:     {type: String},
    organization: {type: String}
  }
});