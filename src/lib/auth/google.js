import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import AuthorsModel from "../../api/authors/model.js";
import { createAccessToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: `${process.env.BE_URL}/authors/googleRedirect`,
  },
  //(accessToken, refreshToken, profile, cb) -> normal parameters, but we don't use the first two
  async (_, __, profile, passportNext) => {
    console.log("PROFILE:", profile);

    try {
      const { email, given_name, family_name } = profile._json;
      const author = await AuthorsModel.findOne({ email });
      if (author) {
        const accessToken = await createAccessToken({
          _id: author._id,
          role: author.role,
        });
        passportNext(null, { accessToken });
      } else {
        const newAuthor = new AuthorsModel({
          name: given_name,
          surname: family_name,
          email,
          googleId: profile.id,
        });
        const createdAuthor = await newAuthor.save();

        const accessToken = await createAccessToken({
          _id: createdAuthor._id,
          role: createdAuthor.role,
        });
        passportNext(null, { accessToken });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default googleStrategy;
