import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminLogin } from "../api/users";
import { loginUser } from "../helpers/authHelper";
import { notification } from "antd";

const AdminLoginView = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await adminLogin(formData);
    if (data.error) {
      notification.error({
        message: "Failed",
        description: "Failed to login",
      });
    } else {
      loginUser(data);
      notification.success({
        message: "Success",
        description: "Successfully logged in",
      });
      navigate("/admin");
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
          Admin Login
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

export default AdminLoginView;
