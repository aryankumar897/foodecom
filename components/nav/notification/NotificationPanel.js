// // components/NotificationPanel.jsx
// import {
//   Box,
//   Typography,
//   IconButton,
//   Popper,
//   Paper,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CodeIcon from "@mui/icons-material/Code";
// import PersonIcon from "@mui/icons-material/Person";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import { useState, useRef } from "react";
// import { useSession } from "next-auth/react";

// const notifications = [
//   {
//     icon: <CodeIcon color="primary" />,
//     text: "Template update is available now!",
//     time: "2 MIN AGO",
//   },
//   {
//     icon: <PersonIcon color="info" />,
//     text: "You and Dedik Sugiharto are now friends",
//     time: "10 HOURS AGO",
//   },
//   {
//     icon: <CheckCircleIcon color="success" />,
//     text: "Kusnaedi has moved task Fix bug header to Done",
//     time: "12 HOURS AGO",
//   },
//   {
//     icon: <ErrorIcon color="error" />,
//     text: "Low disk space. Let's clean it!",
//     time: "17 HOURS AGO",
//   },
// ];

// export default function NotificationPanel() {
//   const [open, setOpen] = useState(false);
//   const anchorRef = useRef(null);
//   const { data } = useSession();
//   const toggleOpen = () => {
//     setOpen((prev) => !prev);
//   };

//   return (
//     <Box>
//       {data?.user?.role === "admin" && (
//         <IconButton ref={anchorRef} onClick={toggleOpen}>
//           <NotificationsIcon

//             sx={{

//               color: "red",

//             }}

//           />
//         </IconButton>
//       )}

//       <Popper
//         open={open}
//         anchorEl={anchorRef.current}
//         placement="bottom-end"
//         style={{ zIndex: 1300 }}
//       >
//         <Paper
//           sx={{
//             width: { xs: "90vw", sm: 360 },
//             maxHeight: 400,
//             overflowY: "auto",
//             p: 1,
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             px={1}
//           >
//             <Typography variant="subtitle1" fontWeight="bold">
//               Notifications
//             </Typography>
//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{ cursor: "pointer" }}
//             >
//               Mark All As Read
//             </Typography>
//           </Box>
//           <Divider sx={{ my: 1 }} />
//           <List>
//             {notifications.map((item, index) => (
//               <ListItem key={index} alignItems="flex-start">
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText
//                   primary={item.text}
//                   secondary={item.time}
//                   primaryTypographyProps={{ fontSize: 14 }}
//                   secondaryTypographyProps={{ fontSize: 12 }}
//                 />
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//           <Box textAlign="center" py={1}>
//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{ cursor: "pointer" }}
//             >
//               View All &gt;
//             </Typography>
//           </Box>
//         </Paper>
//       </Popper>
//     </Box>
//   );
// }

// import {
//   Box,
//   Typography,
//   IconButton,
//   Popper,
//   Paper,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Badge,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import CodeIcon from "@mui/icons-material/Code";
// import PersonIcon from "@mui/icons-material/Person";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ErrorIcon from "@mui/icons-material/Error";
// import { useState, useRef, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import Pusher from 'pusher-js';

// export default function NotificationPanel() {
//   const [open, setOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const anchorRef = useRef(null);
//   const { data: session } = useSession();

//   const toggleOpen = () => {
//     setOpen((prev) => !prev);
//     if (!open && session?.user?.id) {
//       // Mark as read when opening
//       markNotificationsAsRead(session.user.id);
//     }
//   };

//   // Fetch notifications
//   const fetchNotifications = async (userId) => {
//     try {
//       const response = await fetch(`${process.env.API}/notifications?userId=${userId}`);
//       const data = await response.json();
//       setNotifications(data);
//       setUnreadCount(data.filter(n => !n.seen).length);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   // Mark notifications as read
//   const markNotificationsAsRead = async (userId) => {
//     try {
//       await fetch(`${process.env.API}/notifications`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ userId }),
//       });
//       setUnreadCount(0);
//     } catch (error) {
//       console.error('Error marking notifications as read:', error);
//     }
//   };

//   // Initialize Pusher and subscribe to channel
//   useEffect(() => {
//     if (!session?.user?.id) return;

//     // Fetch initial notifications
//     fetchNotifications(session.user.id);

//     const pusher = new Pusher(process.env.KEY, {
//       cluster: process.env.CLUSTER,
//       forceTLS: true
//     });

//     const channel = pusher.subscribe(`notifications-${session.user.id}`);

//     channel.bind('new-notification', (data) => {
//       setNotifications(prev => [data.notification, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     channel.bind('notifications-read', () => {
//       setUnreadCount(0);
//     });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//     };
//   }, [session?.user?.id]);

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now - date) / 1000);

