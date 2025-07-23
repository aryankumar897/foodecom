import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";

import { updateAddress } from "@/slice/addressSlice";

import { fetchDeliveryAreas } from "@/slice/userdeliveryAreaSlice";


import { toast } from "react-toastify";
//import { addressStyles } from '../addressStyles';

import { addressStyles } from "@/components/dashboard/user/address/addressStyles";
import { fetchAddresses } from "@/slice/addressSlice";
const EditAddressModal = ({ open, onClose, address }) => {
  const dispatch = useDispatch();
 const { list: deliveryAreas, loading: areasLoading } = useSelector(
   (state) => state.userdeliveryAreas // Match Redux store key
 );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    type: "home",
    delivery_area_id: "",
  });

  const [selectedAreaDetails, setSelectedAreaDetails] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
     if (deliveryAreas.length === 0) {
    dispatch(fetchDeliveryAreas());
  }

    if (address) {
      setFormData({
        first_name: address.first_name,
        last_name: address.last_name,
        email: address.email,
        phone: address.phone,
        address: address.address,
        type: address.type,
        delivery_area_id: address.delivery_area_id,
      });

      if (address.delivery_area_id) {
        setSelectedAreaDetails(address.delivery_area_id);
      } else if (address.delivery_area_id) {
        const area = deliveryAreas.find(
          (a) => a._id === address.delivery_area_id
        );
        setSelectedAreaDetails(area);
      }
    }
  }, [dispatch, address, deliveryAreas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "delivery_area_id") {
      const selectedArea = deliveryAreas.find((area) => area._id === value);
      setSelectedAreaDetails(selectedArea);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    if (!formData.delivery_area_id) {
      toast.error("Please select a delivery area");
      setFormLoading(false);
      return;
    }

    try {
      await dispatch(
        updateAddress({
          id: address._id,
          addressData: formData,
        })
      ).unwrap();
       
   
      onClose();
      dispatch(fetchAddresses());
    } catch (error) {
      toast.error(`Error updating address: ${error.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={addressStyles.modal}>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Address
        </Typography>

        <form onSubmit={handleSubmit} style={addressStyles.form}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            multiline
            rows={3}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Address Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          >
            <MenuItem value="home">Home</MenuItem>
            <MenuItem value="work">Work</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="delivery-area-label">Delivery Area</InputLabel>
            <Select
              labelId="delivery-area-label"
              id="delivery_area_id"
              name="delivery_area_id"
              value={formData.delivery_area_id}
              label="Delivery Area"
              onChange={handleChange}
              disabled={areasLoading}
            >
              {areasLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                deliveryAreas.map((area) => (
                  <MenuItem key={area._id} value={area._id}>
                    {area.area_name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {selectedAreaDetails && (
            <Box sx={addressStyles.deliveryInfo}>
              <Typography variant="body2" sx={addressStyles.deliveryText}>
                            <strong>Delivery Area:</strong> {selectedAreaDetails.area_name}
                          </Typography>
              <Typography sx={addressStyles.deliveryText}>
                <strong>Delivery Fee:</strong> $
                {selectedAreaDetails.delivery_fee}
              </Typography>
              <Typography sx={addressStyles.deliveryText}>
                <strong>Delivery Time:</strong>{" "}
                {selectedAreaDetails.min_delivery_time} -{" "}
                {selectedAreaDetails.max_delivery_time}
              </Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={onClose} disabled={formLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formLoading}
            >
              {formLoading ? <CircularProgress size={24} /> : "Update Address"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditAddressModal;
