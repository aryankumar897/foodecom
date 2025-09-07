// "use client"


// import { Box, Grid, Typography } from '@mui/material';
// import { useState, useEffect } from 'react';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
// import PendingIcon from '@mui/icons-material/Pending';
// import BookIcon from '@mui/icons-material/Book';
// import PersonIcon from '@mui/icons-material/Person';
// import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
// import InventoryIcon from '@mui/icons-material/Inventory';
// import BorderColorIcon from '@mui/icons-material/BorderColor';



// const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// };

// const stats = [
//     { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },
//     { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },
//     { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },
//     { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },
//     { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },
//         { title: 'Total Listings', count: 120 },
//     { title: 'Active Listings', count: 80 },
//     { title: 'Pending Listings', count: 20 },
//     { title: 'Total Reviews', count: 250 },

// ];



// export default function Dashboard() {
//     const [colors, setColors] = useState([]);

//     useEffect(() => {
//         setColors(stats.map(() => getRandomColor()));
//     }, []);

//     return (
//         <Box sx={{ flexGrow: 1, padding: 2 }}>
//             <Grid container spacing={2}>
//                 {stats.map((stat, index) => (
//                     <Grid item xs={12} sm={6} md={3} key={index}>
//                         <Box
//                             sx={{
//                                 backgroundColor: colors[index],
//                                 boxShadow: 3,
//                                 borderRadius: 1,
//                                 padding: 2,
//                                 textAlign: 'center',
//                             }}
//                         >

//                             <Typography variant="h6" component="div">
//                                 {stat.count}
//                             </Typography>
//                             <Typography variant="body2" component="div">
//                                 {stat.title}
//                             </Typography>

//                         </Box>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     );
// };














"use client"



import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import {
  ThemeProvider,
  createTheme,
  styled,
} from '@mui/material/styles';
import {
  Box,
  Grid,
  Typography,
  Paper,
  CssBaseline,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Create MUI theme with vibrant colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#7c8dea',
      dark: '#5a67d8',
    },
    secondary: {
      main: '#764ba2',
      light: '#8a63b2',
      dark: '#6b46c1',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  typography: {
    h4: {
      fontWeight: 'bold',
      color: 'white',
    },
    h6: {
      fontWeight: '600',
      color: '#2d3748',
    },
  },
});

// Styled components with Framer Motion
const DashboardContainer = styled(motion.div)(({ theme }) => ({
  minHeight: '100vh',
  background: 'white',
  padding: theme.spacing(3),
  overflow: 'hidden',
}));

const ChartCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  height: '100%',
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  paddingBottom: theme.spacing(2),
  fontWeight: 'bold',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '3px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '2px',
  },
}));

const StatsCard = styled(motion.div)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  color: 'white',
}));

const StatItem = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const HeaderBox = styled(motion.div)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(8),
}));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    }
  }
};