//     if (diffInSeconds < 60) return `${diffInSeconds} SEC AGO`;
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} MIN AGO`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} HOURS AGO`;
//     return `${Math.floor(diffInSeconds / 86400)} DAYS AGO`;
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'success':
//         return <CheckCircleIcon color="success" />;
//       case 'error':
//         return <ErrorIcon color="error" />;
//       case 'info':
//         return <PersonIcon color="info" />;
//       default:
//         return <CodeIcon color="primary" />;
//     }
//   };

//   return (
//     <Box>
//       {session?.user?.role === "admin" && (
//         <IconButton ref={anchorRef} onClick={toggleOpen}>
//           <Badge badgeContent={unreadCount} color="error">
//             <NotificationsIcon sx={{ color: "red" }} />
//           </Badge>
//         </IconButton>
//       )}

//       <Popper
//         open={open}
//         anchorEl={anchorRef.current}
//         placement="bottom-end"
//         style={{ zIndex: 1300 }}
//       >
//         <Paper
//           sx={{
//             width: { xs: "90vw", sm: 360 },
//             maxHeight: 400,
//             overflowY: "auto",
//             p: 1,
//           }}
//         >
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             px={1}
//           >
//             <Typography variant="subtitle1" fontWeight="bold">
//               Notifications
//             </Typography>
//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{ cursor: "pointer" }}
//               onClick={() => session?.user?.id && markNotificationsAsRead(session.user.id)}
//             >
//               Mark All As Read
//             </Typography>
//           </Box>
//           <Divider sx={{ my: 1 }} />
//           <List>
//             {notifications.length > 0 ? (
//               notifications.map((item, index) => (
//                 <ListItem key={index} alignItems="flex-start">
//                   <ListItemIcon>
//                     {getNotificationIcon(item.type)}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.message}
//                     secondary={formatTime(item.createdAt)}
//                     primaryTypographyProps={{ fontSize: 14 }}
//                     secondaryTypographyProps={{ fontSize: 12 }}
//                   />
//                 </ListItem>
//               ))
//             ) : (
//               <ListItem>
//                 <ListItemText primary="No notifications" />
//               </ListItem>
//             )}
//           </List>
//           <Divider />
//           <Box textAlign="center" py={1}>
//             <Typography
//               variant="body2"
//               color="primary"
//               sx={{ cursor: "pointer" }}
//             >
//               View All &gt;
//             </Typography>
//           </Box>
//         </Paper>
//       </Popper>
//     </Box>
//   );
// }

import {
  Box,
  Typography,
  IconButton,
  Popper,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Badge,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const anchorRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.KEY, {
      cluster: process.env.CLUSTER,
      forceTLS: true,
    });

    const channel = pusher.subscribe("notifications");

    channel.bind("new-notification", (data) => {
      console.log("new-notification", data);

      if (session?.user?.role === "admin") {
        setNotifications((prev) => [data.notification, ...prev]);
        setUnreadCount((prev) => Math.max(0, prev + 1)); // Prevent negative
      }
    });

    channel.bind("notifications-read", () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnreadCount(0);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user?.role]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.API}/notifications`);
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(Math.max(0, data.filter((n) => !n.seen).length)); // Prevent negative
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationAsRead = async (notification) => {
    try {
      await fetch(`${process.env.API}/notifications/${notification._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? { ...n, seen: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1)); // Prevent negative

      // Redirect if URL exists
      if (notification.redirectUrl) {
        router.push(notification.redirectUrl);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${process.env.API}/notifications/mark-all-read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} SEC AGO`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} MIN AGO`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} HOURS AGO`;
    return `${Math.floor(diffInSeconds / 86400)} DAYS AGO`;
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {session?.user?.role === "admin" && (
        <IconButton ref={anchorRef} onClick={toggleOpen}>
          <Badge
            badgeContent={unreadCount > 0 ? unreadCount : null}
            color="error"
          >
            <NotificationsIcon sx={{ color: "red" }} />
          </Badge>
        </IconButton>
      )}

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        style={{ zIndex: 1300 }}
      >
        <Paper
          sx={{
            width: { xs: "90vw", sm: 360 },
            maxHeight: 400,
            overflowY: "auto",
            p: 1,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={1}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={markAllAsRead}
              >
                Mark All As Read
              </Typography>
            )}
          </Box>
          <Divider sx={{ my: 1 }} />
          <List>
            {notifications.length > 0 ? (
              notifications.map((item, index) => (
                <ListItem
                  key={index}
                  alignItems="flex-start"
                  onClick={() => markNotificationAsRead(item)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: item.seen ? "inherit" : "action.hover",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.message}
                    secondary={formatTime(item.createdAt)}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: item.seen ? "normal" : "bold",
                    }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
          </List>
          <Divider />
          <Box textAlign="center" py={1}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/notifications")}
            >
              View All Notifications
            </Typography>
          </Box>
        </Paper>
      </Popper>
    </Box>
  );
}
