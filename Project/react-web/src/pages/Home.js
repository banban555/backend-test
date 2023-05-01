import React from "react";
import { Link } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
//import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

const Home = () => {
  return (
    <>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <TextField
          label="Email Address"
          required
          fullWidth
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          label="Password"
          type="password"
          required
          fullWidth
          name="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
          Sign in
        </Button>
        <Grid>
          <Grid item xs>
            <Link>Forgot password?</Link>
          </Grid>
          <Grid item>
            <nav>
              <Link to="/signup">Sign Up</Link>
            </nav>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
