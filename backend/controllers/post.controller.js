import Post from "../models/Post.model.js";
import jwt from "jsonwebtoken";

export const createPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { content } = req.body;
    const newPost = await Post.create({ content, userRef: userId });

    return res.status(200).json({
      error: false,
      message: "Post Created Successfully",
      data: newPost,
    });
  } catch (error) {
    return res.status(404).json({
      error: true,
      message: `Post Creation Server Error -> ${error.message}`,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    const PostCheck = await Post.findByIdAndDelete(PostId);
    return res
      .status(200)
      .json({ error: false, message: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Post Deletion Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Post Deletion Server Error -> ${error.message}`,
    });
  }
};

export const deleteAll = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId);
    const PostCheck = await Post.deleteMany({ userRef: userId });
    return res.status(200).json({
      error: false,
      message: `Account and all related Posts Deleted Successfully`,
    });
  } catch (error) {
    console.log("Posts Deletion Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `All Posts Deletion Server Error -> ${error.message}`,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const Post = await Post.findById(id);
    return res.status(200).json({
      error: false,
      message: "Post Found Successfully",
      data: Post,
    });
  } catch (error) {
    console.log("Post Finding Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Post Finding Server Error -> ${error.message}`,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const limit = 5;
    const page = parseInt(req.query.page) || 1;

    console.log(page);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const userId = req.params.userId;
    const allPosts = await Post.find();

    const limitPosts = allPosts.slice(startIndex, endIndex);

    if (limitPosts.length == 0) {
      const limitPostsWhenZero = allPosts.slice(0, limit);
      return res.status(200).json({
        error: false,
        message: "All Posts Found Successfully",
        data: limitPostsWhenZero,
      });
    }

    return res.status(200).json({
      error: false,
      message: "All Posts Found Successfully",
      data: limitPosts,
    });
  } catch (error) {
    console.log("All Posts Finding Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `ALL Posts Finding Server Error -> ${error.message}`,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    console.log(PostId);
    const checkPost = await Post.findById(PostId);
    if (!checkPost) {
      return res.status(404).json({
        error: true,
        message: "Post not found",
      });
    }

    const { title: newTitle, content: newContent } = req.body;

    const updateFields = {
      title: newTitle,
      content: newContent,
      updatedAt: new Date(),
    };

    const PostCheck = await Post.findByIdAndUpdate(PostId, updateFields, {
      new: true,
    });

    const { _id, title, content, userRef, createdAt, updatedAt } =
      PostCheck._doc;

    const formattedPostWithReadableDate = {
      _id,
      title,
      content,
      userRef,
      createdAt: createdAt.toLocaleString(),
      updatedAt: updatedAt.toLocaleString(),
    };

    return res.status(200).json({
      error: false,
      message: "Post Updated Successfully",
      data: formattedPostWithReadableDate,
    });
  } catch (error) {
    console.log("Posts Updating Error -> ", error.message);
    return res.status(404).json({
      error: true,
      message: `Post Updating Server Error -> ${error.message}`,
    });
  }
};
