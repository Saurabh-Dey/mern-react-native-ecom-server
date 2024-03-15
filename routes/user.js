import express from "express";
import {
  changePassword,
  fotgetPassword,
  getMyProfile,
  logOut,
  login,
  resetPassword,
  signup,
  updatePic,
  updateProfile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/login", login);

router.post("/new", singleUpload, signup);

router.get("/me", isAuthenticated, getMyProfile);

router.get("/logout", isAuthenticated, logOut);

// Updating Routes

router.put("/updateprofile", isAuthenticated, updateProfile);

router.put("/changepassword", isAuthenticated, changePassword);

router.put("/updatepic", isAuthenticated, singleUpload, updatePic);

// Forget password & Reset Password

router.route("/forgetpassword").post(fotgetPassword).put(resetPassword);

export default router;
