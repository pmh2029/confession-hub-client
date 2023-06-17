import { Card, Divider, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BiCategory } from "react-icons/bi";
import { getAllCategories } from "../api/categories";
import Loading from "./Loading";
import HorizontalStack from "./HorizontalStack";
const Categories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getAllCategories();
    console.log(data);
    setLoading(false);
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Card>
      <Stack spacing={2}>
        <HorizontalStack justifyContent="space-between">
          <HorizontalStack>
            <BiCategory />
            <Typography>Category</Typography>
          </HorizontalStack>
        </HorizontalStack>

        <Divider />

        {loading ? (
          <Loading />
        ) : (
          categories &&
          categories.map((category) => (
            <HorizontalStack justifyContent="space-between" key={category._id}>
              <HorizontalStack>
                <Typography>{category.categoryName}</Typography>
              </HorizontalStack>
              <HorizontalStack>
                <Typography>{category.postCount}</Typography>
              </HorizontalStack>
            </HorizontalStack>
          ))
        )}
      </Stack>
    </Card>
  );
};

export default Categories;
