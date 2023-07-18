import { useTheme } from "@emotion/react";
import { Box } from "@mui/material";
import React from "react";
import "react-router-dom";
import { useNavigate } from "react-router-dom";

const PostContentBox = (props) => {
  const { clickable, post, editing, openInNewTab } = props;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {clickable && !editing ? (
        <Box
          sx={{
            padding: theme.spacing(2),
            width: "92%",
            "&:hover": { backgroundColor: "grey.50", cursor: "pointer" },
          }}
          onClick={() => {
            if (openInNewTab) {
              window.open(`/posts/${post._id}`, "_blank");
            } else {
              window.location.href = `/posts/${post._id}`;
            }
          }}
        >
          {props.children}
        </Box>
      ) : (
        <Box sx={{ padding: theme.spacing(2), width: "90%" }}>
          {props.children}
        </Box>
      )}
    </>
  );
};

export default PostContentBox;
