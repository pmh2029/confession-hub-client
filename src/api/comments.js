import { BASE_URL } from "../config";
import fetch from "node-fetch";

const getComments = async (params) => {
  try {
    const { id } = params;
    const res = await fetch(BASE_URL + "api/comments/post/" + id);
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const getUserComments = async (params) => {
  try {
    const { id, query } = params;
    const res = await fetch(
      BASE_URL + "api/comments/user/" + id + "?" + new URLSearchParams(query)
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createComment = async (comment, params, user) => {
  try {
    const { id } = params;
    const res = await fetch(BASE_URL + "api/comments/" + id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(comment),
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateComment = async (commentId, user, data) => {
  try {
    const res = await fetch(BASE_URL + "api/comments/" + commentId, {
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

const deleteComment = async (commentId, user) => {
  try {
    const res = await fetch(BASE_URL + "api/comments/" + commentId, {
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

export {
  getComments,
  getUserComments,
  createComment,
  updateComment,
  deleteComment,
};
