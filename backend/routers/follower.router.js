import express from "express";
import {
  follow,
  likePost,
  unfollow,
  unlikePost,
  comment,
  uncomment,
  getFollowers,
} from "../controllers/follower.controller.js";

const router = express.Router();

router.post("/follow/:userId", follow);
router.post("/unfollow/:userId", unfollow);
router.post("/likePost/:userId", likePost);
router.post("/unlikePost/:userId", unlikePost);
router.post("/comment/:userId", comment);
router.post("/uncomment/:userId", uncomment);
router.get("/getFollowers/:userId", getFollowers);

//If the user deactivates his account then remove all Posts created by User

export default router;
