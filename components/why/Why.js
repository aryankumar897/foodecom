"use client";
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

// CategoryCard component
const CategoryCard = ({ title, subtitle, Icon }) => {
  return (
    <Card
      sx={{
        minWidth: 275,
        backgroundColor: "red",
        color: "white",

        m: 1,
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "red",
          color: "white",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="center" mb={2}>
          {Icon && <Icon fontSize="large" />}
        </Box>
        <Typography variant="h6" component="div" align="center">
          {title}
        </Typography>
        <Typography variant="body2" align="center" m={2}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const dummyData = [
  {
    title: "Explore Our Menu",
    subtitle: "Discover delicious dishes crafted with fresh ingredients",
    icon: CategoryIcon,
  },
  {
    title: "Find a Location",
    subtitle: "Locate our nearest restaurant or order for delivery",
    icon: LocalDiningIcon,
  },
  {
    title: "Contact Us",
    subtitle: "Have questions? Reach out to our friendly team",
    icon: DirectionsCarIcon,
  },
];

export default function Home() {
  return (
    <Container
      sx={{
        mt: "32px",
        mb: "56px",
      }}
    >
      <Typography
        variant="h6"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 900,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        why choose us
      </Typography>

      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 900,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
        }}
      >
        why choose us
      </Typography>
      <Typography
        variant="body2"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "Roboto, sans-serif",
          fontWeight: 600,

          textShadow: "1px 1px 3px rgba(0,0,0,0.6)",

          zIndex: 11111,
        }}
      >
        See to all of the props and classes available to the
      </Typography>
      <Grid container spacing={3}>
        {dummyData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CategoryCard
              title={item.title}
              subtitle={item.subtitle}
              Icon={item.icon}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}




































