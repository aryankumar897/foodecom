
"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";

import  PostCard  from "@/components/menu/PostCard"

// Import slick styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function RelatedProduct({ currentProductId, categoryId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${process.env.API}/user/related-product`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentProductId, categoryId }),
        });
        const data = await res.json();
        setRelated(data.relatedProducts || []);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    if (currentProductId && categoryId) fetchRelated();
  }, [currentProductId, categoryId]);

  // Slider settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    focusOnSelect: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ mt: 4 }}>
     

     <Box
            textAlign="center"
            mt={14}
            sx={{
              margin: "0 auto",
              maxWidth: "600px",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              mt={1}
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: 900,
    
                textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
              }}
            >
              Related Items
            </Typography>
          </Box>

      {related.length > 0 ? (
        <Slider {...settings}>
          {related.map((product) => (
            <Box key={product._id} sx={{ px: 1 }}>
              <PostCard
                post={{
                  title: product.name,
                  categories: product.category_id?.name || "Uncategorized",
                  rating: 4.5,
                  imageUrl: product.thumb_image || "/default.jpg",
                  price: product.offer_price
                    ? `$${product.offer_price} (was $${product.price})`
                    : `$${product.price}`,
                  productId: product._id,
                  product_price: product.price,
                  product_offer_price: product.offer_price,
                  product_slug: product?.slug,
                }}
              />
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography variant="body1">No related products found.</Typography>
      )}
    </Box>
  );
}



