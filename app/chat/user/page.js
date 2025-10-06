// "use client";
// import React, { useState, useEffect, useRef } from "react";
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
// import { useSession } from "next-auth/react";
// import Pusher from "pusher-js";

// const ChatBox = () => {
//   const { data: session } = useSession();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [isSending, setIsSending] = useState(false); // Add sending state
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/chats');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         setMessages(data);
//       } catch (err) {
//         console.error('Error fetching messages:', err);
//       }
//     };

//     fetchMessages();
//   }, []);

//   // Set up Pusher
//   useEffect(() => {
//     if (!session) return;

//     const pusher = new Pusher(process.env.KEY, {
//       cluster: process.env.CLUSTER,
//       forceTLS: true,
//     });

//     const channel = pusher.subscribe('chat-channel');

//     channel.bind('new-message', (data) => {
//       if (
//         data.message.sender_id === session.user._id ||
//         data.message.receiver_id === session.user._id
//       ) {
//         setMessages((prev) => [...prev, data.message]);
//       }
//     });

//     channel.bind('typing', (data) => {
//       if (
//         data.userId !== session.user._id &&
//         data.receiverId === session.user._id
//       ) {
//         setIsTyping(true);
//         const timer = setTimeout(() => setIsTyping(false), 2000);
//         return () => clearTimeout(timer);
//       }
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//       pusher.disconnect();
//     };
//   }, [session]);

//   const handleSend = async (e) => {
//     if (e) e.preventDefault(); // Prevent default form submission

//     if (!input.trim() || !session || isSending) return; // Prevent multiple sends

//     setIsSending(true); // Set sending state

//     try {
//       const response = await fetch('http://localhost:3000/api/chats', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           sender_id: session.user._id,
//           receiver_id: "6887364b0a4afbb20086f045", // Use env variable
//           message: input,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send message');
//       }

//       setInput('');
//     } catch (err) {
//       console.error('Error sending message:', err);
//     } finally {
//       setIsSending(false); // Reset sending state
//     }
//   };

//   const handleTyping = async () => {
//     if (!session) return;

//     try {
//       const response = await fetch('http://localhost:3000/api/typing', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId: session.user._id,
//           receiverId: "6887364b0a4afbb20086f045", // Use env variable
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to send typing notification');
//       }
//     } catch (err) {
//       console.error('Error sending typing notification:', err);
//     }
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
//           {messages
//             .filter(
//               (msg) =>
//                 msg.sender_id === session?.user._id ||
//                 msg.receiver_id === session?.user._id
//             )
//             .map((msg) => (
//               <Box
//                 key={msg._id}
//                 sx={
//                   msg.sender_id === session?.user._id
//                     ? chatStyles.sentMessage
//                     : chatStyles.receivedMessage
//                 }
//               >
//                 {msg.sender_id !== session?.user._id && (
//                   <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
//                 )}
//                 <Box sx={chatStyles.messageBubble}>
//                   <Typography>{msg.message}</Typography>
//                   <Typography variant="caption" sx={{ color: "gray" }}>
//                     {new Date(msg.createdAt).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </Typography>
//                 </Box>
//                 {msg.sender_id === session?.user._id && (
//                   <Avatar
//                     sx={chatStyles.avatar}
//                     src={session.user.image}
//                     alt="User Avatar"
//                   />
//                 )}
//               </Box>
//             ))}

//           {isTyping && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 padding: "8px 16px",
//                 margin: "8px 0",
//               }}
//             >
//               <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
//               <Box
//                 sx={{
//                   backgroundColor: "#f0f0f0",
//                   borderRadius: "18px",
//                   padding: "8px 12px",
//                   maxWidth: "70%",
//                   display: "flex",
//                   gap: "4px",
//                 }}
//               >
//                 <span
//                   style={{
//                     height: "8px",
//                     width: "8px",
//                     backgroundColor: "#666",
//                     borderRadius: "50%",
//                     display: "inline-block",
//                     animation: "typing 1.4s infinite ease-in-out",
//                   }}
//                 ></span>
//                 <span
//                   style={{
//                     height: "8px",
//                     width: "8px",
//                     backgroundColor: "#666",
//                     borderRadius: "50%",
//                     display: "inline-block",
//                     animation: "typing 1.4s infinite ease-in-out",
//                     animationDelay: "0.2s",
//                   }}
//                 ></span>
//                 <span
//                   style={{
//                     height: "8px",
//                     width: "8px",
//                     backgroundColor: "#666",
//                     borderRadius: "50%",
//                     display: "inline-block",
//                     animation: "typing 1.4s infinite ease-in-out",
//                     animationDelay: "0.4s",
//                   }}
//                 ></span>
//               </Box>
//             </Box>
//           )}

