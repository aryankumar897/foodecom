// components/reservation/ReservationDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const ReservationDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    item: '',
  });

  const items = [
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' },
    { value: 'item3', label: 'Item 3' },
  ];

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{
        mr: 1,
        backgroundColor: '#e60000',
        color: 'white',
        '&:hover': {
          backgroundColor: '#e60000',
          color: 'white',
        },
      }}>
        Book a Table
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form to book a table.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Phone"
          type="tel"
          fullWidth
          variant="standard"
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="date"
          label="Date"
          type="date"
          fullWidth
          variant="standard"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="time"
          label="Time"
          type="time"
          fullWidth
          variant="standard"
          value={formData.time}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="item"
          label="Select Item"
          select
          fullWidth
          variant="standard"
          value={formData.item}
          onChange={handleChange}
        >
          {items.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} 
          sx={{
            mr: 1,
            backgroundColor: '#e60000',
            color: 'white',
            '&:hover': {
              backgroundColor: '#e60000',
              color: 'white',
            },
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit}
          sx={{
            mr: 1,
            backgroundColor: '#e60000',
            color: 'white',
            '&:hover': {
              backgroundColor: '#e60000',
              color: 'white',
            },
          }}
        >
          Book
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationDialog;