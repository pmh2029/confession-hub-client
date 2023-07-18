import { Container, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPostsByCategory } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Navbar from "../components/NavBar";
import GoBack from "../components/GoBack";
import GridLayout from "../components/GridLayout";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import Sidebar from "../components/SideBar";
import { getCategory } from "../api/categories";
import { notification } from "antd";

const PostCategoryView = () => {
  const params = useParams();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const user = isLoggedIn();

  const fetchCategory = async () => {
    setLoading(true);
    const category = await getCategory(user, params.category_id);
    if (category.error) {
      notification.error({
        message: "Failed",
        description: "Category not found",
      });
    } else {
      setCategory(category);
    }
    setLoading(false);
  };

  const fetchPostsByCategory = async () => {
    setLoading(true);
    const data = await getAllPostsByCategory(
      params.category_id,
      user && user.token
    );
    if (data.error) {
      notification.error({
        message: "Failed",
        description: "Post with category not found",
      });
    } else {
      setPosts(data.posts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategory();
    fetchPostsByCategory();
  }, []);

  return (
    <Container>
      <Navbar />
      <Typography variant="h1" sx={{ marginBottom: "25px" }}>
        {category && category.categoryName}
        <Typography variant="body1" color="initial">
          Posts about {category && category.categoryName}
        </Typography>
      </Typography>
      <GoBack />
      <GridLayout
        left={
          loading ? (
            <Loading />
          ) : posts.length > 0 ? (
            <Stack spacing={2}>
              {posts.map((post) => (
                <PostCard post={post} key={post._id} />
              ))}
            </Stack>
          ) : null
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default PostCategoryView;
