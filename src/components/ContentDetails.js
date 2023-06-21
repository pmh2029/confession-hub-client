import { Typography } from "@mui/material";
import React from "react";
import HorizontalStack from "./HorizontalStack";
import Moment from "react-moment";
import UserAvatar from "./UserAvatar";
import { Link } from "react-router-dom";

const ContentDetails = ({ username, createdAt, edited, preview, editedAt }) => {
  return (
    <HorizontalStack sx={{}}>
      <UserAvatar width={30} height={30} username={username} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        <Link
          color="inherit"
          underline="hover"
          onClick={(e) => {
            e.stopPropagation();
          }}
          to={"/users/" + username}
        >
          {username}
        </Link>
        {!preview && (
          <>
            {" "}
            ·{" "}
            {edited ? (
              <>
                <Moment fromNow>{editedAt}</Moment> <>(Edited)</>
              </>
            ) : (
              <>
                <Moment fromNow>{createdAt}</Moment>
              </>
            )}
          </>
        )}
      </Typography>
    </HorizontalStack>
  );
};

export default ContentDetails;
