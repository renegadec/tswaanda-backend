import {
  Box,
  useTheme,
  Tabs,
  Tab,
} from "@mui/material";
import Header from "../../components/Header";

import React, { useEffect, useState } from "react";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import { toast } from "react-toastify";
import PendingApprovalComponent from "../../components/Orders/PendingApprovalComponent";
import ProcessingComponent from "../../components/Orders/ProcessingComponent";
import ShippedComponent from "../../components/Orders/ShippedComponent";
import DeliveredComponent from "../../components/Orders/DeliveredComponent";

const Orders = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [shippedData, setShippedData] = useState(null);
  const [deliveredData, setDeliverdData] = useState(null);
  const [approvedData, setApprovedData] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(null);
  const [shippedOrders, setShippedOrders] = useState(null);
  const [deliveredOrders, setDeliverdOrders] = useState(null);
  const [approvedOrders, setApprovedOrders] = useState(null);

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

  //Setting of the value of the currect tab
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (value === 0 && !pendingData) {
      getPendingOrders();
    } else if (value === 1 && !approvedData) {
      getApprovedOrders();
    } else if (value === 2 && !shippedData) {
      getShippedOrders();
    } else if (value === 3 && !deliveredData) {
      getDeliveredOrders();
    }
  }, [value]);

  const getPendingOrders = async () => {
    const res = await marketActor.getPendingOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setPendingData(sortedData);
    const convertedOrders = convertData(sortedData);
    setPendingOrders(convertedOrders);
  };
  const getApprovedOrders = async () => {
    console.log("Getting approved orders fucntion running");
    const res = await marketActor.getApprovedOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setApprovedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setApprovedOrders(convertedOrders);
  };
  const getShippedOrders = async () => {
    const res = await marketActor.getShippedOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setShippedData(sortedData);
    const convertedOrders = convertData(sortedData);
    setShippedOrders(convertedOrders);
  };
  const getDeliveredOrders = async () => {
    const res = await marketActor.getDeliveredOrders();
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    setDeliverdData(sortedData);
    const convertedOrders = convertData(sortedData);
    setDeliverdOrders(convertedOrders);
  };

  function convertData(data) {
    if (!data) {
      return [];
    }

    const convertImage = (image) => {
      const imageContent = new Uint8Array(image);
      const blob = new Blob([imageContent.buffer], { type: "image/png" });
      return URL.createObjectURL(blob);
    };

    const formatOrderDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatOrderTime = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleTimeString("en-US", options);
    };

    const ordersWithConvertedImages = data.map((order) => {
      const orderProducts = order.orderProducts.map((product) => ({
        ...product,
        image: convertImage(product.image),
      }));

      const formattedDate = formatOrderDate(order.dateCreated);
      const formattedTime = formatOrderTime(order.dateCreated);

      return {
        ...order,
        step: Number(order.step),
        dateCreated: `${formattedDate} at ${formattedTime}`,
        orderProducts: orderProducts,
      };
    });

    return ordersWithConvertedImages;
  }

  const updatePendingOrderStatus = async (id) => {
    updateOrderStatus(id, pendingData, pendingOrders);
  };
  const updateProcessingOrderStatus = async (id) => {
    updateOrderStatus(id, approvedData, approvedOrders);
  };
  const updateShippedOrderStatus = async (id) => {
    updateOrderStatus(id, shippedData, shippedOrders);
  };
  const updateDeliverdOrderStatus = async (id) => {
    updateOrderStatus(id, deliveredData, deliveredOrders);
  };


  const updatePendingOrderSteps = async (id) => {
    updateOrderSteps(id, pendingData, pendingOrders);
  };
  const updateProcessingOrderSteps = async (id) => {
    updateOrderSteps(id, approvedData, approvedOrders);
  };
  const updateShippedOrderSteps = async (id) => {
    updateOrderSteps(id, shippedData, shippedOrders);
  };
  const updateDeliverdOrderSteps = async (id) => {
    updateOrderSteps(id, deliveredData, deliveredOrders);
  };

  const updateOrderStatus = async (id, data, orders) => {
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
        if (orderStatus === "Pending Approval") {
          getPendingOrders();
        } else if (orderStatus === "Approved") {
          getApprovedOrders();
        } else if (orderStatus === "Shipped") {
          getShippedOrders();
        } else if (orderStatus === "Delivered") {
          getDeliveredOrders();
        }
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

  const updateOrderSteps = async (id, data, orders) => {
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

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <PendingApprovalComponent
            {...{
              pendingOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updatePendingOrderStatus,
              updatePendingOrderSteps,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 1:
        return (
          <ProcessingComponent
            {...{
              approvedOrders,
              updateProcessingOrderSteps,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateProcessingOrderStatus,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 2:
        return (
          <ShippedComponent
            {...{
              shippedOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateShippedOrderStatus,
              updateShippedOrderSteps,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      case 3:
        return (
          <DeliveredComponent
            {...{
              deliveredOrders,
              handleShowStepForm,
              handleChange,
              handleShowCustomerForm,
              handleShowStatusForm,
              updateDeliverdOrderStatus,
              updateDeliverdOrderSteps,
              expanded,
              theme,
              selectedOrderId,
              showContact,
              showStatus,
              showStep,
              updating,
              setOrderStep,
              setOrderStatus,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Orders" subtitle="Managing markertplace orders" />
        </Box>
        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Processing" />
            <Tab label="Shipped" />
            <Tab label="Delivered" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Orders;
