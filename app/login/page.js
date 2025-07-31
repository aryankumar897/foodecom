"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


import {
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";


import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple,
} from "@mui/icons-material";

// Import styled components
import {
  AuthContainer,
  ImageSection,
  Overlay,
  ImageContent,
  FormSection,
  FormContainer,
  SocialButtonsContainer,
  AuthFooter,
  GoogleButton,
  FacebookButton,
  AppleButton,
} from "./loginStyles";
import { signIn } from "next-auth/react";

import { toast } from "react-toastify";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
       
      });

      if (result?.error) {
      toast.error(result.error);
      setError(result.error || "Login failed");
    } else {
      toast.success("Login successful");
      // Use result.url or the default "/"
      router.push(result?.url || "/");
    }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthContainer>
      {/* Animated Image Section */}
      <ImageSection
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Overlay />
        <ImageContent
          as={motion.div}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="h6">
            Discover amazing things and connect with people around the world.
          </Typography>
        </ImageContent>
      </ImageSection>

      {/* Form Section */}
      <FormSection>
        <FormContainer
          as={motion.div}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Sign In
            </Typography>
          </motion.div>

          <Box mt={4}>
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Typography
                    component="a"
                    href="/forgot-password"
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Typography color="error" align="center" mt={2}>
                    {error}
                  </Typography>
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    color: "white",
                    backgroundColor: "red",
                    "&:hover": {
                      backgroundColor: "red",
                    },
                  }}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="textSecondary">
                  OR CONTINUE WITH
                </Typography>
              </Divider>

              <Box display="flex" justifyContent="center" mt={2}>
                <SocialButtonsContainer>
                  <GoogleButton
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                    variant="contained"
                    startIcon={<Google />}
                    fullWidth
                  >
                    Google
                  </GoogleButton>

                  <FacebookButton
                    variant="contained"
                    startIcon={<Facebook />}
                    fullWidth
                  >
                    Facebook
                  </FacebookButton>

                  <AppleButton
                    variant="contained"
                    startIcon={<Apple />}
                    fullWidth
                  >
                    Apple
                  </AppleButton>
                </SocialButtonsContainer>
              </Box>
            </motion.div>

            <AuthFooter
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <Typography variant="body2">
                Don't have an account? <a href="/register">Create one now</a>
              </Typography>
            </AuthFooter>
          </Box>
        </FormContainer>
      </FormSection>
    </AuthContainer>
  );
};

export default LoginPage;
