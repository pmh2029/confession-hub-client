import React, { useState, useRef, useEffect } from "react";
import { IconButton, Typography, useTheme } from "@mui/material";
import { Popconfirm } from "antd";
import { Box } from "@mui/system";
import { AiFillEdit, AiOutlineLine, AiOutlinePlus } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";
import CommentEditor from "./CommentEditor";
import ContentDetails from "./ContentDetails";
import HorizontalStack from "./HorizontalStack";
import { deleteComment, updateComment } from "../api/comments";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Markdown from "./Markdown";
import { MdCancel } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { BsReplyFill } from "react-icons/bs";
import Moment from "react-moment";

const Comment = (props) => {
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const { depth, addComment, removeComment, editComment } = props;
  const commentData = props.comment;
  const [minimised, setMinimised] = useState(depth % 4 === 3);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(commentData);
  const user = isLoggedIn();
  const isAuthor = user && user.userId === comment.commenter._id;
  const isPostAuthor = user && user.userId === comment.post.poster;

  const isAdmin = user && user.isAdmin;
  const navigate = useNavigate();
  const replyInputRef = useRef(null);

  const handleSetReplying = () => {
    if (isLoggedIn()) {
      setReplying(!replying);
      scrollToReplyInput();
    } else {
      navigate("/login");
    }
  };

  const scrollToReplyInput = () => {
    if (replyInputRef.current) {
      replyInputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const content = e.target.content.value;

    const updatedComment = await updateComment(comment._id, user, { content });

    const newCommentData = {
      ...comment,
      content: updatedComment.content,
      edited: true,
    };

    setComment(newCommentData);

    editComment(newCommentData);
    console.log(newCommentData);

    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteComment(comment._id, user);
    removeComment(comment);
  };

  let style = {
    backgroundColor: theme.palette.grey[100],
    borderRadius: 1.5,
    mb: theme.spacing(2),
    padding: theme.spacing(0),
  };

  if (depth % 2 === 1) {
    style.backgroundColor = "white";
  }

  useEffect(() => {
    if (replying) {
      scrollToReplyInput();
    }
  }, [replying]);

  return (
    <Box sx={style}>
      <Box
        sx={{
          pl: theme.spacing(2),
          pt: theme.spacing(1),
          pb: theme.spacing(1),
          pr: 1,
        }}
      >
        {props.profile ? (
          <Box>
            <Typography variant="h6">
              <Link underline="hover" to={"/posts/" + comment.post._id}>
                {comment.post.title}
              </Link>
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              <Moment fromNow>{comment.createdAt}</Moment>{" "}
              {comment.edited && <>(Edited)</>}
            </Typography>
          </Box>
        ) : (
          <HorizontalStack justifyContent="space-between">
            <HorizontalStack>
              <ContentDetails
                username={comment.commenter.username}
                createdAt={comment.createdAt}
                edited={comment.edited}
                editedAt={comment.editedAt}
              />

              <IconButton
                color="primary"
                onClick={() => setMinimised(!minimised)}
              >
                {minimised ? (
                  <AiOutlinePlus size={15} />
                ) : (
                  <AiOutlineLine size={15} />
                )}
              </IconButton>
            </HorizontalStack>
            {!minimised && (
              <HorizontalStack spacing={1}>
                <IconButton
                  variant="text"
                  size="small"
                  onClick={handleSetReplying}
                >
                  {!replying ? (
                    <BsReplyFill color={iconColor} />
                  ) : (
                    <MdCancel color={iconColor} />
                  )}
                </IconButton>
                {((isAuthor && !editing) || isAdmin || isPostAuthor) && (
                  <HorizontalStack spacing={1}>
                    {isAuthor && !editing && (
                      <IconButton
                        variant="text"
                        size="small"
                        onClick={() => setEditing(!editing)}
                      >
                        <AiFillEdit color={iconColor} />
                      </IconButton>
                    )}
                    {(isAuthor || isAdmin || isPostAuthor) && (
                      <Popconfirm
                        title="Are you sure you want to delete this comment?"
                        onConfirm={handleDelete}
                        okText="Yes"
                        cancelText="No"
                      >
                        <IconButton variant="text" size="small">
                          <BiTrash color={theme.palette.error.main} />
                        </IconButton>
                      </Popconfirm>
                    )}
                  </HorizontalStack>
                )}
              </HorizontalStack>
            )}
          </HorizontalStack>
        )}

        {!minimised && (
          <Box sx={{ mt: 1 }} overflow="hidden">
            {!editing ? (
              <Markdown content={comment.content} />
            ) : (
              <ContentUpdateEditor
                handleSubmit={handleSubmit}
                originalContent={comment.content}
                comment={comment}
              />
            )}

            {replying && !minimised && (
              <Box sx={{ mt: 2 }} ref={replyInputRef}>
                <CommentEditor
                  comment={comment}
                  addComment={addComment}
                  setReplying={setReplying}
                  label="What are your thoughts on this comment?"
                />
              </Box>
            )}
            {comment.children && (
              <Box sx={{ pt: theme.spacing(2) }}>
                {comment.children.map((reply, i) => (
                  <Comment
                    key={reply._id}
                    comment={reply}
                    depth={depth + 1}
                    addComment={addComment}
                    removeComment={removeComment}
                    editComment={editComment}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Comment;
