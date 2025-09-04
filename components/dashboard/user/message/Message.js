// "use client";

// // components/ChatBox.js
// import React, { useState } from "react";
// import {
//   Avatar,
//   Box,
//   IconButton,
//   InputBase,
//   Paper,
//   Typography,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import chatStyles from "./chatStyles";

// const ChatBox = ({ currentUser = "user2" }) => {
//   const [messages, setMessages] = useState([
//     { id: 1, text: "Hi", sender: "user1" },
//     { id: 2, text: "hello", sender: "user1" },
//     { id: 3, text: "hello", sender: "user2" },
//     { id: 4, text: "000", sender: "user2", status: "sending" },
//     { id: 5, text: "hi", sender: "user1" },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSend = () => {
//     if (!input.trim()) return;
//     setMessages([
//       ...messages,
//       { id: Date.now(), text: input, sender: currentUser },
//     ]);
//     setInput("");
//   };

//   return (
//     <>
//       <Typography
//         variant="h6"
//         sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
//       >
//         Messages
//       </Typography>

//       <Box sx={chatStyles.chatWrapper}>
//         <Box sx={chatStyles.messagesContainer}>
//           {messages.map((msg) => (
//             <Box
//               key={msg.id}
//               sx={
//                 msg.sender === currentUser
//                   ? chatStyles.sentMessage
//                   : chatStyles.receivedMessage
//               }
//             >
//               {msg.sender !== currentUser && <Avatar sx={chatStyles.avatar} />}
//               <Box sx={chatStyles.messageBubble}>
//                 <Typography>{msg.text}</Typography>
//                 {msg.status === "sending" && (
//                   <Typography variant="caption" sx={{ color: "gray" }}>
//                     sending...
//                   </Typography>
//                 )}
//               </Box>
//               {msg.sender === currentUser && (
//                 <Avatar
//                   sx={chatStyles.avatar}
//                   src="/bot-avatar.png"
//                   alt="Bot Avatar"
//                 />
//               )}
//             </Box>
//           ))}
//         </Box>

//         <Paper
//           component="form"
//           sx={chatStyles.inputContainer}
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSend();
//           }}
//         >
//           <InputBase
//             sx={chatStyles.inputBox}
//             placeholder="Type a message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <IconButton onClick={handleSend} type="submit">
//             <SendIcon sx={{ color: "#ff1100ff" }} />
//           </IconButton>
//         </Paper>
//       </Box>
//     </>
//   );
// };

// export default ChatBox;

























"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import chatStyles from "./chatStyles";
import { pusherClient } from '@/lib/pusher';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const ChatBox = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get('/api/chats');
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
  }, []);

  // Set up Pusher
  useEffect(() => {
    if (!session) return;

    const channel = pusherClient.subscribe('chat-channel');

    channel.bind('new-message', (data) => {
      if (data.message.sender_id === session.user.id || data.message.receiver_id === session.user.id) {
        setMessages(prev => [...prev, data.message]);
      }
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

  const handleSend = async () => {
    if (!input.trim() || !session) return;

    try {
      const messageData = {
        sender_id: session.user.id,
        receiver_id: process.env.NEXT_PUBLIC_ADMIN_ID, // Set admin ID in env
        message: input
      };

      await axios.post('/api/chats', messageData);
      setInput("");
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleTyping = () => {
    pusherClient.trigger('chat-channel', 'typing', {
      userId: session.user.id,
      receiverId: process.env.NEXT_PUBLIC_ADMIN_ID
    });
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 1, fontWeight: "bold" }}
      >
        Messages
      </Typography>

      <Box sx={chatStyles.chatWrapper}>
        <Box sx={chatStyles.messagesContainer}>
          {messages
            .filter(msg => 
              msg.sender_id === session?.user.id || 
              msg.receiver_id === session?.user.id
            )
            .map((msg) => (
              <Box
                key={msg._id}
                sx={
                  msg.sender_id === session?.user.id
                    ? chatStyles.sentMessage
                    : chatStyles.receivedMessage
                }
              >
                {msg.sender_id !== session?.user.id && (
                  <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
                )}
                <Box sx={chatStyles.messageBubble}>
                  <Typography>{msg.message}</Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                {msg.sender_id === session?.user.id && (
                  <Avatar
                    sx={chatStyles.avatar}
                    src={session.user.image}
                    alt="User Avatar"
                  />
                )}
              </Box>
            ))}
          
          {isTyping && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '8px 16px',
              margin: '8px 0'
            }}>
              <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
              <Box sx={{ 
                backgroundColor: '#f0f0f0',
                borderRadius: '18px',
                padding: '8px 12px',
                maxWidth: '70%',
                display: 'flex',
                gap: '4px'
              }}>
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'typing 1.4s infinite ease-in-out'
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'typing 1.4s infinite ease-in-out',
                  animationDelay: '0.2s'
                }}></span>
                <span style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: '#666',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'typing 1.4s infinite ease-in-out',
                  animationDelay: '0.4s'
                }}></span>
              </Box>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        <Paper
          component="form"
          sx={chatStyles.inputContainer}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <InputBase
            sx={chatStyles.inputBox}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
          />
          <IconButton onClick={handleSend} type="submit">
            <SendIcon sx={{ color: "#ff1100ff" }} />
          </IconButton>
        </Paper>
      </Box>

      <style jsx>{`
        @keyframes typing {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ChatBox;