import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "@/slice/addressSlice";
import {
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddressCard from "./AddressCard";

import AddAddressModal from "@/components/dashboard/user/address/modals/AddAddressModal";

import EditAddressModal from "@/components/dashboard/user/address/modals/EditAddressModal";
import DeleteAddressModal from "@/components/dashboard/user/address/modals/DeleteAddressModal";
import { addressStyles } from "./addressStyles";

const AddressList = ({ onAddressSelect }) => {
  const dispatch = useDispatch();
  const {
    list: addresses,
    loading,
    error,
  } = useSelector((state) => state.addresses);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleSelect = (address) => {
    setSelectedAddressId(address._id);
    onAddressSelect?.(address); // Pass to parent
  };

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setEditModalOpen(true);
  };

  const handleDelete = (address) => {
    setSelectedAddress(address);
    setDeleteModalOpen(true);
  };

  // const handleSelect = (address) => {
  //   onSelectAddress(address);
  // };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={addressStyles.container}>
      <Box sx={addressStyles.header}>
        <Typography variant="h4">My Addresses</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddModalOpen(true)}
          sx={addressStyles.addButton}
        >
          Add Address
        </Button>
      </Box>

      <Box sx={addressStyles.cardContainer}>
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelect={onAddressSelect ? handleSelect : null}
            isSelected={address._id === selectedAddressId}
          />
        ))}
      </Box>

      <AddAddressModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <EditAddressModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        address={selectedAddress}
      />
      <DeleteAddressModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        address={selectedAddress}
      />
    </Box>
  );
};

export default AddressList;
