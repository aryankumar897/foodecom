"use client";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';

export default function StylishSignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
      callbackUrl: '/login'
    });
    router.push('/login');
    router.refresh();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh" // Centers vertically in viewport
    >
      <Button
        component={motion.button}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 4px 8px rgba(244, 67, 54, 0.3)"
        }}
        whileTap={{ scale: 0.98 }}
        variant="outlined"
        color="error"
        size="large"
        startIcon={<Logout sx={{ fontSize: 20 }} />}
        onClick={handleSignOut}
        sx={{
          px: 24,
          py: 1,
          borderRadius: 50, // Pill shape
          textTransform: 'none',
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: 0.5,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: 'rgba(244, 67, 54, 0.04)'
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
}