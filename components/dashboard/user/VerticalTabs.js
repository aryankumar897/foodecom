// VerticalTabs.js
"use client";
import React, { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import { usePathname } from "next/navigation";
import {
  
  StyledDivider,
  Root,
  StyledTabs,
  TabPanel,
} from "./styles";
import { tabItems, CustomTab } from "./TabItems";

import Footer from "@/components/footer/Footer";
function VerticalTabs({ children }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState(0);

  useEffect(() => {
    const activeTab = tabItems.find(item => pathname.startsWith(item.path));
    if (activeTab) {
      setValue(activeTab.value);
      if (typeof window !== "undefined") {
        localStorage.setItem("activeTab", activeTab.value);
      }
    }
  }, [pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", newValue);
    }
  };

  return (

<>
    <Box
      sx={{
        margin: "30px auto",
        width: "90%",
        maxWidth: "1800px",
      }}
    >
     
      <StyledDivider />
      <Root>
        <StyledTabs
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Food ordering dashboard tabs"
          scrollButtons={isMobile ? "auto" : false}
        >
          {tabItems.map((item) => (
            <CustomTab
              key={item.value}
              item={item}
              value={value}
              handleChange={handleChange}
            />
          ))}
        </StyledTabs>
        <TabPanel>
          {children}
        </TabPanel>
      </Root>
    </Box>

<Footer />
</>
  );
}

export default VerticalTabs;