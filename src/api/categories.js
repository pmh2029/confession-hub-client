import { BASE_URL } from "../config";

const getAllCategories = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/categories", {
      headers: {
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getCategory = async (user, categoryId) => {
  try {
    const res = await fetch(BASE_URL + "api/categories/" + categoryId, {
      headers: {
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getAllCategories, getCategory };
