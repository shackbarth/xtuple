/*jshint node:true, indent:2, curly:true eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global X:true */

X.MongooseSchema.create({
  name: "DictionaryEntry",
  definition: {
    key:                {type: String},
    translator:         {type: String},
    date:               {type: Date},
    translation:        {type: String}
  }
});
X.MongooseSchema.create({
  name: "Dictionary",
  definition: {
    id:                 {type: Number},
    xTupleVersion:      {type: String},
    languageName:       {type: String},
    languageVersion:    {type: Number},
    lexicon:            {type: [X.schemas.DictionaryEntry]}
  }
});
