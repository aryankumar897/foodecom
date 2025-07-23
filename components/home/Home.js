"use client";

import {
  Button,
  Box,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchHomeSliders } from "@/slice/sliderSlice";
import { useDispatch, useSelector } from "react-redux";
import { sliderStyles } from "./sliderStyles";
import { ColorfulSkeletonLoader } from "./ColorfulSkeletonLoader";

export default function ClientSaid() {
  const dispatch = useDispatch();
  const { list: sliders, loading } = useSelector((state) => state.sliders);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSliders = async () => {
      try {
        await dispatch(fetchHomeSliders()).unwrap();
      } catch (err) {
        setError("Failed to load sliders");
        console.error("Slider fetch error:", err);
      }
    };
    getSliders();
  }, [dispatch]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    focusOnSelect: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  if (loading) {
    return <ColorfulSkeletonLoader />;
  }

  if (error) {
    return (
      <Box sx={sliderStyles.errorContainer}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!sliders || sliders.length === 0) {
    return <ColorfulSkeletonLoader />;
  }

  return (
    <Box sx={sliderStyles.mainContainer}>
      <Slider {...settings}>
        {sliders.map((item, index) => (
          <Box
            key={index}
            sx={{
              ...sliderStyles.slideBox,
              backgroundImage: `url(${item.image})`,
            }}
          >
            <Box sx={sliderStyles.overlay}>
              <Typography
                variant="h3"
                gutterBottom
                sx={sliderStyles.offerText}
              >
                {item.offer}
              </Typography>
              <Typography
                variant="h3"
                gutterBottom
                sx={sliderStyles.titleText}
              >
                {item.title}
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                sx={sliderStyles.subtitleText}
              >
                {item.sub_title}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={sliderStyles.descriptionText}
              >
                {item.short_description}
              </Typography>
              <Button
                href={item.button_link}
                variant="contained"
                sx={sliderStyles.shopButton}
              >
                Shop Now
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}