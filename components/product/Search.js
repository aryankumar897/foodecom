"use client"

import React, { useState } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

const categories = ['Category 1', 'Category 2', 'Category 3'];

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');

    const handleSearch = () => {
        console.log('Search Query:', searchQuery);
        console.log('Selected Category:', category);
        // Add your search logic here
    };

    return (
        <Box
            sx={{
  
                margin: '0 auto',
                width: '80%',
                maxWidth: '1070px',
          



                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: { sm: 'center' },
                marginTop: 3,
                 marginBottom: 3
            }}
        >
            <TextField
                label="Search"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                sx={{ marginBottom: { xs: 2, sm: 0 } }}
            />
            <FormControl
                variant="outlined"
                sx={{
                    minWidth: { xs: '100%', sm: 200 },
                    marginBottom: { xs: 2, sm: 0 }
                }}
            >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                    labelId="category-label"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                sx={{
                    width: { xs: '100%', sm: '1' },
                    height: 56,  // Set height as needed
                    backgroundColor: 'red',
                    '&:hover': {
                        backgroundColor: 'red'
                    }
                }}
            >
                Search
            </Button>
        </Box>
    );
};

export default SearchComponent;
