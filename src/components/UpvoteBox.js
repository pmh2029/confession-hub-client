import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  AiFillLike,
  AiOutlineLike,
  AiFillDislike,
  AiOutlineDislike,
} from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";

const UpvoteBox = (props) => {
  const { upvoteCount, onUpvote, downvoteCount, onDownvote } = props;
  const theme = useTheme();
  const [upvoted, setUpvoted] = useState(props.upvoted);
  const [downvoted, setDownvoted] = useState(props.downvoted);

  const navigate = useNavigate();

  const handleUpvote = (e) => {
    if (isLoggedIn()) {
      const newUpvotedValue = !upvoted;
      setUpvoted(newUpvotedValue);
      onUpvote(newUpvotedValue);
    } else {
      navigate("/login");
    }
  };

  const handleDownvote = () => {
    if (isLoggedIn()) {
      const newDownvotedValue = !downvoted;
      setDownvoted(newDownvotedValue);
      onDownvote(newDownvotedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <Stack alignItems="center">
      <IconButton sx={{ padding: 0.5 }} onClick={handleUpvote}>
        {upvoted ? (
          <IconContext.Provider value={{ color: theme.palette.primary.main }}>
            <AiFillLike />
          </IconContext.Provider>
        ) : (
          <AiOutlineLike />
        )}
      </IconButton>
      <Typography>{upvoteCount}</Typography>

      <IconButton sx={{ padding: 0.5 }} onClick={handleDownvote}>
        {downvoted ? (
          <IconContext.Provider value={{ color: theme.palette.primary.main }}>
            <AiFillDislike />
          </IconContext.Provider>
        ) : (
          <AiOutlineDislike />
        )}
      </IconButton>
      <Typography>{downvoteCount}</Typography>
    </Stack>
  );
};

export default UpvoteBox;
