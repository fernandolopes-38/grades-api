export const gradeModel = (mongoose) => {
  const schema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    lastModified: {
      type: Date,
      required: true,
    },
  });

  schema.method('toJSON', () => {
    const { __v, _id, ...object } = this.toObject();

    console.log(__v);
    console.log(_id);

    object.id = _id;

    return object;
  });

  const model = mongoose.model('grades', schema);
  return model;
};