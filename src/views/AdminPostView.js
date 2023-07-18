import { Button, Input } from "antd";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Card, Stack, Typography, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllPosts, getUserUpvotedPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import Loading from "../components/Loading";
import PostCard from "../components/PostCard";
import SortBySelect from "../components/SortBySelect";
import HorizontalStack from "../components/HorizontalStack";

const AdminPostView = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();

  const [effect, setEffect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
      search: searchQuery,
    };

    let data;

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;

      data = await getAllPosts(user && user.token, query);
    } else if (props.contentType === "upvoted") {
      data = await getUserUpvotedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    if (data.data.length < 10) {
      setEnd(true);
    }

    setLoading(false);
    if (!data.error) {
      setPosts([...posts, ...data.data]);
      setCount(data.count);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => {
      fetchPosts();
    }, 60000);
    // Xóa bỏ interval khi component bị unmount
    return () => {
      clearInterval(interval);
    };
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, []);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const handleSearch = () => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-upvoteCount": "Upvotes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
      trending: "Trending",
    },
    upvoted: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  return (
    <>
      <Stack spacing={2}>
        <Card>
          <HorizontalStack justifyContent="space-between">
            <Stack direction="row" spacing={1}>
              <Input
                placeholder="Type keywords..."
                type="text"
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button
                size="large"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                Search
              </Button>
            </Stack>
            <SortBySelect
              onSortBy={handleSortBy}
              sortBy={sortBy}
              sorts={sorts}
            />
          </HorizontalStack>
        </Card>

        {posts.map((post, i) => (
          <PostCard
            preview="primary"
            key={post._id}
            post={post}
            removePost={removePost}
            openInNewTab={props.openInNewTab}
          />
        ))}

        {loading && <Loading />}
        {end ? (
          <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {posts.length > 0 ? (
                <>All posts have been viewed</>
              ) : (
                <>No posts available</>
              )}
            </Typography>
            <Button
              type="link"
              size="large"
              onClick={handleBackToTop}
              style={{
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontWeight: "500px",
                color: "#1976D2",
                fontSize: "13px",
              }}
            >
              BACK TO TOP
            </Button>
          </Stack>
        ) : (
          !loading &&
          posts &&
          posts.length > 0 && (
            <Stack pt={2} pb={6} alignItems="center" spacing={2}>
              <Button
                onClick={fetchPosts}
                type="link"
                style={{
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: "500px",
                  color: "#1976D2",
                  fontSize: "13px",
                }}
              >
                LOAD MORE
              </Button>
              <Button
                type="link"
                size="large"
                onClick={handleBackToTop}
                style={{
                  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: "500px",
                  color: "#1976D2",
                  fontSize: "13px",
                }}
              >
                BACK TO TOP
              </Button>
            </Stack>
          )
        )}
      </Stack>
    </>
  );
};

export default AdminPostView;
