"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeBanners } from "@/slice/bannerSlice"; // your banner slice action
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider() {
  const dispatch = useDispatch();
  const { homeBanners: banners, loading } = useSelector((state) => state.banners);
  const [mounted, setMounted] = useState(false); // fix SSR slider issue

  useEffect(() => {
    dispatch(fetchHomeBanners());
    setMounted(true);
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: banners.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3, infinite: true, dots: true } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  if (loading) return <Typography textAlign="center">Loading banners...</Typography>;
  if (!banners.length) return <Typography textAlign="center">No banners found</Typography>;

  return (
    <Box sx={{ backgroundColor: "#ffe6e6" }} p={10}>
      <Box sx={{ margin: "0 auto", width: "80%", maxWidth: "1070px" }}>
        {mounted && (
          <Slider {...settings}>
            {banners.map((banner) => (
              <Grid item xs={12} sm={6} md={4} key={banner._id}>
                <Card
                  sx={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", marginLeft: 1 }}
                >
                  <CardMedia
                    component="img"
                    image={banner.banner}
                    alt={banner.title}
                    sx={{ width: "100%", height: 230, objectFit: "cover" }}
                  />
                  <CardContent
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      color: "white",
                      padding: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 900,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
                        zIndex: 11111,
                      }}
                    >
                      {banner.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 600, zIndex: 11111 }}>
                      {banner.sub_title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Slider>
        )}
      </Box>
    </Box>
  );
}
