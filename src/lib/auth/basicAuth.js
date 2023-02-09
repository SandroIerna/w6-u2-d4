import createHttpError from "http-errors";
import atob from "atob";
import AuthorsModel from "../../api/authors/model.js";

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide credentials in the Authorization header!"
      )
    );
  } else {
    const encodedCredentials = req.headers.authorization.split(" ")[1];
    const decodedCredentials = atob(encodedCredentials);
    const [email, password] = decodedCredentials.split(":");
    const author = await AuthorsModel.checkCredentials(email, password);
    if (author) {
      req.author = author;
      next();
    } else {
      next(createHttpError(401, "Credentials not ok!"));
    }
  }
};
