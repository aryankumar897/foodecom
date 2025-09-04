"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeBlogs } from "@/slice/blogSlice";
import { toast } from "react-toastify";

import Badge from "@mui/material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import CommentIcon from "@mui/icons-material/Comment";
import { styled } from "@mui/material/styles";
import EventIcon from "@mui/icons-material/Event";
import { useRouter } from "next/navigation";
import {
  Button,
  CardActions,
  Box,
  Grid,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "red",
    color: "white",
    width: "120px",
    height: "20px",
  },
}));

const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { homeBlogs: posts, loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchHomeBlogs());
  }, [dispatch]);

  const handleArticleClick = (articleId) => {
    router.push(`/blogs?slug=${articleId}`);
  };
  return (
    <Box sx={{ margin: "0 auto", width: "80%", maxWidth: "1080px" }}>
      <Box textAlign="center" mt={14}>
        <Typography variant="h4" gutterBottom>
          Our Blog
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Adjust the styles and properties to fit your specific components from
          Material-UI.
        </Typography>
      </Box>

      <Container sx={{ marginTop: "20px" }}>
        <Grid container spacing={3}>
          {loading ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%" }}
            >
              Loading blogs...
            </Typography>
          ) : posts.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", width: "100%" }}
            >
              No blogs found.
            </Typography>
          ) : (
            posts.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} md={4}>
                <Card sx={{ margin: "2px" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={post.thumb_image || "/images/default-blog.jpg"}
                    alt={post.title}
                    sx={{
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        <EventIcon sx={{ color: "red" }} />{" "}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>

                      <StyledBadge
                        badgeContent={post.author?.name || "Unknown"}
                        sx={{ ml: 1, mt: -10 }}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      ></StyledBadge>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 5, mt: 1 }}
                      >
                        <PersonIcon sx={{ color: "red" }} />{" "}
                        {post.author?.name || "Unknown"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 5, mt: 1 }}
                      >
                        <CommentIcon sx={{ color: "red" }} />{" "}
                        {post.comments?.length || 0} comments
                      </Typography>
                    </Box>

                    <Typography gutterBottom variant="body2" component="div">
                      {post.title}
                    </Typography>

                    <CardActions>
                      {" "}
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArticleClick(post.slug);
                        }}
                        sx={{ color: "#ff531a" }}
                        size="small"
                      >
                        Learn More
                      </Button>{" "}
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
