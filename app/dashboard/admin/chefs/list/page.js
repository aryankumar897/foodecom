"use client";
import ChefTable from "@/components/dashboard/admin/chef/list/ChefTable";
import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { fetchChefs } from "@/slice/chefSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ChefsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list: chefs, loading } = useSelector((state) => state.chefs);

  useEffect(() => {
    dispatch(fetchChefs());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/chefs/edit/${id}`);
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
          Chefs Management
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
          onClick={() => router.push("/dashboard/admin/chefs/create")}
        >
          Add New Chef
        </Button>
      </Box>

      {loading ? (
        <Box>Loading...</Box>
      ) : (
        <ChefTable chefs={chefs} onEdit={handleEdit} />
      )}
    </Box>
  );
};

export default ChefsPage;
