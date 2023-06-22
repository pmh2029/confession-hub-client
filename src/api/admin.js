import { BASE_URL } from "../config";
import fetch from "node-fetch";

const getAllUsers = async (admin) => {
  try {
    const res = await fetch(BASE_URL + "api/admin/get_all_users", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": admin.token,
      },
    });
    console.log(res);

    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteUser = async (userID, admin) => {
  try {
    const res = await fetch(BASE_URL + "api/admin/delete_user/" + userID, {
      method: "DELETE",
      headers: {
        "x-access-token": admin.token,
      },
    });
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const deleteCategory = async (categoryID, admin) => {
  try {
    const res = await fetch(
      BASE_URL + "api/admin/delete_category/" + categoryID,
      {
        method: "DELETE",
        headers: {
          "x-access-token": admin.token,
        },
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateCategory = async (categoryID, admin, data) => {
  try {
    const res = await fetch(
      BASE_URL + "api/admin/patch_category/" + categoryID,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": admin.token,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  } catch (err) {
    console.log(err);
  }
};

const createCategory = async (category, admin) => {
  try {
    const res = await fetch(BASE_URL + "api/admin/create_category", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": admin.token,
      },
      body: JSON.stringify(category),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getAllUsers, deleteUser, deleteCategory, updateCategory, createCategory };
