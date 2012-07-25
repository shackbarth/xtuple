
require("./token");

XT.MongooseSchema.create({
  name: "Language",
  definition: {
    language:   {type: String},
    version:    {type: String},
    revision:   {type: String},
    dictionary: {type: [XT.schemas.TokenSchema]} // note the name convention!
  }
});