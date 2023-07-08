import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Typography,
  Link,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  getNotifications,
  updateNotification,
  updateNotifications,
} from "../api/notifications";
import { CLIENT_URL } from "../config";
import moment from "moment";

const NotificationsDropdown = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [displayedNotificationCount, setDisplayedNotificationCount] =
    useState(5);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(user);
      const { notifications, totalNotifications } = data;
      setNotifications(notifications);
      setTotalNotifications(totalNotifications);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1000);
    // Xóa bỏ interval khi component bị unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setDisplayedNotifications(
      notifications.slice(0, displayedNotificationCount)
    );
  }, [notifications, displayedNotificationCount]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async () => {
    setAnchorEl(null);
    setDisplayedNotificationCount(5); // Reset lại số lượng thông báo hiển thị khi đóng menu
    if (notifications.length <= 5) {
      setShowAllNotifications(true);
    } else {
      setShowAllNotifications(false);
    }
  };

  const handleViewAllNotifications = () => {
    if (notifications.length > 0) {
      setDisplayedNotificationCount(displayedNotificationCount + 5);
      if (displayedNotificationCount + 5 >= notifications.length) {
        setShowAllNotifications(true);
      }
      if (notifications.length <= 5) {
        setShowAllNotifications(true);
      }
    }
  };

  const markNotificationAsRead = async (notification) => {
    try {
      await updateNotification(user, notification);
      // Update the notification status locally
      const updatedNotifications = notifications.map((n) => {
        if (n._id === notification._id) {
          return { ...n, read: true };
        }
        return n;
      });
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    }
  };

  const markAllNotificationsAsRead = async (notifications) => {
    try {
      await updateNotifications(user, notifications);
      // Update the notification statuses locally
      const updatedNotifications = notifications.map((n) => {
        return { ...n, read: true };
      });
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    }
  };

  const getNotificationText = (notification) => {
    const timestamp = moment(notification.createdAt).fromNow();
    switch (notification.actionType) {
      case "upvote":
        return (
          <>
            <span style={{ fontWeight: "bold" }}>
              Someone upvoted on your{" "}
              <span style={{ color: "#1976D2" }}>
                #cfs{notification.postNumber}
              </span>
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>
              ({timestamp})
            </span>
          </>
        );
      case "downvote":
        return (
          <>
            <span style={{ fontWeight: "bold" }}>
              Someone downvoted on your{" "}
              <span style={{ color: "#1976D2" }}>
                #cfs{notification.postNumber}
              </span>
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>
              ({timestamp})
            </span>
          </>
        );
      case "comment":
        return (
          <>
            <span style={{ fontWeight: "bold" }}>
              Someone commented on your{" "}
              <span style={{ color: "#1976D2" }}>
                #cfs{notification.postNumber}
              </span>
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>
              ({timestamp})
            </span>
          </>
        );
      case "reply":
        return (
          <>
            <span style={{ fontWeight: "bold" }}>
              Someone reply to you at{" "}
              <span style={{ color: "#1976D2" }}>
                #cfs{notification.postNumber}
              </span>
            </span>
            <br />
            <span style={{ fontSize: "12px", color: "rgba(0, 0, 0, 0.6)" }}>
              ({timestamp})
            </span>
          </>
        );
      default:
        return "";
    }
  };

  const getPostLink = (notification) => {
    return `${CLIENT_URL}posts/${notification.postId}`;
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={totalNotifications} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "auto",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "center" }}
      >
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => {
                handleClose();
                markNotificationAsRead(notification);
              }}
            >
              <Typography variant="body2">
                <Link
                  href={getPostLink(notification)}
                  target="_blank"
                  underline="none"
                  color="inherit"
                >
                  {getNotificationText(notification)}
                </Link>
              </Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleClose}>
            <Typography variant="body2">Không có thông báo mới</Typography>
          </MenuItem>
        )}
        {notifications.length >= displayedNotificationCount &&
          !showAllNotifications && (
            <MenuItem>
              {notifications.length > displayedNotificationCount &&
                !showAllNotifications && (
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleViewAllNotifications}
                    sx={{ marginRight: "10px" }}
                  >
                    Show more
                  </Button>
                )}
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  handleClose();
                  markAllNotificationsAsRead(notifications);
                }}
              >
                Mark as read
              </Button>
            </MenuItem>
          )}
        {showAllNotifications &&
          notifications
            .slice(displayedNotificationCount)
            .map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => {
                  handleClose();
                  markNotificationAsRead(notification);
                }}
              >
                <Typography variant="body2">
                  <Link
                    href={getPostLink(notification)}
                    target="_blank"
                    underline="none"
                    color="inherit"
                  >
                    {getNotificationText(notification)}
                  </Link>
                </Typography>
              </MenuItem>
            ))}
        {showAllNotifications &&
          notifications.length > 0 &&
          notifications.length <= displayedNotificationCount && (
            <MenuItem
              onClick={handleClose}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  handleClose();
                  markAllNotificationsAsRead(notifications);
                }}
              >
                Mark as read
              </Button>
            </MenuItem>
          )}
      </Menu>
    </>
  );
};

export default NotificationsDropdown;
