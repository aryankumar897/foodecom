// app/dashboard/categories/page.jsx
"use client";
import ReservationTable from "@/components/dashboard/admin/reservation/Reservation";
import { Box, Typography } from "@mui/material";

const CategoriesPage = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          Resvertion Management
        </Typography>
      </Box>

      <ReservationTable/>
    </Box>
  );
};

export default CategoriesPage;
