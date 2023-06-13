import {
  Box,
  AppBar,
  Toolbar,
  Container,
  TextField,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";

import React, { useEffect, useState } from "react";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";

const Orders = () => {
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState(null)

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

  console.log(orders)

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

  return <div>
    <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Orders" subtitle="Managing markertplace orders" />
        </Box>
      </Box>
  </div>;
};

export default Orders;
