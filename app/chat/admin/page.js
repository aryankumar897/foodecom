"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, Avatar, Badge } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styles from './style';
import { useSession } from 'next-auth/react';
import Pusher from "pusher-js";

const getUserAvatar = (user) => {

 console.log("userxx", user)

  return user?.image || 'https://i.pravatar.cc/150?img=3';
};

export default function Chat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [pusherInstance, setPusherInstance] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch users with messages and unread counts
  useEffect(() => {
    const fetchData = async () => {
      try {


        const response = await fetch('http://localhost:3000/api/chats/users-with-messages');
       
       
       
        if (!response.ok) throw new Error('Failed to fetch users with messages');
        const { users, unreadCounts } = await response.json();
        
        setUsersWithMessages(users);
        setUnreadCounts(unreadCounts);
        
        if (users.length > 0) {
          setActiveUser(users[0]);
          markMessagesAsRead(users[0]._id);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Fetch messages for active user
  useEffect(() => {
    if (!activeUser) return;

    const fetchMessages = async () => {
      try {

        
        const response = await fetch(`http://localhost:3000/api/chats?receiver_id=${activeUser._id}`);
      
      
        if (!response.ok) throw new Error('Failed to fetch messages');
        const messagesData = await response.json();
        setMessages(messagesData);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, [activeUser]);

  // Set up Pusher for real-time updates
  useEffect(() => {
    if (!session) return;

    const pusher = new Pusher(process.env.KEY, {
      cluster: process.env.CLUSTER,
      forceTLS: true,
    });

    setPusherInstance(pusher);

    const channel = pusher.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      const { message } = data;
      
      if (message.sender_id === activeUser?._id || message.receiver_id === activeUser?._id) {
        setMessages(prev => [...prev, message]);
      }
      
      if (message.sender_id !== session.user._id && message.receiver_id === session.user._id) {
        setUnreadCounts(prev => ({
          ...prev,
          [message.sender_id]: (prev[message.sender_id] || 0) + 1
        }));
      }
    });

    channel.bind('typing', (data) => {
      if (data.userId !== session.user._id && data.receiverId === session.user._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [session, activeUser]);

  const markMessagesAsRead = async (userId) => {
    try {
      await fetch('http://localhost:3000/api/chats/mark-as-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: session.user._id
        }),
      });
      
      setUnreadCounts(prev => ({
        ...prev,
        [userId]: 0
      }));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  const handleUserClick = (user) => {
    setActiveUser(user);
    markMessagesAsRead(user._id);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeUser) return;

    try {
      const messageData = {
        sender_id: session.user._id,
        receiver_id: activeUser._id,
        message: newMessage
      };

      const response = await fetch('http://localhost:3000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');

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

  const handleChange = (e) => {
    setNewMessage(e.target.value);
    debouncedTyping();
  };

  const debouncedTyping = useCallback(() => {
    if (!activeUser || !session) return;
    
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/typing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user._id,
            receiverId: activeUser._id
          }),
        });

        if (!response.ok) throw new Error('Failed to send typing notification');
      } catch (err) {
        console.error('Error sending typing notification:', err);
      }
    }, 500);
  }, [activeUser, session]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.sidebar}>
        <Typography variant="h6" sx={styles.title}>Chats</Typography>
        <List>
          {usersWithMessages.map((user) => (
            <ListItem 
              key={user._id} 
              sx={{
                ...styles.userItem,
                ...(activeUser?._id === user._id ? { '&.active': styles.userItem['&.active'] } : {})
              }}
              className={activeUser?._id === user._id ? 'active' : ''}
              onClick={() => handleUserClick(user)}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  unreadCounts[user._id] > 0 && (
                    <Box sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}>
                      {unreadCounts[user._id]}
                    </Box>
                  )
                }
              >
                <Avatar sx={styles.avatar} src={getUserAvatar(user)} />
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="600">{user.name}</Typography>
                {/* Last message preview can be added here if needed */}
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
            </Typography>
            
            <Box sx={styles.messageList}>
              {messages
                .filter(msg => 
                  (msg.sender_id === session.user._id && msg.receiver_id === activeUser._id) ||
                  (msg.sender_id === activeUser._id && msg.receiver_id === session.user._id)
                )
                .map((msg) => {
                  const isUser = msg.sender_id === session.user._id;
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
                onChange={handleChange}
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