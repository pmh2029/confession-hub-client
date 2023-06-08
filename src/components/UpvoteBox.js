import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../helpers/authHelper";

const UpvoteBox = (props) => {
  const { upvoteCount, onUpvote } = props;
  const theme = useTheme();
  const [upvoted, setUpvoted] = useState(props.upvoted);

  const navigate = useNavigate();

  const handleLike = (e) => {
    if (isLoggedIn()) {
      const newUpvotedValue = !upvoted;
      setUpvoted(newUpvotedValue);
      onUpvote(newUpvotedValue);
    } else {
      navigate("/login");
    }
  };

  return (
    <Stack alignItems="center">
      <IconButton sx={{ padding: 0.5 }} onClick={handleLike}>
        {upvoted ? (
          <IconContext.Provider value={{ color: theme.palette.primary.main }}>
            <AiFillLike />
          </IconContext.Provider>
        ) : (
          <AiOutlineLike />
        )}
      </IconButton>
      <Typography>{upvoteCount}</Typography>
    </Stack>
  );
};

export default UpvoteBox;
