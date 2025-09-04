// // pages/chat.js
// import React, { useState, useEffect, useRef } from 'react';
// import { Box, Typography, TextField, IconButton, List, ListItem, Avatar, Badge } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import styles from './style';

// const users = [
//   { id: 1, name: 'Jhone Deo', online: true, avatar: 'https://i.pravatar.cc/150?img=3', lastSeen: '2 min ago' },
//   { id: 2, name: 'Sarah Smith', online: true, avatar: 'https://i.pravatar.cc/150?img=5', lastSeen: 'Online' },
//   { id: 3, name: 'Mike Johnson', online: false, avatar: 'https://i.pravatar.cc/150?img=7', lastSeen: '1 hour ago' },
//   { id: 4, name: 'Emily Wilson', online: true, avatar: 'https://i.pravatar.cc/150?img=9', lastSeen: 'Online' }
// ];

// const initialMessages = [
//   { id: 1, from: 'Jhone Deo', text: 'Hey there! How are you doing?', time: '10:30 AM' },
//   { id: 2, from: 'Jhone Deo', text: 'I was thinking we could meet up later this week', time: '10:31 AM' },
//   { id: 3, from: 'User', text: 'Hi Jhone! I\'m doing great, thanks for asking.', time: '10:32 AM' },
//   { id: 4, from: 'User', text: 'That sounds like a plan. When were you thinking?', time: '10:33 AM' },
//   { id: 5, from: 'Jhone Deo', text: 'How about Friday afternoon?', time: '10:35 AM' },
// ];

// const getUserAvatar = (name) => {
//   const user = users.find(u => u.name === name);
//   return user?.avatar || '';
// };

// export default function Chat() {
//   const [messages, setMessages] = useState(initialMessages);
//   const [newMessage, setNewMessage] = useState('');
//   const [activeUser, setActiveUser] = useState(users[0]);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (newMessage.trim() === '') return;

//     const newMsg = {
//       id: messages.length + 1,
//       from: 'User',
//       text: newMessage,
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setMessages([...messages, newMsg]);
//     setNewMessage('');

//     // Simulate reply after 1-2 seconds
//     setIsTyping(true);
//     setTimeout(() => {
//       const replies = [
//         "That's interesting!",
//         "I see what you mean.",
//         "Let me think about that...",
//         "Sounds good to me!",
//         "I'll get back to you on that."
//       ];
//       const replyMsg = {
//         id: messages.length + 2,
//         from: activeUser.name,
//         text: replies[Math.floor(Math.random() * replies.length)],
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       setMessages(prev => [...prev, replyMsg]);
//       setIsTyping(false);
//     }, 1000 + Math.random() * 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <Box sx={styles.container}>
//       <Box sx={styles.sidebar}>
//         <Typography variant="h6" sx={styles.title}>Chats</Typography>
//         <List>
//           {users.map((user) => (
//             <ListItem 
//               key={user.id} 
//               sx={{
//                 ...styles.userItem,
//                 ...(activeUser.id === user.id ? { '&.active': styles.userItem['&.active'] } : {})
//               }}
//               className={activeUser.id === user.id ? 'active' : ''}
//               onClick={() => setActiveUser(user)}
//             >
//               <Badge
//                 overlap="circular"
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                 badgeContent={user.online ? <Box sx={styles.onlineStatus} /> : null}
//               >
//                 <Avatar sx={styles.avatar} src={user.avatar} />
//               </Badge>
//               <Box sx={{ flex: 1 }}>
//                 <Typography fontWeight="600">{user.name}</Typography>
//                 <Typography variant="caption" color={user.online ? 'success.main' : 'text.secondary'}>
//                   {user.online ? 'Online' : user.lastSeen}
//                 </Typography>
//               </Box>
//             </ListItem>
//           ))}
//         </List>
//       </Box>

//       <Box sx={styles.chatWindow}>
//         <Typography variant="h6" sx={styles.title}>
//           Chat with {activeUser.name}
//           {activeUser.online && (
//             <Typography component="span" variant="caption" color="success.main" sx={{ ml: 1 }}>
//               ● Online
//             </Typography>
//           )}
//         </Typography>
        
//         <Box sx={styles.messageList}>
//           {messages.map((msg) => {
//             const isUser = msg.from === 'User';
//             return (
//               <Box 
//                 key={msg.id} 
//                 sx={{
//                   display: 'flex',
//                   justifyContent: isUser ? 'flex-end' : 'flex-start',
//                   alignItems: 'flex-end',
//                   gap: 1,
//                 }}
//               >
//                 {!isUser && <Avatar src={getUserAvatar(msg.from)} sx={styles.avatar} />}
//                 <Box sx={isUser ? styles.userMessage : styles.otherMessage}>
//                   <Typography>{msg.text}</Typography>
//                   <Typography sx={styles.messageTime}>{msg.time}</Typography>
//                 </Box>
//                 {isUser && <Avatar src={getUserAvatar(msg.from)} sx={styles.avatar} />}
//               </Box>
//             );
//           })}
          
