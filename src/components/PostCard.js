import { Card, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
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

import {} from "react-icons/ai";
import Markdown from "./Markdown";

import "./postCard.css";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import PostUpdateEditor from "./PostUpdateEditor";

const PostCard = (props) => {
  const { preview, removePost } = props;
  let postData = props.post;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = isLoggedIn();
  const isAuthor = user && user.username === postData.poster.username;

  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [post, setPost] = useState(postData);
  const [upvoteCount, setUpvoteCount] = useState(post.upvoteCount);
  const [downvoteCount, setDownvoteCount] = useState(post.downvoteCount);
  const [reloadPage, setReloadPage] = useState(false);

  let maxHeight = null;
  if (preview === "primary") {
    maxHeight = 250;
  }

  const handleDeletePost = async (e) => {
    e.stopPropagation();

    if (!confirm) {
      setConfirm(true);
    } else {
      setLoading(true);
      await deletePost(post._id, isLoggedIn());
      setLoading(false);
      if (preview) {
        removePost(post);
      } else {
        navigate("/");
      }
    }
  };

  const handleEditPost = async (e) => {
    e.stopPropagation();

    setEditing(!editing);
  };

  const handleEditorClose = () => {
    setEditing(false);
    setReloadPage(true);
  };

  useEffect(() => {
    if (reloadPage) {
      setReloadPage(false);
      window.location.reload();
    }
  }, [reloadPage]);

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
          <PostContentBox clickable={preview} post={post} editing={editing}>
            <HorizontalStack justifyContent="space-between">
              <ContentDetails
                username={post.poster.username}
                createdAt={post.createdAt}
                edited={post.edited}
                preview={preview === "secondary"}
              />
              <Box>
                {user &&
                  (isAuthor || user.isAdmin) &&
                  preview !== "secondary" && (
                    <HorizontalStack>
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
                      <IconButton
                        disabled={loading}
                        size="small"
                        onClick={handleDeletePost}
                      >
                        {confirm ? (
                          <AiFillCheckCircle color={theme.palette.error.main} />
                        ) : (
                          <BiTrash color={theme.palette.error.main} />
                        )}
                      </IconButton>
                    </HorizontalStack>
                  )}
              </Box>
            </HorizontalStack>
            {!editing && (
              <Typography
                variant="h5"
                gutterBottom
                sx={{ overflow: "hidden", mt: 1, maxHeight: 125 }}
                className="title"
              >
                {post.title}
              </Typography>
            )}
            {preview !== "secondary" &&
              (editing ? (
                <PostUpdateEditor
                  title={post.title}
                  category={post.category}
                  content={post.content}
                  postId={post._id}
                  onClose={handleEditorClose}
                />
              ) : (
                <Box
                  maxHeight={maxHeight}
                  overflow="hidden"
                  className="content"
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
