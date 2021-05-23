import passport from "passport";
import AuthController from "../controllers/AuthController";
import { User } from "../db/models/user";
import { Upload } from "../db/models/upload";

const routes = (app) => {
  app.get("/", (req, res) =>
    res.send("Welcome to my Google Oauth express server")
  );

  app.post(
    "/oauth/google",
    passport.authenticate("google-oauth-token", { session: false }),
    AuthController.googleLogin
  );

  app.post("/upload", async (req, res) => {
    const { name, text, image } = req.body;
    try {
      const upload = new Upload({
        name,
        text,
        image,
      });
      upload.save();
      return res.status(200).send({ message: "Upload Successful" });
    } catch (e) {
      return res.status(404).send({ message: "Something went wrong!" });
    }
  });

  app.post("/settings", async (req, res) => {
    const { name, email, about } = req.body;
    try {
      User.findOneAndUpdate(
        { email: email },
        {
          name: name,
          about: about,
        }
      );
      return res.status(200).send({ message: "Changes Successful" });
    } catch (e) {
      return res.status(404).send({ message: "Something went wrong!" });
    }
  });

  app.get("/posts", async (req, res) => {
    try {
      const posts = await Upload.aggregate([{ $sample: { size: 10 } }]);
      return res.status(200).send({ posts, message: "Fetching Successful" });
    } catch (e) {
      return res.status(404).send({ message: "Something went wrong!" });
    }
  });
};

export default routes;
