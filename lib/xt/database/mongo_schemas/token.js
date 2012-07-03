
XT.MongooseSchema.create({
  name: "Token",
  definition: {
    key:        { type: String },
    translation:{ type: String },
    modified:   { type: Date },
    autor:      { type: String }
  }
});