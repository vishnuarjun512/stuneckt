import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

export const follow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const toFollow = req.body.toFollow;

    // To check if the User already following or not
    const checkFollowing = await User.findById(userId);
    if (
      checkFollowing.following &&
      Array.isArray(checkFollowing.following) &&
      checkFollowing.following.includes(toFollow)
    ) {
      res.status(201).json({ error: true, message: "Already Following" });
      return;
    }

    const mainUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { following: toFollow },
      },
      { new: true }
    );

    const secondUser = await User.findOneAndUpdate(
      { _id: toFollow },
      {
        $push: { followers: userId },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Followed Success",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: true, message: "Internal Server Error" });
  }
};

export const unfollow = async (req, res) => {
  try {
    const userId = req.params.userId;
    const toUnfollow = req.body.toUnfollow;
    console.log(userId, toUnfollow);

    const checkFollowing = await User.findById(userId);

    // Checking if checkFollowing.following exists and is an array
    if (
      !checkFollowing.following ||
      !Array.isArray(checkFollowing.following) ||
      !checkFollowing.following.includes(toUnfollow)
    ) {
      res.status(401).json({ error: true, message: "Not Following the User" });
      return;
    }

    const mainUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { following: toUnfollow },
      },
      { new: true }
    );

    const secondUser = await User.findOneAndUpdate(
      { _id: toUnfollow },
      {
        $pull: { followers: userId },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Unfollowed Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.params.userId;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(201).json({ error: true, message: "Post not found" });
    }

    // Check if the user already liked the post
    if (post.likes.includes(userId)) {
      return res
        .status(201)
        .json({ error: true, message: "Already liked the post" });
    }

    // Update the post's likes array
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: { likes: userId },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.params.userId;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(201).json({ error: true, message: "Post not found" });
    }

    // Check if the user already liked the post
    if (!post.likes.includes(userId)) {
      return res
        .status(201)
        .json({ error: true, message: "Didnt liked the post" });
    }

    // Update the post's likes array
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const comment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.params.userId;

    // Update the post's likes array
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: {
            userId,
            comment,
          },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Commented successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const uncomment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.params.userId;

    // Update the post's likes array
    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: {
          comments: { comment },
        },
      },
      { new: true }
    );

    return res.status(200).json({
      error: false,
      message: "Uncommented successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const getFollowers = async (req, res) => {
  const userId = req.params.userId;
  const limit = 5;
  const page = parseInt(req.query.page) || 1;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  try {
    const users = await User.find();

    //Finding the users whose Followers
    const filterNonFollowers = users
      .filter((user) => user.following.includes(userId))
      .slice(startIndex, endIndex);

    if (filterNonFollowers.length == 0) {
      const limitUsersWhenZero = users.slice(0, limit);
      return res.status(200).json({
        error: false,
        message: "All Followers Found",
        data: limitUsersWhenZero,
      });
    }

    if (!filterNonFollowers) {
      console.log("users not found");
      return res.status(201).json({ error: true, message: "User not found" });
    }

    const limit = res.status(200).json({
      error: false,
      message: "All Followers Found",
      data: filterNonFollowers,
    });
  } catch (error) {
    res.status(201).json({ success: false, message: "Internal Server Error" });
  }
};
