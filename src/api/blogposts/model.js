import mongoose from "mongoose";

const { Schema, model } = mongoose;

const commentsSchema = new Schema(
  {
    content: String,
  },
  {
    timestamps: true,
  }
);

const blogsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Author",
    },
    content: { type: String, required: true },
    comments: [commentsSchema],
  },
  {
    timestamps: true,
  }
);

// blogsSchema.static("findBlogsWithAuthors", async function (query) {
//   const total = await this.countDocuments(query.criteria);

//   const blogs = await this.find(query.criteria, query.options.fields)
//     .skip(query.options.skip)
//     .limit(query.options.limit)
//     .sort(query.options.sort)
//     .populate({
//       path: "comments",
//       select: "content",
//     });

//   return { total, blogs };
// });

export default model("Blog", blogsSchema);
