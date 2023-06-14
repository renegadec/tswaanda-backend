import {
  Box,
  AppBar,
  Toolbar,
  Container,
  Typography,
  useTheme,
  Grid,
  CardActions,
  Button
} from "@mui/material";
import Header from "../../components/Header";

import React, { useEffect, useState } from "react";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";

const Orders = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(null);

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
                        Price: {product.price.toFixed()}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <hr />
              <Grid container spacing={4} m="0 0.1rem 0 0.1rem">
                <Grid item xs={3}>
                  <Typography>Subtotal: ${order.subtotal.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>
                    Shipping estimate ${order.shippingEstimate.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography>Tax Estimate: ${order.taxEstimate.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography fontWeight="bold">
                    Total: ${order.totalPrice.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <hr />
              <CardActions>
                <Button variant="primary" size="small">
                  Update Order status
                </Button>
                <Button variant="primary" size="small">
                  Update Order step
                </Button>
                <Button variant="primary" size="small">
                  Contact customer
                </Button>
              </CardActions>
            </Box>
          ))}
        </div>
      </Box>
    </div>
  );
};

export default Orders;
