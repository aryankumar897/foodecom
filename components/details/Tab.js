"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import ReviewsAndFeedback from "./review";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ProductTabs({ product }) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        margin: "0 auto",
        width: "100%",
        maxWidth: "1100px",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="product tabs">
          <Tab
            label="Description"
            {...a11yProps(0)}
            sx={{
              marginRight: 2,
              color: "red",
              fontWeight: "bold",
              "&.Mui-selected": { color: "red" },
            }}
          />
          <Tab
            label="Review"
            {...a11yProps(1)}
            sx={{
              marginRight: 2,
              color: "red",
              fontWeight: "bold",
              "&.Mui-selected": { color: "red" },
            }}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "text.primary",
            lineHeight: 1.7,
          }}
        >
          {product?.long_description || "No description available."}
        </Typography>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <ReviewsAndFeedback 
        
        product={product}
        />
      </CustomTabPanel>
    </Box>
  );
}
