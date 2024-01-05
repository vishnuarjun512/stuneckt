import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { resetUser, setUser } from "../redux/userSlice/userSlice";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { RiUserUnfollowFill } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";

const Dashboard = () => {
  const { userId, username } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialPost = { content: "" };
  const [updateForm, setUpdateUserForm] = useState({});
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(initialPost);
  const [allUsers, setAllUsers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [myPostsTrigger, setMyPostsTrigger] = useState(false);
  const [updateAlert, setUpdateAlert] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const res = await axios.get(
        `/api/post/getPosts/${userId}?page=${pageCount}`
      );
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      setAllPosts(res.data.data);
    };

    const fetchUserPosts = async () => {
      const res = await axios.get(
        `/api/post/getPost/${userId}?page=${pageCount}`
      );

      if (res.data.error) {
        toast.error(res.data.message);
        return;
      }
      setMyPosts(res.data.data);
    };

    if (myPostsTrigger) {
      fetchUserPosts();
    } else {
      fetchPostsAndUsers();
    }
  }, [pageCount]);

  useEffect(() => {
    const fetchPostsAndUsers = async () => {
      const res = await axios.get(
        `/api/post/getPosts/${userId}?page=${pageCount}`
      );
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      const users = await axios.get(`/api/user/getUsers/${userId}`);
      if (users.data.error) {
        toast.error(users.data.error);
        return;
      }

      setAllPosts(res.data.data);

      setAllUsers(
        users.data.data.filter((user) => !user.followers.includes(userId))
      );

      // setFollowers(
      //   users.data.data.filter((user) => user.followers.includes(userId))
      // );
    };

    const fetchFollowers = async () => {
      const res = await axios.get(`/api/follower/getFollowers/${userId}`);
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      setFollowers(res.data.data);
    };

    const fetchUserForm = async () => {
      try {
        const res = await axios.get(`/api/user/getUser/${userId}`);
        if (res.data.error) {
          toast.error(res.data.message);
          return;
        }
        setUpdateUserForm(res.data.data);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchPostsAndUsers();
    fetchFollowers();
    fetchUserForm();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const res = await axios.get(
        `/api/post/getPost/${userId}?page=${pageCount}`
      );

      if (res.data.error) {
        toast.error(res.data.message);
        return;
      }
      setMyPosts(res.data.data);
    };
    fetchUserPosts();
  }, [myPostsTrigger]);

  const followUser = async (toFollow) => {
    try {
      console.log(toFollow);
      const followUser = await axios.post(`/api/follower/follow/${userId}`, {
        toFollow,
      });
      if (followUser.data.error) {
        toast.error(followUser.data.message);
        return;
      }
      toast.success(followUser.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const unFollow = async (toUnfollow) => {
    try {
      console.log(toUnfollow);
      const unFollowed = await axios.post(`/api/follower/unFollow/${userId}`, {
        toUnfollow,
      });
      if (unFollowed.data.error) {
        toast.error(unFollowed.data.message);
        return;
      }
      toast.success(unFollowed.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await axios.post(`/api/follower/likePost/${userId}`, {
        postId,
      });
      if (res.data.error) {
        toast.error(res.data.mesage);
        return;
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const dislikePost = async (postId) => {
    try {
      const res = await axios.post(`/api/follower/unlikePost/${userId}`, {
        postId,
      });
      if (res.data.error) {
        toast.error(res.data.mesage);
        return;
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    toast.success(`Creating post - ${post.content}`);
    const res = await axios.post(`/api/post/create/${userId}`, post);
    if (res.data.error) {
      toast.error(res.error);
      return;
    }
    toast.success(res.data.message);
  };

  const deletePost = async (postId) => {
    const res = await axios.delete(`/api/post/deletePost/${postId}`);
    if (res.data.error) {
      toast.error(res.data.message);
      return;
    }
    toast.success(res.data.message);
  };

  const signout = async (e) => {
    const res = await axios.get(`/api/user/signout`);
    if (res.data.error) {
      toast.error(res.data.message);
    }
    toast.success(res.data.message);
    setTimeout(() => {
      dispatch(resetUser());
      navigate("/");
    }, [500]);
  };

  const commentOnPost = async (postId) => {
    try {
      const res = await axios.post(`/api/follower/comment/${userId}`, {
        postId,
        comment,
      });
      if (res.data.error) {
        toast.error(res.data.mesage);
        return;
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const unComment = async (postId, comment) => {
    try {
      const res = await axios.post(`/api/follower/uncomment/${userId}`, {
        postId,
        comment,
      });
      if (res.data.error) {
        toast.error(res.data.mesage);
        return;
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const res = await axios.post(`/api/user/updateUser/${userId}`, updateForm);
    if (res.data.error) {
      toast.error(res.data.mesage);
      return;
    }
    toast.success(res.data.mesage);
    dispatch(
      setUser({
        userId: res.data.newData._id,
        username: res.data.newData.username,
      })
    );
  };

  return (
    <div className="bg-blue-300 min-h-screen justify-start flex flex-col items-center">
      <ToastContainer />
      <div className="bg-red-400 p-3 flex  gap-3 items-center justify-between w-full ">
        <h1>Twitter Clone</h1>
        <h1>Welcome {username}</h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setMyPostsTrigger(!myPostsTrigger);
            }}
            className="bg-red-300 p-3 rounded-lg"
          >
            {myPostsTrigger ? "All" : "My"} Posts
          </button>
          <button
            onClick={() => {
              setUpdateAlert(!updateAlert);
            }}
            className="p-2 bg-green-600"
          >
            Profile
          </button>
          <button className="p-2 bg-red-600" onClick={signout}>
            Signout
          </button>
        </div>
      </div>
      {!updateAlert ? (
        <div className="flex justify-center items-start w-full">
          {/* Create Post */}
          <div className="w-1/5">
            <form
              onSubmit={createPost}
              className=" p-3 bg-pink-300 rounded-lg flex-col flex mr-auto justify-center items-center gap-3 w-full"
            >
              <input
                type="text"
                onChange={(e) => {
                  setPost({ ...post, content: e.target.value });
                }}
                className="p-3 rounded-lg outline-none"
                placeholder="Enter Content"
              />
              <button
                className="bg-gray-300 rounded-lg w-fit p-2"
                type="submit"
              >
                Create Post
              </button>
            </form>
            <div className="w-full">
              <h1 className="font-bold">Followers:</h1>
              <div className="flex flex-col gap-1 ">
                {followers?.map((follower, index) => {
                  return (
                    <div key={index} className="flex justify-center gap-2">
                      <p className="bg-blue-500 p-2">{follower.username}</p>
                      <button
                        className="bg-red-300 p-2"
                        onClick={() => {
                          unFollow(follower._id);
                        }}
                      >
                        <RiUserUnfollowFill />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* //All Posts */}
          {myPostsTrigger ? (
            <div className="w-3/5 bg-yellow-400 flex-col flex items-center justify-center gap-2">
              {myPosts?.length > 0 &&
                myPosts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="my-2 flex flex-col gap-2 bg-yellow-300 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <p>{post.content}</p>
                        <button
                          onClick={() => {
                            deletePost(post._id);
                          }}
                          className="bg-red-700 p-1 rounded-full"
                        >
                          <MdDelete />
                        </button>
                      </div>
                      {!post.likes.includes(userId) ? (
                        <button
                          onClick={() => {
                            likePost(post._id);
                          }}
                          className="bg-blue-500"
                        >
                          Like
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            dislikePost(post._id);
                          }}
                          className="bg-blue-500"
                        >
                          DisLike
                        </button>
                      )}
                      <p>Likes: {post.likes.length}</p>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          placeholder="Enter Comment"
                        />
                        <button
                          onClick={() => {
                            commentOnPost(post._id);
                          }}
                          className="bg-gray-300 p-1 rounded-lg"
                        >
                          Comment
                        </button>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        {post.comments.length > 0 &&
                          post.comments.map((c, index) => {
                            return (
                              <div className="bg-gray-200 p-1 flex gap-2">
                                <p>{c.comment}</p>
                                <button
                                  className="bg-red-700 p-1 hover:scale-125"
                                  onClick={() => {
                                    unComment(post._id, c.comment);
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              <button
                onClick={() => {
                  setPageCount(pageCount + 1);
                }}
                className="bg-gray-300"
              >
                More
              </button>
            </div>
          ) : (
            <div className="w-3/5 bg-yellow-400 flex-col flex items-center justify-center gap-2">
              {allPosts?.length > 0 &&
                allPosts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="my-2 flex flex-col gap-2 bg-yellow-300 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <p>{post.content}</p>
                        <button
                          onClick={() => {
                            deletePost(post._id);
                          }}
                          className="bg-red-700 p-1 rounded-full"
                        >
                          <MdDelete />
                        </button>
                      </div>
                      {!post.likes.includes(userId) ? (
                        <button
                          onClick={() => {
                            likePost(post._id);
                          }}
                          className="bg-blue-500"
                        >
                          Like
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            dislikePost(post._id);
                          }}
                          className="bg-blue-500"
                        >
                          DisLike
                        </button>
                      )}
                      <p>Likes: {post.likes.length}</p>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          onChange={(e) => {
                            setComment(e.target.value);
                          }}
                          placeholder="Enter Comment"
                        />
                        <button
                          onClick={() => {
                            commentOnPost(post._id);
                          }}
                          className="bg-gray-300 p-1 rounded-lg"
                        >
                          Comment
                        </button>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        {post.comments.length > 0 &&
                          post.comments.map((c, index) => {
                            return (
                              <div className="bg-gray-200 p-1 flex gap-2">
                                <p>{c.comment}</p>
                                <button
                                  className="bg-red-700 p-1 hover:scale-125"
                                  onClick={() => {
                                    unComment(post._id, c.comment);
                                  }}
                                >
                                  <MdDelete />
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              <button
                onClick={() => {
                  setPageCount(pageCount + 1);
                }}
                className="bg-gray-300"
              >
                More
              </button>
            </div>
          )}
          <div className="w-1/5 bg-green-500 flex flex-col">
            <h1>Users</h1>
            <div className="flex flex-col gap-1 items-center justify-start w-full">
              {allUsers?.length > 0 &&
                allUsers.map((user, index) => {
                  return (
                    <div
                      className="flex gap-2 hover:scale-110 transition-all duration-200 ease-in-out"
                      key={index}
                    >
                      <p>{user.username}</p>
                      {!user.followers.includes(userId) && (
                        <button
                          onClick={(e) => followUser(user._id)}
                          className="bg-green-200"
                        >
                          <SlUserFollow />
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-black/50 p-3 h-[100%] w-[40%] my-auto">
          <form
            className="flex flex-col gap-2 items-center justify-center"
            onSubmit={(e) => updateUser(e)}
          >
            <h1>Update Alert form</h1>
            <input
              type="text"
              placeholder="Username"
              value={updateForm?.username}
              onChange={(e) => {
                setUpdateUserForm({ ...updateForm, username: e.target.value });
              }}
            />
            <input
              type="text"
              placeholder="Email"
              value={updateForm?.email}
              onChange={(e) => {
                setUpdateUserForm({ ...updateForm, email: e.target.value });
              }}
            />

            <input
              type="password"
              placeholder="password"
              value={updateForm?.password}
              onChange={(e) => {
                setUpdateUserForm({ ...updateForm, email: e.target.value });
              }}
            />
            <button
              type="submit"
              className="bg-green-500 p-3 rounded-full hover:bg-green-300"
            >
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
