import React, { useState, useEffect } from "react";
import { Card, Stack, Typography, Input, Divider } from "@mui/material";
import { BiCategory } from "react-icons/bi";
import { getAllCategories } from "../api/categories";
import { CLIENT_URL } from "../config";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getAllCategories();
    setCategories(res);
    setLoading(false);
  };

  useEffect(() => {
    if (searchText === "") {
      setFilteredCategories(categories);
    } else {
      const filteredData = categories.filter((category) =>
        category.categoryName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCategories(filteredData);
    }
  }, [searchText, categories]);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Card>
      <Stack spacing={2}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <BiCategory style={{ marginRight: 8 }} />
          <Typography>Category</Typography>
        </div>
        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Type keywords..."
            onChange={handleInputChange}
            value={searchText}
            type="text"
            fullWidth
          />
        </div>
        {filteredCategories.map((category) => (
          <div
            key={category._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <a
              href={CLIENT_URL + `posts/categories/${category._id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {category.categoryName}
            </a>
            <span style={{ marginLeft: 8 }}>{category.postCount}</span>
          </div>
        ))}
      </Stack>
    </Card>
  );
};

export default Categories;
