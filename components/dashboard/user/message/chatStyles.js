// components/chatStyles.js
const chatStyles = {
  chatWrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '10px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  messagesContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sentMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '10px'
  },
  receivedMessage: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px'
  },
  messageBubble: {
    maxWidth: '60%',
    padding: '10px 15px',
    borderRadius: '15px',
    backgroundColor: '#f0f0f0',
    wordWrap: 'break-word'
  },
  avatar: {
    width: 30,
    height: 30
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    alignItems: 'center',
    borderTop: '1px solid #ccc'
  },
  inputBox: {
    flexGrow: 1,
    paddingLeft: '10px'
  }
};

export default chatStyles;
