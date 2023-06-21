import React, { useState, useEffect } from "react";
import {
  Button,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  Select,
  Chip,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { getAllPosts, getPost, updatePost } from "../api/posts";
import ErrorAlert from "./ErrorAlert";
import { getAllCategories, getCategory } from "../api/categories";
import { isLoggedIn } from "../helpers/authHelper";

const PostUpdateEditor = ({
  postId,
  title,
  category,
  content,
  onClose,
  onUpdatePost,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const user = isLoggedIn();
  const query = { sortBy: "-createdAt" };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(user);
        const categories = response.map((category) => category.categoryName.trim());
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    title: title,
    category: category,
    content: content,
    postId: postId,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const body = {
      title: formData.title,
      category: formData.category,
      content: formData.content,
    };
    const data = await updatePost(postId, isLoggedIn(), body);
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      const post = await getPost(data._id, isLoggedIn())
      onClose();
      onUpdatePost(post);
      navigate("/");
    }
  };

  const validate = () => {
    const errors = {};
    return errors;
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const theme = useTheme();
  const [selectCategory, setSelectCategory] = useState("");

  const handleChipChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectCategory(selectedCategory);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedCategory,
    }));
  };

  return (
    <Stack spacing={1}>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          required
          name="title"
          margin="normal"
          onChange={handleChange}
          value={formData.title}
          error={errors.title !== undefined}
          helperText={errors.title}
        />
        <FormControl sx={{ width: "100%" }}>
          <InputLabel id="demo-single-chip-label">Category</InputLabel>
          <Select
            labelId="demo-single-chip-label"
            id="demo-single-chip"
            value={formData.category}
            onChange={handleChipChange}
            input={
              <OutlinedInput
                id="select-single-chip"
                label="Category"
                required
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <Chip key={selected} label={selected} />
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {categories &&
              categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                >
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Content"
          multiline
          value={formData.content}
          rows={10}
          name="content"
          margin="normal"
          onChange={handleChange}
          error={errors.content !== undefined}
          helperText={errors.content}
          required
        />
        <ErrorAlert error={serverError} />
        <Button
          variant="outlined"
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            mt: 2,
          }}
        >
          {loading ? <>Submitting</> : <>Submit</>}
        </Button>
      </Box>
    </Stack>
  );
};

export default PostUpdateEditor;
