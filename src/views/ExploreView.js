import { Container } from "@mui/material";
import React from "react";
import Navbar from "../components/NavBar";
import GridLayout from "../components/GridLayout";
import PostBrowser from "../components/PostBrowser";
import Sidebar from "../components/SideBar";

const ExploreView = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExploreView;
