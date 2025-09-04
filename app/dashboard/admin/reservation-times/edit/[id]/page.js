"use client";

import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ReservationTimeForm from "@/components/dashboard/admin/reservationTime/edit/ReservationTimeForm";
import { useParams, useRouter } from "next/navigation";
import { fetchReservationTimeById, updateReservationTime } from "@/slice/reservationTimeSlice";
import { useDispatch, useSelector } from "react-redux";

const EditReservationTimePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [timeData, setTimeData] = useState(null);
  const { loading: updateLoading } = useSelector((state) => state.reservationTimes);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchReservationTimeById(id)).unwrap();
        setTimeData(data);
      } catch (error) {
        console.error("Failed to fetch time slot:", error);
        router.push("/dashboard/admin/reservation-time");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        updateReservationTime({
          id,
          timeData: values,
        })
      ).unwrap();
      router.push("/dashboard/admin/reservation-times/list");
    } catch (error) {
      console.error("Failed to update time slot:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!timeData) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Time slot not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Edit Time Slot
      </Typography>
      <ReservationTimeForm
        initialValues={timeData}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/dashboard/admin/reservation-times/list")}
        loading={updateLoading}
      />
    </Box>
  );
};

export default EditReservationTimePage;