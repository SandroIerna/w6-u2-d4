import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    birthDate: { type: Date, required: false },
    password: { type: String, required: false },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    googleId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

authorsSchema.pre("save", async function (next) {
  const currentAuthor = this;
  if (currentAuthor.isModified("password")) {
    const plainPassword = currentAuthor.password;
    currentAuthor.password = await bcrypt.hash(plainPassword, 10);
  }

  next();
});

authorsSchema.methods.toJSON = function () {
  const authorDoc = this;
  const author = authorDoc.toObject();
  delete author.password;
  delete author.createdAt;
  delete author.updatedAt;
  delete author.__v;
  return author;
};

authorsSchema.static("checkCredentials", async function (email, password) {
  const author = await this.findOne({ email });
  if (author) {
    const passwordMatch = await bcrypt.compare(password, author.password);
    if (passwordMatch) {
      return author;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

export default model("Author", authorsSchema);
