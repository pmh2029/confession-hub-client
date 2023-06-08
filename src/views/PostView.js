import { Container, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Navbar from "../components/NavBar";
import GoBack from "../components/GoBack";
import GridLayout from "../components/GridLayout";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import Comments from "../components/Comments";
import ErrorAlert from "../components/ErrorAlert";
import Sidebar from "../components/SideBar";

const PostView = () => {
  const params = useParams();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();

  const fetchPost = async () => {
    setLoading(true);
    const data = await getPost(params.id, user && user.token);
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container>
      <Navbar />
      <GoBack />
      <GridLayout
        left={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />

              <Comments />
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

export default PostView;
