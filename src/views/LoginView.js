import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { notification } from "antd";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/users";
import { loginUser } from "../helpers/authHelper";

const LoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await login(formData);
    if (data.error) {
      notification.error({
        message: "Faild",
        description: "Failed to login",
      });
    } else {
      loginUser(data);
      notification.success({
        message: "Success",
        description: "Successfully logged in",
      });
      navigate("/");
    }
  };

  return (
    <Container maxWidth={"xs"} sx={{ mt: 6 }}>
      <Stack alignItems="center">
        <Typography
          variant="h3"
          color="text.secondary"
          sx={{ mb: 3, alignItems: "center" }}
        >
          <Link style={{ textDecoration: "none", color: "rgba(0, 0, 0, 0.6)" }}>
            Confession Hub
          </Link>
        </Typography>
        <Typography variant="h4" color="rgba(0, 0, 0, 0.6)" gutterBottom>
          Login
        </Typography>
        <Typography color="text.secondary">
          Don't have an account yet?{" "}
          <Link to="/signup" style={{ color: "#1976d2" }}>
            Sign Up
          </Link>
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            autoComplete="email"
            autoFocus
            required
            id="email"
            name="email"
            onChange={handleChange}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            id="password  "
            name="password"
            onChange={handleChange}
            type="password"
          />

          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Login
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default LoginView;