//           {isTyping && (
//             <Box sx={styles.typingIndicator}>
//               <Typography variant="caption" sx={{ mr: 1 }}>{activeUser.name.split(' ')[0]} is typing</Typography>
//               <span></span>
//               <span></span>
//               <span></span>
//             </Box>
//           )}
          
//           <div ref={messagesEndRef} />
//         </Box>
        
//         <Box sx={styles.inputBox}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             sx={styles.inputField}
//             multiline
//             maxRows={4}
//           />
//           <IconButton 
//             color="primary" 
//             sx={styles.sendButton}
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim()}
//           >
//             <SendIcon />
//           </IconButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
















// pages/chat.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, Avatar, Badge } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './style';
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const getUserAvatar = (user) => {
  return user?.avatar || 'https://i.pravatar.cc/150?img=3';
};

export default function Chat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch users and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('/api/users');
        const messagesRes = await axios.get('/api/chats');
        
        setUsers(usersRes.data);
        if (usersRes.data.length > 0) {
          setActiveUser(usersRes.data[0]);
        }
        setMessages(messagesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Set up Pusher
  useEffect(() => {
    if (!session) return;

    const channel = pusherClient.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    channel.bind('update-message', (data) => {
      setMessages(prev => prev.map(msg => 
        msg._id === data.message._id ? data.message : msg
      ));
    });

    channel.bind('delete-message', (data) => {
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    });

    channel.bind('typing', (data) => {
      if (data.userId !== session.user.id && data.receiverId === session.user.id) {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeUser) return;

    try {
      const messageData = {
        sender_id: session.user.id,
        receiver_id: activeUser._id,
        message: newMessage
      };

      await axios.post('/api/chats', messageData);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (activeUser) {
      pusherClient.trigger('chat-channel', 'typing', {
        userId: session.user.id,
        receiverId: activeUser._id
      });
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.sidebar}>
        <Typography variant="h6" sx={styles.title}>Chats</Typography>
        <List>
          {users.map((user) => (
            <ListItem 
              key={user._id} 
              sx={{
                ...styles.userItem,
                ...(activeUser?._id === user._id ? { '&.active': styles.userItem['&.active'] } : {})
              }}
              className={activeUser?._id === user._id ? 'active' : ''}
              onClick={() => setActiveUser(user)}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={user.online ? <Box sx={styles.onlineStatus} /> : null}
              >
                <Avatar sx={styles.avatar} src={getUserAvatar(user)} />
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="600">{user.name}</Typography>
                <Typography variant="caption" color={user.online ? 'success.main' : 'text.secondary'}>
                  {user.online ? 'Online' : 'Offline'}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={styles.chatWindow}>
        {activeUser ? (
          <>
            <Typography variant="h6" sx={styles.title}>
              Chat with {activeUser.name}
              {activeUser.online && (
                <Typography component="span" variant="caption" color="success.main" sx={{ ml: 1 }}>
                  ● Online
                </Typography>
              )}
            </Typography>
            
            <Box sx={styles.messageList}>
              {messages
                .filter(msg => 
                  (msg.sender_id === session.user.id && msg.receiver_id === activeUser._id) ||
                  (msg.sender_id === activeUser._id && msg.receiver_id === session.user.id)
                )
                .map((msg) => {
                  const isUser = msg.sender_id === session.user.id;
                  return (
                    <Box 
                      key={msg._id} 
                      sx={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 1,
                      }}
                    >
                      {!isUser && <Avatar src={getUserAvatar(activeUser)} sx={styles.avatar} />}
                      <Box sx={isUser ? styles.userMessage : styles.otherMessage}>
                        <Typography>{msg.message}</Typography>
                        <Typography sx={styles.messageTime}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Box>
                      {isUser && <Avatar src={session.user.image} sx={styles.avatar} />}
                    </Box>
                  );
                })}
              
              {isTyping && (
                <Box sx={styles.typingIndicator}>
                  <Typography variant="caption" sx={{ mr: 1 }}>{activeUser.name.split(' ')[0]} is typing</Typography>
                  <span></span>
                  <span></span>
                  <span></span>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
            
            <Box sx={styles.inputBox}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={handleKeyPress}
                sx={styles.inputField}
                multiline
                maxRows={4}
              />
              <IconButton 
                color="primary" 
                sx={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>Select a user to start chatting</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
