"use client";
import ReservationTimeTable from "@/components/dashboard/admin/reservationTime/list/ReservationTimeTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchReservationTimes } from "@/slice/reservationTimeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ReservationTimesPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: times, loading } = useSelector((state) => state.reservationTimes);

  useEffect(() => {
    dispatch(fetchReservationTimes());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/reservation-times/edit/${id}`);
  };

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
          Reservation Times Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred"
            }
          }}
          onClick={() => router.push("/dashboard/admin/reservation-times/create")}
        >
          Add New Time Slot
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <ReservationTimeTable
          times={times}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
};

export default ReservationTimesPage;