const cardHoverVariants = {
  hover: {
    y: -10,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Main component
export default function AnimatedDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgOrder: 0,
  });

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Chart data configurations
  const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#2d3748',
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 2,
        cornerRadius: 10,
        padding: 15,
      },
    },
  };

  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue ($)',
      data: [12500, 19000, 18000, 22000, 21000, 25000, 30000, 28000, 32000, 35000, 38000, 42000],
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 4,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#667eea',
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 10,
    }],
  };

  const topProductsData = {
    labels: ['Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Cable', 'Phone Case'],
    datasets: [{
      label: 'Units Sold',
      data: [245, 189, 156, 142, 128],
      backgroundColor: [
        'rgba(255, 107, 107, 0.8)',
        'rgba(78, 205, 196, 0.8)',
        'rgba(69, 183, 209, 0.8)',
        'rgba(249, 199, 79, 0.8)',
        'rgba(255, 159, 28, 0.8)',
      ],
      borderColor: [
        '#ff6b6b',
        '#4ecdc4',
        '#45b7d1',
        '#f9c74f',
        '#ff9f1c',
      ],
      borderWidth: 2,
      borderRadius: 10,
      hoverBackgroundColor: [
        '#ff5252',
        '#26a69a',
        '#29b6f6',
        '#ffc107',
        '#ff9800',
      ],
    }],
  };

  const trafficSourcesData = {
    labels: ['Organic Search', 'Social Media', 'Email', 'Direct', 'Referral'],
    datasets: [{
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(33, 150, 243, 0.8)',
        'rgba(255, 152, 0, 0.8)',
        'rgba(156, 39, 176, 0.8)',
        'rgba(244, 67, 54, 0.8)',
      ],
      borderColor: '#fff',
      borderWidth: 3,
      hoverOffset: 20,
    }],
  };

  const funnelData = {
    labels: ['Website Visitors', 'Add to Cart', 'Checkout Started', 'Purchases'],
    datasets: [{
      label: 'Users',
      data: [10000, 2500, 1200, 800],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 3,
      borderRadius: 15,
    }],
  };

  const charts = [
    { title: '📈 Monthly Revenue Trend', data: monthlySalesData, type: 'line' },
    { title: '🏆 Top Selling Products', data: topProductsData, type: 'bar' },
    { title: '🌐 Traffic Sources', data: trafficSourcesData, type: 'doughnut' },
    { title: '🔄 Sales Funnel', data: funnelData, type: 'bar' },
  ];

  const statistics = [
    { id: 'totalRevenue', label: 'Total Revenue', value: stats.totalRevenue, prefix: '$', color: '#4CAF50' },
    { id: 'totalOrders', label: 'Total Orders', value: stats.totalOrders, color: '#2196F3' },
    { id: 'conversionRate', label: 'Conversion Rate', value: stats.conversionRate, suffix: '%', color: '#FF9800' },
    { id: 'avgOrder', label: 'Avg. Order Value', value: stats.avgOrder, prefix: '$', color: '#9C27B0' },
  ];

  useEffect(() => {
    const animateCounters = async () => {
      // Animate each counter with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats({
        totalRevenue: 287500,
        totalOrders: 1560,
        conversionRate: 8,
        avgOrder: 184,
      });
    };

    animateCounters();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardContainer
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <HeaderBox
              variants={itemVariants}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
               
                <Typography variant="h6" sx={{ opacity: 0.9, color: 'black' }}>
                  Real-time analytics with smooth animations
                </Typography>
              </motion.div>
            </HeaderBox>
          </Grid>



 {/* Statistics Bar */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <motion.div
              variants={itemVariants}
            >
              <StatsCard>
                <Grid container spacing={2}>
                  {statistics.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={6} key={stat.id}>
                      <motion.div
                        variants={pulseVariants}
                        animate="animate"
                        style={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <StatItem
                          style={{ 
                            background: `white`,
                            borderRadius: '15px',
                            margin: '0.5rem',
                            width: '100%'
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
                            {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9, color: 'black' }}>
                            {stat.label}
                          </Typography>
                        </StatItem>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </StatsCard>
            </motion.div>
          </Grid>





          {/* Charts Grid - One chart per row on mobile */}
          <Grid item xs={12}>
            <Grid container spacing={4} justifyContent="center">
              {charts.map((chart, index) => (
                <Grid item xs={12} lg={6} md={6} key={index} style={{ marginBottom: isMobile ? '2rem' : 0 }}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.2 }}
                  >
                    <ChartCard
                      variants={cardHoverVariants}
                      whileHover="hover"
                    >
                      <ChartTitle variant="h6">{chart.title}</ChartTitle>
                      <div style={{ height: isMobile ? '300px' : '350px' }}>
                        <Chart
                          type={chart.type}
                          data={chart.data}
                          options={{
                            ...chartConfig,
                            animation: {
                              ...chartConfig.animation,
                              easing: chart.type === 'bar' ? 'easeOutBounce' : 
                                      chart.type === 'doughnut' ? 'easeOutElastic' : 'easeOutQuart',
                            },
                            ...(chart.type === 'bar' && chart.title !== '🔄 Sales Funnel' && { indexAxis: 'y' }),
                            ...(chart.type === 'doughnut' && { cutout: '60%' }),
                          }}
                        />
                      </div>
                    </ChartCard>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>

         
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
}



