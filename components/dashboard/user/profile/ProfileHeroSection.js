import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { Typography } from '@mui/material';

const ImageSection = styled('div')({
  flex: '0 0 100%',
  minHeight: '300px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '@media (min-width: 900px)': {
    flex: 1,
    minHeight: '400px',
  },
});

const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
});

const ImageContent = styled('div')(({ theme }) => ({
  zIndex: 1,
  color: theme?.palette?.common?.white || '#ffffff', // Fallback to white
  padding: theme?.spacing?.(3) || '24px', // Fallback spacing
  textAlign: 'center',
  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  '@media (min-width: 600px)': {
    padding: theme.spacing(4),
  },
  '& h3': {
    fontSize: '2rem',
    marginBottom: '16px',
    fontWeight: 700,
    lineHeight: 1.2,
    '@media (min-width: 600px)': {
      fontSize: '2.5rem',
    },
    '@media (min-width: 900px)': {
      fontSize: '3rem',
    },
  },
  '& h6': {
    fontSize: '1.1rem',
    fontWeight: 400,
    opacity: 0.9,
    '@media (min-width: 600px)': {
      fontSize: '1.25rem',
    },
    '@media (min-width: 900px)': {
      fontSize: '1.5rem',
    },
  },
}));

export const ProfileHeroSection = ({ imageUrl, name, role }) => {
  return (
    <ImageSection
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        backgroundImage: `url(${imageUrl || '/images/profile-bg-default.jpg'})`,
      }}
    >
      <Overlay 
        as={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
      />
      
      <ImageContent
        as={motion.div}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Typography variant="h3" component="h1">
          {name || 'Your Profile'}
        </Typography>
        <Typography variant="h6" component="h2">
          {role || 'Update your information'}
        </Typography>
      </ImageContent>
    </ImageSection>
  );
};