//           <div ref={messagesEndRef} />
//         </Box>

//         <Paper
//           component="form"
//           sx={chatStyles.inputContainer}
//           onSubmit={handleSend} // Only use onSubmit handler
//         >
//           <InputBase
//             sx={chatStyles.inputBox}
//             placeholder="Type a message..."
//             value={input}
//             onChange={(e) => {
//               setInput(e.target.value);
//               handleTyping();
//             }}
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSend();
//               }
//             }}
//           />
//           <IconButton
//             type="submit"
//             disabled={!input.trim() || isSending} // Disable during send
//           >
//             <SendIcon sx={{ color: "#ff1100ff" }} />
//           </IconButton>
//         </Paper>
//       </Box>

//       <style jsx>{`
//         @keyframes typing {
//           0% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//           100% {
//             transform: translateY(0);
//           }
//         }
//       `}</style>
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
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

const ChatBox = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const ADMIN_ID = "6887364b0a4afbb20086f045"; // Consider moving to env variable

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages for this specific conversation
  useEffect(() => {
    if (!session?.user?._id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/chats?user_id=${session.user._id}&admin_id=${ADMIN_ID}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [session]);

  // Set up Pusher for real-time updates
  useEffect(() => {
    if (!session) return;

    const pusher = new Pusher(process.env.KEY, {
      cluster: process.env.CLUSTER,
      forceTLS: true,
    });

    const channel = pusher.subscribe("chat-channel");

    channel.bind("new-message", (data) => {
      const message = data.message;
      // Only add messages for this specific conversation
      if (
        (message.sender_id === session.user._id &&
          message.receiver_id === ADMIN_ID) ||
        (message.sender_id === ADMIN_ID &&
          message.receiver_id === session.user._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    channel.bind("typing", (data) => {
      if (data.userId === ADMIN_ID && data.receiverId === session.user._id) {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 1000);
        return () => clearTimeout(timer);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [session]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || !session || isSending) return;

    setIsSending(true);

    try {
      const response = await fetch("http://localhost:3000/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: session.user._id,
          receiver_id: ADMIN_ID,
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = async () => {
    if (!session) return;

    try {
      await fetch("http://localhost:3000/api/typing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user._id,
          receiverId: ADMIN_ID,
        }),
      });
    } catch (err) {
      console.error("Error sending typing notification:", err);
    }
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
          {messages.map((msg) => (
            <Box
              key={msg._id}
              sx={
                msg.sender_id === session?.user._id
                  ? chatStyles.sentMessage
                  : chatStyles.receivedMessage
              }
            >
              {msg.sender_id !== session?.user._id && (
                <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
              )}
              <Box sx={chatStyles.messageBubble}>
                <Typography>{msg.message}</Typography>
                <Typography variant="caption" sx={{ color: "gray" }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
              {msg.sender_id === session?.user._id && (
                <Avatar
                  sx={chatStyles.avatar}
                  src={session.user.image}
                  alt="User Avatar"
                />
              )}
            </Box>
          ))}

          {isTyping && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 16px",
                margin: "8px 0",
              }}
            >
              <Avatar sx={chatStyles.avatar} src="/admin-avatar.png" />
              <Box sx={chatStyles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Paper
          component="form"
          sx={chatStyles.inputContainer}
          onSubmit={handleSend}
        >
          <InputBase
            sx={chatStyles.inputBox}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <IconButton type="submit" disabled={!input.trim() || isSending}>
            <SendIcon sx={{ color: "#ff1100ff" }} />
          </IconButton>
        </Paper>
      </Box>
    </>
  );
};

export default ChatBox;
