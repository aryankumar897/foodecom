"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, ImageList, ImageListItem } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ thumbImage, gallery }) {
  const [selectedImage, setSelectedImage] = useState(thumbImage);

  return (
    <Box>
      {/* Main Image with animation */}
      <Box
        sx={{
          width: "100%",
          aspectRatio: "4 / 3",
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <Image
              src={selectedImage}
              alt="Main Product Image"
              fill
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Gallery Thumbnails with hover effect */}
      <ImageList
        cols={4}
        gap={8}
        sx={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
          width: "100%",
        }}
      >
        {[thumbImage, ...gallery.map((item) => item.image)].map(
          (img, index) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={index}
              style={{
                width: 80,
                minWidth: 80,
                aspectRatio: "1 / 1",
                border:
                  selectedImage === img
                    ? "2px solid #f44336"
                    : "1px solid #ccc",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                flex: "0 0 auto",
              }}
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index}`}
                fill
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          )
        )}
      </ImageList>
    </Box>
  );
}
