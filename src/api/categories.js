import { BASE_URL } from "../config";

const getAllCategories = async (token) => {
  try {
    const res = await fetch(BASE_URL + "api/categories", {
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getAllCategories };
