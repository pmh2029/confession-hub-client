import { Stack } from "@mui/material";
import React from "react";
import TopPosts from "./TopPosts";

const Sidebar = () => {
  return (
    <Stack spacing={2}>
      <TopPosts />
    </Stack>
  );
};

export default Sidebar;
