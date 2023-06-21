import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllPostsByCategory } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Navbar from "../components/NavBar";
import GoBack from "../components/GoBack";
import GridLayout from "../components/GridLayout";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import ErrorAlert from "../components/ErrorAlert";
import Sidebar from "../components/SideBar";

const PostCategoryView = () => {
  const params = useParams();

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();

  const fetchPostsByCategory = async () => {
    setLoading(true);
    const data = await getAllPostsByCategory(params.id, user && user.token);
    if (data.error) {
      setError(data.error);
    } else {
      setPosts(data.posts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPostsByCategory();
  }, []);

  return (
    <Container>
      <Navbar />
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
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />}
      />
    </Container>
  );
};

export default PostCategoryView;
