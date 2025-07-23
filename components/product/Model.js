// components/ProductCard.js
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Checkbox,
    Button,
    IconButton,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Rating from '@mui/material/Rating';

const ProductCard = () => {
    const [size, setSize] = useState('medium');
    const [cocoCola, setCocoCola] = useState(false);
    const [extraCheese, setExtraCheese] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const basePrice = 20;
    const sizePrices = {
        small: 15,
        medium: 20,
        large: 25,
    };
    const cocoColaPrice = 10;
    const extraCheesePrice = 5;

    const totalPrice =
        (sizePrices[size] +
            (cocoCola ? cocoColaPrice : 0) +
            (extraCheese ? extraCheesePrice : 0)) *
        quantity;

    const handleSizeChange = (event) => {
        setSize(event.target.value);
    };

    const handleQuantityChange = (increment) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + increment));
    };

    return (
        <Box
            sx={{
               
                margin: '0 auto',
             
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <img
                src="/images/res1.jpg"
                alt="Product"
                style={{ width: '100%', borderRadius: '8px' }}
            />
            <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                Product Title
            </Typography>
            <Rating name="product-rating" value={4} readOnly />
            <Typography variant="h6" color="text.secondary">
                ${basePrice}
            </Typography>

            <FormControl



                component="fieldset" sx={{ mt: 2 }}

            >
                <FormLabel component="legend">Size</FormLabel>
                <RadioGroup
                    aria-label="size"
                    name="size"
                    value={size}
                    onChange={handleSizeChange}
                >
                    <FormControlLabel
                        value="small"
                        control={<Radio

                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}


                        />}
                        label={`Small ($${sizePrices.small})`}
                    />
                    <FormControlLabel
                        value="medium"
                        control={<Radio
                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}



                        />}
                        label={`Medium ($${sizePrices.medium})`}
                    />
                    <FormControlLabel
                        value="large"
                        control={<Radio
                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}



                        />}
                        label={`Large ($${sizePrices.large})`}
                    />
                </RadioGroup>
            </FormControl>

            <Box sx={{ mt: 2 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}


                            checked={cocoCola}
                            onChange={() => setCocoCola(!cocoCola)}
                            name="cocoCola"
                        />
                    }
                    label="Coco Cola ($10)"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{
                                color: 'red',
                                '&.Mui-checked': {
                                    color: 'red',
                                },
                            }}

                            checked={extraCheese}
                            onChange={() => setExtraCheese(!extraCheese)}
                            name="extraCheese"
                        />
                    }
                    label="Extra Cheese ($5)"
                />
            </Box>

            <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}
            >
                <IconButton onClick={() => handleQuantityChange(-1)}>
                    <RemoveIcon />
                </IconButton>
                <Typography variant="body1">{quantity}</Typography>
                <IconButton onClick={() => handleQuantityChange(1)}>
                    <AddIcon />
                </IconButton>
            </Box>

            <Typography variant="h6" sx={{ mt: 2 }}>
                Total: ${totalPrice}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                    backgroundColor: 'red',
                    color: '#fff',
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    zIndex: 11111,
                    '&:hover': {
                        backgroundColor: 'red',


                    },
                }}
            >
                Add to Cart
            </Button>
        </Box>
    );
};

export default ProductCard;
