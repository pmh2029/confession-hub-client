import { BASE_URL } from "../config";
import fetch from "node-fetch";

const getUserUpvotedPosts = async (upvoterId, token, query) => {
  try {
    const res = await fetch(
      BASE_URL +
        "api/posts/upvoted/" +
        upvoterId +
        "?" +
        new URLSearchParams(query),
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getAllPosts = async (token, query) => {
  try {
    const res = await fetch(
      BASE_URL + "api/posts?" + new URLSearchParams(query),
      {
        headers: {
          "x-access-token": token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getPost = async (postId, token) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createPost = async (post, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(post),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const updatePost = async (postId, user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deletePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const upvotePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/upvote/" + postId, {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const unUpvotePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/upvote/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const downvotePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/downvote/" + postId, {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const unDownvotePost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/downvote/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const reportPost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/report/" + postId, {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const unReportPost = async (postId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/report/" + postId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getAllPostsByCategory = async (categoryId, token) => {
  try {
    const res = await fetch(BASE_URL + "api/posts/categories/" + categoryId, {
      headers: {
        "x-access-token": token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  getUserUpvotedPosts,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  upvotePost,
  unUpvotePost,
  downvotePost,
  unDownvotePost,
  reportPost,
  unReportPost,
  getAllPostsByCategory,
};
