import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Stack,
  TextField,
  Typography,
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
import { createPost } from "../api/posts";
import ErrorAlert from "./ErrorAlert";
import { getAllCategories } from "../api/categories";
import { isLoggedIn } from "../helpers/authHelper";
import HorizontalStack from "./HorizontalStack";
import UserAvatar from "./UserAvatar";

const PostEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const user = isLoggedIn();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(user);
        const categories = response.map((category) => category.categoryName);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    const errors = validate();
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const data = await createPost(formData, isLoggedIn());
    setLoading(false);
    if (data && data.error) {
      setServerError(data.error);
    } else {
      navigate("/posts/" + data._id);
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

  function getStyles(category, selectCategory, theme) {
    return {
      fontWeight:
        selectCategory === category
          ? theme.typography.fontWeightMedium
          : theme.typography.fontWeightRegular,
    };
  }

  const handleChipChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectCategory(selectedCategory);
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedCategory,
    }));
  };

  return (
    <Card>
      <Stack spacing={1}>
        {user && (
          <HorizontalStack spacing={2}>
            <UserAvatar width={50} height={50} username={user.username} />
            <Typography variant="h5">
              What would you like to post today {user.username}?
            </Typography>
          </HorizontalStack>
        )}

        <Typography>
          <a
            href="https://commonmark.org/help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Markdown Help
          </a>
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            required
            name="title"
            margin="normal"
            onChange={handleChange}
            error={errors.title !== undefined}
            helperText={errors.title}
          />
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="demo-single-chip-label" required={true}>
              Category
            </InputLabel>
            <Select
              labelId="demo-single-chip-label"
              id="demo-single-chip"
              value={selectCategory}
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
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  value={category}
                  style={getStyles(category, selectCategory, theme)}
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
    </Card>
  );
};

export default PostEditor;
