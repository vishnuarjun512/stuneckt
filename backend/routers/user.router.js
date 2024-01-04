import express from "express";
import {
  loginUser,
  registerUser,
  signout,
  profile,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/updateUser/:userId", verifyUser, updateUser);
router.get("/profile", verifyUser, profile);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.get("/getUser/:userId", getUser);
router.get("/getUsers/:userId", getAllUsers);
router.get("/signout", signout);

export default router;
