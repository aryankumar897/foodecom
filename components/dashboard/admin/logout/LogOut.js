"use client";
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Logout from '@mui/icons-material/Logout';

export default function SimpleSignOutButton() {
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
    <Button
      variant="outlined"
      color="error"
      startIcon={<Logout />}
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}