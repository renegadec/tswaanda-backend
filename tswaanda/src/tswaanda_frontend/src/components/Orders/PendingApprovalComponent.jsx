import React, { useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Typography,
  useTheme,
  Grid,
  CardActions,
  TextField,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PendingApprovalComponent = ({
  pendingOrders,
  handleChange,
  handleShowCustomerForm,
  handleShowStatusForm,
  updatePendingOrderStatus,
  expanded,
  theme,
  selectedOrderId,
  showContact,
  showStatus,
  updating,
  setOrderStatus,
}) => {

const [updateSatus, setUpdateStatus] = useState(false)
const [contactCustomer, setContactCustomer] = useState(false)

const handleContactCustomer = () => {
  setContactCustomer(!contactCustomer)
  setUpdateStatus(false)
}

const handleUpdateStatus = () => {
  setUpdateStatus(!updateSatus)
  setContactCustomer(false)
}

  return (
    <Box m="1rem 0 0 0">
      {pendingOrders?.map((order) => (
        <Accordion
          key={order.orderId}
          expanded={expanded === order.orderId}
          onChange={handleChange(order.orderId)}
          sx={{ backgroundColor: theme.palette.background.alt }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "25%", flexShrink: 0 }}>
              <span style={{ fontWeight: "bold" }}>Order</span>:{" "}
              {order.orderNumber}
            </Typography>
            <Typography
              sx={{ color: "text.secondary", width: "30%", flexShrink: 0 }}
            >
              <span style={{ fontWeight: "bold" }}>Customer</span>:{" "}
              {order.userEmail}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
              {order.dateCreated}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem",
              }}
            >
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={6}>
                  <Typography>Status: {order.status}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Step: {order.step}</Typography>
                </Grid>
              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
               
                  <Grid key={order.orderProducts.id} item xs={4} display="flex" alignItems="center">
                    <Box
                      component="img"
                      alt="profile"
                      src={order.orderProducts.image}
                      height="100px"
                      width="100px"
                      sx={{ objectFit: "cover" }}
                    />
                    <Box m="0 0.1rem 0 0.1rem" textAlign="left">
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Name: {order.orderProducts.name}
                      </Typography>
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Quantity: {Number(order.orderProducts.quantity)}
                      </Typography>
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Price: ${order.orderProducts.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                
              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={3}>
                  <Typography>
                    Subtotal: ${order.subtotal.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    Shipping estimate ${order.shippingEstimate.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    Tax Estimate: ${order.taxEstimate.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography fontWeight="bold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <CardActions>
                <Button
                  onClick={handleUpdateStatus}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      updateSatus
                        ? "white"
                        : undefined,
                    color:
                      updateSatus
                        ? "green"
                        : "white",
                  }}
                >
                  Update Order status
                </Button>
                <Button
                  onClick={handleContactCustomer}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      contactCustomer
                        ? "white"
                        : undefined,
                    color:
                      contactCustomer
                        ? "green"
                        : "white",
                  }}
                >
                  Contact customer
                </Button>
              </CardActions>
              {updateSatus && (
                <div className="">
                  <AccordionDetails>
                    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel id="status-label">Order status</InputLabel>
                        <Select
                          labelId="status-label"
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          <MenuItem value="Pending Approval">
                            Pending Approval
                          </MenuItem>
                          <MenuItem value="Approved">
                            Approved-processing
                          </MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        disabled={updating}
                        color="primary"
                        onClick={() => updatePendingOrderStatus(order.orderId)}
                        sx={{
                          backgroundColor: theme.palette.secondary.light,
                          color: theme.palette.background.alt,
                          fontSize: "14px",
                          fontWeight: "bold",
                          padding: "10px 20px",
                        }}
                      >
                        {updating ? "Updating..." : "Update order"}
                      </Button>
                    </Container>
                  </AccordionDetails>
                </div>
              )}
              {contactCustomer && (
                <div className="">Contact the customer of the order</div>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PendingApprovalComponent;
