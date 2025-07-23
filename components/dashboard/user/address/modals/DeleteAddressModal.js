import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { deleteAddress } from "@/slice/addressSlice";

import { addressStyles } from "@/components/dashboard/user/address/addressStyles";

//import { addressStyles } from '../addressStyles';

const DeleteAddressModal = ({ open, onClose, address }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteAddress(address._id));
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={addressStyles.modal}>
        <Typography variant="h6" component="h2">
          Delete Address
        </Typography>
        <Typography sx={addressStyles.deleteText}>
          Are you sure you want to delete this address?
        </Typography>
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteAddressModal;
