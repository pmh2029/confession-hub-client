import React, { useState, useEffect } from "react";
import {
  Card,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { AiFillCheckCircle, AiFillEdit, AiFillMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import {
  deletePost,
  upvotePost,
  unUpvotePost,
  downvotePost,
  unDownvotePost,
} from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import ContentDetails from "./ContentDetails";
import UpvoteBox from "./UpvoteBox";
import PostContentBox from "./PostContentBox";
import HorizontalStack from "./HorizontalStack";
import Markdown from "./Markdown";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import PostUpdateEditor from "./PostUpdateEditor";
import { getAllCategories } from "../api/categories";
import { CLIENT_URL } from "../config";
import { Popconfirm, message } from "antd"; // Import the Popconfirm component from the "antd" library

const PostCard = (props) => {
  const { preview, removePost, openInNewTab } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isOwner = user && user.username === postData.poster.username;
  const isAdmin = user && user.isAdmin;

  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);
  const [downvoteCount, setDownvoteCount] = useState(post.downvoteCount);
  const [categories, setCategories] = useState([]);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent the default behavior of the delete button (navigation)

    try {
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
      message.success("Post deleted successfully!");
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete the post. Please try again.");
    }
  };

  // Function to show the delete confirmation dialog
  const showDeleteConfirmation = () => {
    // Show the confirmation dialog
    Popconfirm.confirm({
      title: "Are you sure you want to delete this post?",
      okText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        setLoading(true);
        try {
          await deletePost(post._id, isLoggedIn());
          setLoading(false);
          if (preview) {
            removePost(post);
          } else {
            navigate("/");
          }
          message.success("Post deleted successfully!");
        } catch (error) {
          setLoading(false);
          message.error("Failed to delete the post. Please try again.");
        }
      },
      onCancel: (e) => {
        // Prevent the default behavior of the delete button (navigation) when canceled
        e.stopPropagation();
        e.preventDefault();
      },
    });
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleEditorClose = () => {
    setEditing(false);
  };

  const handleUpvoted = async (upvoted) => {
    if (upvoted) {
      setUpvoteCount(upvoteCount + 1);
      await upvotePost(post._id, user);
    } else {
      setUpvoteCount(upvoteCount - 1);
      await unUpvotePost(post._id, user);
    }
  };

  const handleDownvoted = async (downvoted) => {
    if (downvoted) {
      setDownvoteCount(downvoteCount + 1);
      await downvotePost(post._id, user);
    } else {
      setDownvoteCount(downvoteCount - 1);
      await unDownvotePost(post._id, user);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(user);
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleUpdatePost = (updatedPost) => {
    setPost(updatedPost); // Cập nhật dữ liệu bài đăng
    setEditing(false); // Tắt chế độ chỉnh sửa
  };

  return (
    <Card sx={{ padding: 0 }} className="post-card">
      <Box className={preview}>
        <HorizontalStack spacing={0} alignItems="initial">
          <Stack
            justifyContent="space-between "
            alignItems="center"
            spacing={1}
            sx={{
              backgroundColor: "grey.100",
              width: "50px",
              padding: theme.spacing(1),
            }}
          >
            <UpvoteBox
              upvoteCount={upvoteCount}
              upvoted={post.upvoted}
              onUpvote={handleUpvoted}
              downvoteCount={downvoteCount}
              downvoted={post.downvoted}
              onDownvote={handleDownvoted}
            />
          </Stack>
          <PostContentBox
            clickable={preview}
            post={post}
            editing={editing}
            openInNewTab={openInNewTab}
          >
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.poster.username}
                createdAt={post.createdAt}
                editedAt={post.editedAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user && (
                  <>
                    {isOwner && (
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleEditPost}
                      >
                        {editing ? (
                          <MdCancel color={iconColor} />
                        ) : (
                          <AiFillEdit color={iconColor} />
                        )}
                      </IconButton>
                    )}
                    {isOwner || isAdmin ? (
                      // Render the delete button inside the Popconfirm component
                      <Popconfirm
                        title="Are you sure you want to delete this post?"
                        onConfirm={handleDeletePost}
                        onCancel={() => {}}
                        okText="Yes"
                        cancelText="No"
                        disabled={loading}
                      >
                        <IconButton disabled={loading} size="small">
                          {confirm ? (
                            <AiFillCheckCircle
                              color={theme.palette.error.main}
                            />
                          ) : (
                            <BiTrash color={theme.palette.error.main} />
                          )}
                        </IconButton>
                      </Popconfirm>
                    ) : null}
                  </>
                )}
              </Box>
            </HorizontalStack>
            {!editing && (
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  overflow: "hidden",
                  mt: 1,
                  maxHeight: 125,
                }}
                className="title"
              >
                {post.title}
              </Typography>
            )}
            <Typography
              sx={{ mt: 1, justifyContent: "space-between", display: "flex" }}
            >
              <Link href={CLIENT_URL + `posts/${post._id}`} target="_blank">
                #cfs{post.postNumber}
              </Link>
              <Link
                href={CLIENT_URL + `posts/categories/${post.category._id}`}
                onClick={(e) => {
                  if (!isLoggedIn()) {
                    e.preventDefault();
                    navigate("/login");
                  }
                }}
              >
                {post.category.categoryName}
              </Link>
            </Typography>
            {preview !== "secondary" &&
              (editing ? (
                <PostUpdateEditor
                  title={post.title}
                  category={post.category.categoryName}
                  content={post.content}
                  postId={post._id}
                  onClose={handleEditorClose}
                  onUpdatePost={handleUpdatePost}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
                  sx={{ mt: 1 }}
                >
                  <Markdown content={post.content} />
                </Box>
              ))}
            <HorizontalStack sx={{ mt: 1 }}>
              <AiFillMessage />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                {post.commentCount}
              </Typography>
            </HorizontalStack>
          </PostContentBox>
        </HorizontalStack>
      </Box>
    </Card>
  );
};

export default PostCard;
