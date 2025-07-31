import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";




import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CancelIcon from '@mui/icons-material/Cancel';



import DoneAllIcon from '@mui/icons-material/DoneAll';
const statusSteps = [
  { value: "pending", label: "Order Pending" },
  { value: "inprocess", label: "Processing" },
  { value: "delivered", label: "Delivered" }
];

const OrderTimeline = ({ order }) => {
   const orderStatus = order?.order_status?.toLowerCase();
  const isCancelled = orderStatus === 'cancelled';
  
  // Find the index of the current status
  const currentStepIndex = statusSteps.findIndex(step => step.value === orderStatus);
  
  // Determine if order is complete (delivered)
  const isComplete = orderStatus === 'delivered';

  return (


<>
   

 <Box mb={4} sx={{ width: '100%' }}>
      {isCancelled ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CancelIcon sx={{ color: "#ef4444", fontSize: 30 }} />
          <Typography variant="h6" color="#ef4444" fontWeight="bold">
            Order Cancelled
          </Typography>
        </Box>
      ) : (
        <>
          <Stepper alternativeLabel activeStep={currentStepIndex}>
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex || isComplete;
              const isCurrent = index === currentStepIndex && !isComplete;

              return (
                <Step key={step.value} completed={isCompleted}>
                  <StepLabel
                    StepIconComponent={() => {
                      if (isComplete) {
                        return <DoneAllIcon sx={{ color: "#16a34a" }} />;
                      }
                      if (isCompleted) {
                        return <CheckCircleIcon sx={{ color: "#16a34a" }} />;
                      }
                      if (isCurrent) {
                        return <CheckCircleIcon sx={{ color: "#f59e0b" }} />;
                      }
                      return <RadioButtonUncheckedIcon sx={{ color: "#d1d5db" }} />;
                    }}
                  >
                    <Typography
                      fontSize="0.85rem"
                      fontWeight="bold"
                      sx={{
                        color: isComplete ? "#16a34a" :
                               isCompleted ? "#16a34a" :
                               isCurrent ? "#f59e0b" : "#9ca3af"
                      }}
                    >
                      {step.label}
                      {isCurrent && (
                        <Typography 
                          variant="caption" 
                          display="block" 
                          color="#f59e0b"
                          sx={{ mt: 0.5 }}
                        >
                          (Current Status)
                        </Typography>
                      )}
                      {isComplete && index === statusSteps.length - 1 && (
                        <Typography 
                          variant="caption" 
                          display="block" 
                          color="#16a34a"
                          sx={{ mt: 0.5 }}
                        >
                          (Completed)
                        </Typography>
                      )}
                    </Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          
          {/* Status summary */}
          <Box mt={2} textAlign="center">
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              color={
                isComplete ? "#16a34a" :
                orderStatus === "inprocess" ? "#f59e0b" :
                orderStatus === "pending" ? "#f59e0b" : "#9ca3af"
              }
            >
              {isComplete ? "Order Completed Successfully" :
               `Current Status: ${orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}`}
            </Typography>
          </Box>
        </>
      )}
    </Box>










  {/* Invoice Content */}
      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        mb={2}
        gap={2}
      >
        <Box>
          <Typography fontWeight="bold">Invoice To</Typography>
          <Typography>
            {order?.addressDetails?.address || "No address provided"}
          </Typography>
          <Typography>{order?.contactPhone}</Typography>
          <Typography>{order?.contactEmail}</Typography>
        </Box>
        <Box>
          <Typography>
            <b>Invoice No:</b>{" "}
            <span style={{ color: "#fb923c" }}>{order?.invoice_id}</span>
          </Typography>
          <Typography>
            <b>Payment Status:</b> {order?.payment_status}
          </Typography>
          <Typography>
            <b>Payment Method:</b> {order?.payment_method}
          </Typography>
          <Typography>
            <b>Transaction Id:</b>{" "}
            <span style={{ color: "#fb923c" }}>
              {order?.transaction_id || "N/A"}
            </span>
          </Typography>
          <Typography>
            <b>Date:</b> {new Date(order?.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow sx={{ backgroundColor: "#f97316" }}>
              <TableCell sx={{ color: "#fff" }}>SL</TableCell>
              <TableCell sx={{ color: "#fff" }}>Item Description</TableCell>
              <TableCell sx={{ color: "#fff" }}>Price</TableCell>
              <TableCell sx={{ color: "#fff" }}>Quantity</TableCell>
              <TableCell sx={{ color: "#fff" }}>Total</TableCell>
            </TableRow>

            {order?.orderItems?.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {item.product_name}
                  {item.product_size && (
                    <Typography variant="body2">
                      Size: {item.product_size.name} (+{item.product_size.price}
                      )
                    </Typography>
                  )}
                  {item.product_option?.length > 0 && (
                    <Box>
                      <Typography variant="body2">Options:</Typography>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {item.product_option.map((opt) => (
                          <li key={opt._id}>
                            {opt.name} (+{opt.price})
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {order.currency_name} {item.unit_price}
                </TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell>
                  {order.currency_name}{" "}
                  {(item.unit_price * item.qty).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={4}>
                <b>Sub Total</b>
              </TableCell>
              <TableCell>
                {order.currency_name} {order.subtotal}
              </TableCell>
            </TableRow>

            {order.discount > 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <span style={{ color: "red" }}>(-) Discount Coupon</span>
                </TableCell>
                <TableCell style={{ color: "red" }}>
                  {order.currency_name} {order.discount}
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell colSpan={4}>
                <b>(+) Shipping Cost</b>
              </TableCell>
              <TableCell>
                {order.currency_name} {order.delivery_charge}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={4}>
                <b>Total Paid</b>
              </TableCell>
              <TableCell>
                <b>
                  {order.currency_name} {order.grand_total}
                </b>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#f97316",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#fb923c",
            },
          }}
          onClick={() => window.print()}
        >
          Print PDF
        </Button>
      </Box>


</>

  );
};

export default OrderTimeline;












