"use client";

import { Box, Button, Container, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import Image from 'next/image';

// Keyframes for the animation
const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.2);
  }
  30% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.4);
  }
  70% {
    transform: scale(1.3);
  }
  90% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

// Styling for the components
const Root = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
    },
    height: '100vh',
}));

const LeftSide = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}));

const RightSide = styled(Box)(({ theme }) => ({
    flex: 1,
    position: 'relative',
    marginTop: theme.spacing(4), // Added margin from the top
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
        height: '50vh',
    },
}));

const LoadMoreButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const StyledImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    border: `4px solid red`, // Added border color
    borderRadius: theme.shape.borderRadius, // Optional: add border radius for a rounded effect
    height: '400px', // Custom height
    width: '400px', // Custom width
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const VideoIcon = styled(Box)(({ theme }) => ({
    position: 'absolute',
    width: 96,
    height: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    border: `4px solid red`, // Border color
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    animation: `${pulse} 2s infinite`,
    '&:hover': {
        backgroundColor: 'red',
    },
    '& svg': {
        width: 48,
        height: 48,
        fill: 'white', // Icon color
    },
}));

const About = () => {
    return (
        <Container maxWidth="lg">
            <Root>

                <RightSide>
                    <StyledImageContainer>
                        <Image
                            src="/images/res2.jpg"
                            alt="Background Image"
                            layout="fill"
                            objectFit="cover"
                        />
                        <VideoIcon>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="red"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14.752 11.168l-5.197-3.036a1 1 0 00-1.555.832v6.072a1 1 0 001.555.832l5.197-3.036a1 1 0 000-1.664z"
                                />
                            </svg>
                        </VideoIcon>
                    </StyledImageContainer>
                </RightSide>
                <LeftSide>
                    <Typography variant="h3" component="h1" gutterBottom>
                        About Us
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This is the description of our page. We offer various services and products that cater to your needs.
                        Navigate to http://localhost:3000/about to see the updated About page with the customized image dimensions, border color, and margin from the top.

                        Conclusion
                        With these updates, the image will have a custom height and width, a border color of #ff531a, and a margin from the top. This ensures the image is displayed with the desired styling and enhances the visual appeal of your About page.

                    </Typography>
                    <LoadMoreButton
                        sx={{
                            color: "white",
                            backgroundColor: 'red',
                            '&:hover': {
                                backgroundColor: 'red',
                                border: 'red',
                            },

                        }}
                    >
                        Load More
                    </LoadMoreButton>
                </LeftSide>
              
            </Root>
        </Container>
    );
};

export default About;
