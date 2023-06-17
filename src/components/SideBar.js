import { Stack } from "@mui/material";
import React from "react";
import TopPosts from "./TopPosts";
import Categories from "./Categories";

const Sidebar = () => {
  return (
    <Stack spacing={2}>
      <TopPosts />
      <Categories />
    </Stack>
  );
};

export default Sidebar;
