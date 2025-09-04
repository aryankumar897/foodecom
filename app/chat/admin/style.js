// styles/style.js
const styles = {
  container: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    height: '90vh',
    width: '95%',
    maxWidth: '1200px',
    margin: '20px auto',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8faff',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
    }
  },
  sidebar: {
    width: { xs: '100%', md: '30%' },
    borderRight: { md: '1px solid rgba(0, 0, 0, 0.05)' },
    borderBottom: { xs: '1px solid rgba(0, 0, 0, 0.05)', md: 'none' },
    padding: 2,
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, rgba(114, 114, 226, 0.1) 0%, rgba(179, 179, 255, 0.05) 100%)',
      zIndex: 0
    }
  },
  chatWindow: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    boxSizing: 'border-box',
    backgroundColor: '#f8faff',
    position: 'relative'
  },
  title: {
    marginBottom: 2,
    fontWeight: '700',
    color: '#4a4a4a',
    fontSize: '1.2rem',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
    position: 'relative',
    zIndex: 1
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '12px',
    marginBottom: '8px',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 1,
    '&:hover': {
      backgroundColor: 'rgba(100, 100, 255, 0.1)',
      transform: 'translateX(5px)'
    },
    '&.active': {
      backgroundColor: 'rgba(100, 100, 255, 0.15)',
      boxShadow: '0 4px 12px rgba(100, 100, 255, 0.1)'
    }
  },
  avatar: {
    width: 44,
    height: 44,
    border: '2px solid #fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  onlineStatus: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    border: '2px solid #fff'
  },
  messageList: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: '16px',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.03) 1px, transparent 0)',
    backgroundSize: '20px 20px',
    '&::-webkit-scrollbar': {
      width: '6px'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '3px'
    }
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#fafafaff',
    color: '#352323ff',
    padding: '12px 16px',
    borderRadius: '18px 18px 0 18px',
    maxWidth: '70%',
    boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)',
    animation: 'messageAppear 0.3s ease',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 0',
    maxWidth: '70%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    animation: 'messageAppear 0.3s ease',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  messageTime: {
    fontSize: '0.7rem',
    color: 'rgba(0, 0, 0, 0.4)',
    marginTop: '4px',
    textAlign: 'right'
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.02)'
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '24px',
      backgroundColor: '#f5f7ff',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: 'transparent'
      },
      '&:hover fieldset': {
        borderColor: 'rgba(99, 102, 241, 0.3)'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgba(99, 102, 241, 0.5)',
        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
      }
    }
  },
  sendButton: {
    backgroundColor: '#6366f1',
    color: 'white',
    '&:hover': {
      backgroundColor: '#4f46e5',
      transform: 'scale(1.1)'
    },
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)'
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    alignSelf: 'flex-start',
    marginBottom: '8px',
    animation: 'messageAppear 0.3s ease',
    '& span': {
      height: '8px',
      width: '8px',
      backgroundColor: '#6366f1',
      borderRadius: '50%',
      display: 'inline-block',
      margin: '0 2px',
      animation: 'typingAnimation 1.4s infinite ease-in-out'
    },
    '& span:nth-of-type(2)': {
      animationDelay: '0.2s'
    },
    '& span:nth-of-type(3)': {
      animationDelay: '0.4s'
    }
  },
  '@global': {
    '@keyframes messageAppear': {
      '0%': {
        opacity: 0,
        transform: 'translateY(10px)'
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)'
      }
    },
    '@keyframes typingAnimation': {
      '0%, 60%, 100%': {
        transform: 'translateY(0)',
        opacity: 0.6
      },
      '30%': {
        transform: 'translateY(-5px)',
        opacity: 1
      }
    }
  }
};

export default styles;