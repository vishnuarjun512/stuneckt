import User from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const profile = (req, res) => {
  try {
    const token = req.cookies.auth_token;
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(403).json({ error: "Forbidden" });
      }
      res.status(200).json({ user: data.user });
    });
  } catch (err) {
    console.log(err);
    res.status(201).json({
      error: "Profile Server Error",
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    return res
      .status(200)
      .json({ error: false, data: user, message: "Retreived User Info" });
  } catch (error) {
    console.log("GetLogged Error -> ", error.message);
    return res
      .status(201)
      .json({ error: true, message: "Get User Server Failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const checkUser = await User.findOne({ $or: [{ username }, { email }] });
    if (!checkUser)
      //If User not found
      return res.status(201).json({ error: true, message: "User not found" });

    //Checking pAssword
    const checkPassword = bcryptjs.compareSync(password, checkUser.password);
    if (!checkPassword)
      return res
        .status(404)
        .json({ error: true, message: "Credentials dont match" });

    //Removing Password from the Response
    const { password: removingPassword, ...rest } = checkUser._doc;
    const token = jwt.sign(
      { userId: checkUser._id, user: rest },
      process.env.JWT_SECRET
    );
    return res
      .cookie("auth_token", token, { httpOnly: true })
      .status(200)
      .json({
        error: false,
        message: "Login Success",
        user: rest,
      });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: true, message: "Internal Server Error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, mobile, profilePic } = req.body;
    const data = await User.findOne({ $or: [{ email }, { username }] });

    if (data) {
      return res
        .status(201)
        .json({ error: true, message: "User already registered" });
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      mobile,
    });
    if (profilePic !== undefined) {
      newUser.profilePic = profilePic;
    }
    const savedUser = await newUser.save();
    return res
      .status(200)
      .json({ error: false, message: "Register Success", data: savedUser });
  } catch (error) {
    console.log(error);
    return res
      .status(201)
      .json({ error: true, message: "Internal Server Error" });
  }
};

export const signout = async (req, res) => {
  try {
    res
      .clearCookie("auth_token")
      .status(200)
      .json({ error: false, message: "Signout Success" });
  } catch (error) {
    console.log(error);
    res.status(201).json({ error: true, message: "Signout Success" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    console.log("Enter Delete User");
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      console.log("User Deletion Failed");
      return res
        .status(404)
        .json({ error: true, message: "User Deletion Failed" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(201).json({
      error: "Account deletion failed",
      message: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;
    console.log("username password -> ", username, password);

    let updateFields = {
      username,
      email,
    };

    // Check if password is provided
    if (password) {
      // Hash the password
      var hashedPass = bcryptjs.hashSync(password, 10);
      updateFields.password = hashedPass;
    }

    const userCheck = await User.findOneAndUpdate(
      { _id: userId },
      updateFields,
      { new: true } // Return the updated document
    );

    const newToken = jwt.sign(
      { userId: userCheck._id, user: userCheck },
      process.env.JWT_SECRET
    );
    res.cookie("auth_token", newToken, { httpOnly: true });
    console.log("Updated User -> ", userCheck);
    res.status(200).json({
      data: req.body,
      newData: userCheck,
      message: "User Update Success",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: "User Update Failed" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find();
    const filterUsers = users.filter((user) => user._id != userId);
    return res.status(200).json({ error: false, data: filterUsers });
  } catch (error) {
    console.log("GetLogged Error -> ", error.message);
    return res.status(201).json({ message: "Get User Server Failed" });
  }
};
