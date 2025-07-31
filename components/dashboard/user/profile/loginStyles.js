import { styled } from '@mui/material/styles';
import {Button} from "@mui/material"


export const AuthContainer = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f9fafb',
  flexDirection: 'column',
  '@media (min-width: 900px)': {
    flexDirection: 'row',
  },
});

export const ImageSection = styled('div')({
  flex: '0 0 100%',
  minHeight: '300px',
  backgroundImage: 'url(/images/res2.jpg)', // or use absolute path
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (min-width: 900px)': {
    flex: 1,
    minHeight: 'auto',
  },
});

export const Overlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.2)',
});

export const ImageContent = styled('div')({
  zIndex: 1,
  color: 'white',
  padding: '24px',
  textAlign: 'center',
  '@media (min-width: 600px)': {
    padding: '32px',
  },
  '& h3': {
    fontSize: '2rem',
    marginBottom: '16px',
    '@media (min-width: 600px)': {
      fontSize: '2.5rem',
    },
  },
  '& h6': {
    fontSize: '1.1rem',
    '@media (min-width: 600px)': {
      fontSize: '1.25rem',
    },
  },
});

export const FormSection = styled('div')({
  flex: '0 0 100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  '@media (min-width: 900px)': {
    flex: 1,
    padding: '32px',
  },
});

export const FormContainer = styled('div')({
  width: '100%',
  maxWidth: '490px',
  padding: '24px',
  borderRadius: '16px',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  '@media (min-width: 600px)': {
    padding: '32px',
    borderRadius: '24px',
    boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
  },
  '& h4': {
    fontSize: '1.5rem',
    '@media (min-width: 600px)': {
      fontSize: '2rem',
    },
  },
});



export const AuthFooter = styled('div')({
  textAlign: 'center',
  marginTop: '16px',
  fontSize: '0.875rem',
  '& a': {
    fontWeight: 600,
    color: '#6366f1',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  '@media (min-width: 600px)': {
    fontSize: '1rem',
  },
});

export const ResponsiveFormRow = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  '@media (min-width: 600px)': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const SocialButtonsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  margin: '24px 0',
  '@media (min-width: 500px)': {
    flexDirection: 'row',
    gap: '8px',
  },
});

export const SocialButton = styled(Button)(({ theme }) => ({
  flex: 1,
  padding: '10px 16px',
  textTransform: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  color: theme.palette.text.primary,
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
  '@media (min-width: 500px)': {
    fontSize: '0.8125rem',
    padding: '8px 12px',
  },
  '@media (min-width: 600px)': {
    fontSize: '0.875rem',
    padding: '10px 16px',
  },
}));

export const GoogleButton = styled(SocialButton)({
  backgroundColor: '#ffffff',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

export const FacebookButton = styled(SocialButton)({
  backgroundColor: '#1877f2',
  color: '#ffffff',
  borderColor: '#1877f2',
  '&:hover': {
    backgroundColor: '#166fe5',
  },
});

export const AppleButton = styled(SocialButton)({
  backgroundColor: '#000000',
  color: '#ffffff',
  borderColor: '#000000',
  '&:hover': {
    backgroundColor: '#1a1a1a',
  },
});