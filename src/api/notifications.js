import fetch from "node-fetch";
import { BASE_URL } from "../config";

const getNotifications = async (user) => {
  try {
    const res = await fetch(BASE_URL + "api/notifications/" + user.userId, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateNotification = async (user, notification) => {
  try {
    const res = await fetch(
      BASE_URL + "api/notifications/" + notification._id,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateNotifications = async (user, notifications) => {
  const data = { notifications: notifications };
  try {
    const res = await fetch(BASE_URL + "api/notifications/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

export { getNotifications, updateNotification, updateNotifications };
