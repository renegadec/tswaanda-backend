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
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import React, { useEffect, useState } from "react";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import { toast } from "react-toastify";

const Orders = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(null);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [showStep, setShowStep] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [orderStatus, setOrderStatus] = useState("");
  const [orderStep, setOrderStep] = useState(null);
  const [updating, setUpdating] = useState(false);

  const canisterId = "55ger-liaaa-aaaal-qb33q-cai";

  const host = "https://icp0.io";
  const agent = new HttpAgent({ host: host });

  const marketActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });

  const getOrders = async () => {
    const res = await marketActor.getAllOrders();
    setData(res);
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (data) {
      const convertImage = (image) => {
        const imageContent = new Uint8Array(image);
        const blob = new Blob([imageContent.buffer], { type: "image/png" });
        return URL.createObjectURL(blob);
      };

      const formatOrderDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString();
      };

      const ordersWithConvertedImages = data.map((order) => {
        const orderProducts = order.orderProducts.map((product) => ({
          ...product,
          image: convertImage(product.image),
        }));

        const formattedDate = formatOrderDate(order.dateCreated);

        return {
          ...order,
          step: Number(order.step),
          dateCreated: formattedDate,
          orderProducts: orderProducts,
        };
      });
      setOrders(ordersWithConvertedImages);
    }
  }, [data]);

  const updateOrderStatus = async (id) => {
    if (data && orderStatus != "") {
      setUpdating(true);
      const orderIndex = data.findIndex((order) => order.orderId === id);

      if (orderIndex !== -1) {
        data[orderIndex].status = orderStatus;
        const res = await marketActor.updatePOrder(id, data[orderIndex]);
        toast.success("Order status have been updated", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        const orderPosition = orders.findIndex((order) => order.orderId === id);
        orders[orderPosition].status = orderStatus;
        setUpdating(false);
        setSelectedOrderId(null);
        setOrderStatus("");
      } else {
        toast.warning("Order not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };
  const updateOrderSteps = async (id) => {
    if (data && orderStep != null) {
      setUpdating(true);
      const orderIndex = data.findIndex((order) => order.orderId === id);

      if (orderIndex !== -1) {
        data[orderIndex].step = Number(orderStep);
        const res = await marketActor.updatePOrder(id, data[orderIndex]);
        toast.success("Order stage have been updated", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
        const orderPosition = orders.findIndex((order) => order.orderId === id);
        orders[orderPosition].step = orderStep;
        setUpdating(false);
        setSelectedOrderId(null);
        setOrderStatus("");
      } else {
        toast.warning("Order not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };

  const handleShowStatusForm = (id) => {
    setSelectedOrderId(id);
    setShowStatus(true);
    setShowContact(false);
    setShowStep(false);
  };
  const handleShowCustomerForm = (id) => {
    setSelectedOrderId(id);
    setShowContact(true);
    setShowStatus(false);
    setShowStep(false);
  };
  const handleShowStepForm = (id) => {
    setSelectedOrderId(id);
    setShowStep(true);
    setShowStatus(false);
    setShowContact(false);
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Orders" subtitle="Managing markertplace orders" />
        </Box>
        <div>
          {orders?.map((order) => (
            <Box
              m="2.5rem 0 0 0"
              sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem",
              }}
              key={order.orderId}
            >
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={3}>
                  <Typography>Order: {order.orderNumber}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>User Email: {order.userEmail}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Placed at: {order.dateCreated}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Status: {order.status}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Step: {order.step}</Typography>
                </Grid>
              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                {order.orderProducts.map((product) => (
                  <Grid item xs={4} display="flex" alignItems="center">
                    <Box
                      component="img"
                      alt="profile"
                      src={product.image}
                      height="100px"
                      width="100px"
                      sx={{ objectFit: "cover" }}
                    />
                    <Box m="0 0.1rem 0 0.1rem" textAlign="left">
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Name: {product.name}
                      </Typography>
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Quantity: {Number(product.quantity)}
                      </Typography>
                      <Typography
                        fontSize="0.9rem"
                        sx={{ color: theme.palette.secondary[100] }}
                      >
                        Price: ${product.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
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
                  onClick={() => handleShowStatusForm(order.orderId)}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      selectedOrderId === order.orderId && showStatus
                        ? "white"
                        : undefined,
                    color:
                      selectedOrderId === order.orderId && showStatus
                        ? "green"
                        : "white",
                  }}
                >
                  Update Order status
                </Button>
                <Button
                  onClick={() => handleShowStepForm(order.orderId)}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      selectedOrderId === order.orderId && showStep
                        ? "white"
                        : undefined,
                    color:
                      selectedOrderId === order.orderId && showStep
                        ? "green"
                        : "white",
                  }}
                >
                  Update Order step
                </Button>
                <Button
                  onClick={() => handleShowCustomerForm(order.orderId)}
                  variant="outlined"
                  size="small"
                  style={{
                    backgroundColor:
                      selectedOrderId === order.orderId && showContact
                        ? "white"
                        : undefined,
                    color:
                      selectedOrderId === order.orderId && showContact
                        ? "green"
                        : "white",
                  }}
                >
                  Contact customer
                </Button>
              </CardActions>
              {selectedOrderId === order.orderId && showStatus && (
                <div className="">
                  <AccordionDetails>
                    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel id="status-label">Order status</InputLabel>
                        <Select
                          labelId="status-label"
                          onChange={(e) => setOrderStatus(e.target.value)}
                        >
                          <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                          <MenuItem value="Approved">Approved-processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        disabled={updating}
                        color="primary"
                        onClick={() => updateOrderStatus(order.orderId)}
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
              {selectedOrderId === order.orderId && showStep && (
                <div className="">
                  <AccordionDetails>
                    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                      <FormControl fullWidth margin="dense">
                        <InputLabel id="step-label">Order Step</InputLabel>
                        <Select
                          labelId="step-label"
                          onChange={(e) => setOrderStep(e.target.value)}
                        >
                          <MenuItem value="0">0 - Pending</MenuItem>
                          <MenuItem value="1">1 - Approved</MenuItem>
                          <MenuItem value="2">2 - Shipped</MenuItem>
                          <MenuItem value="3">3 - Approved</MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => updateOrderSteps(order.orderId)}
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
              {selectedOrderId === order.orderId && showContact && (
                <div className="">Contact the customer of the order</div>
              )}
            </Box>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default Orders;
