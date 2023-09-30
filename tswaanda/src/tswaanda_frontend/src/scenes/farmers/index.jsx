import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { canister } from "../../config";
import PendingFarmers from "../../components/Farmers/PendingFarmers";
import ApprovedFarmers from "../../components/Farmers/ApprovedFarmers";
import FarmerListing from "../../scenes/farmerlisting";

const Farmers = () => {
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [farmers, setFarmers] = useState(null);
  const [data, setData] = useState(null);
  const [pendingFarmers, setPendingFarmers] = useState(null);
  const [approvedFarmers, setApprovedFarmers] = useState(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("");
  const [value, setValue] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const handleListButton = () => {
    setIsOpen(true);
  };

  const handleListPopClose = () => {
    setIsOpen(false);
  };

  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getPendingCustomers = async () => {
    const res = await canister.getPendingKYCReaquest()
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    const convertedCustomers = convertData(sortedData);
    setPendingFarmers(convertedCustomers);
  }

  const getApprovedCustomers = async () => {
    console.log(canister)
    const res = await canister.getApprovedKYC()
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    const convertedCustomers = convertData(sortedData);
    setApprovedFarmers(convertedCustomers);
  }

  function convertData(data) {
    if (!data) {
      return [];
    }

    const formatCustomerDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatCustomerTime = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleTimeString("en-US", options);
    };

    const modifiedOrder = data.map((customer) => {


      const formattedDate = formatCustomerDate(customer.dateCreated);
      const formattedTime = formatCustomerTime(customer.dateCreated);

      return {
        ...customer,
        step: Number(customer.step),
        dateCreated: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modifiedOrder;
  }

  const getCustomers = async () => {
    setIsLoading(true);
    const res = await canister.getAllKYC();
    setData(res);
  };

  useEffect(() => {
    if (data) {

      const formatCustomerDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        return date.toLocaleDateString();
      };

      const modfifiedCustomers = data.map((customer) => ({
        ...customer,
        userId: customer.userId.toString(),
        zipCode: Number(customer.zipCode),
        phoneNumber: Number(customer.phoneNumber),
        dateCreated: formatCustomerDate(customer.dateCreated),
      }));
      setFarmers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getCustomers();
    getPendingCustomers();
  }, []);

  useEffect(() => {
    if (value === 0 && !pendingFarmers) {
      getPendingCustomers();
    } else if (value === 1 && !approvedFarmers) {
      getApprovedCustomers();
    }
  }, [value]);

  const handleShowStatusForm = (id) => {
    setSelectedCustomerId(id);
    setShowStatus(true);
  };

  const updateCustomerStatus = async (id) => {
    if (data && customerStatus != "") {
      setUpdating(true);
      const customerIndex = data.findIndex((customer) => customer.id === id);

      if (customerIndex !== -1) {
        data[customerIndex].status = customerStatus;
        let userId = data[customerIndex].userId;
        const res = await canister.updateKYCRequest(
          userId,
          data[customerIndex]
        );
        if (customerStatus === "approved") {
          await sendAutomaticEmailMessage(data[customerIndex].firstName, data[customerIndex].email)
        }
        toast.success(
          `Customer status have been updated to ${customerStatus} ${customerStatus === "approved" ? ", Approval email have been sent" : ""} `,
          {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        const customerPosition = farmers.findIndex(
          (customer) => customer.id === id
        );
        farmers[customerPosition].status = customerStatus;
        setUpdating(false);
        setSelectedCustomerId(null);
      } else {
        toast.warning("Customer not found", {
          autoClose: 5000,
          position: "top-center",
          hideProgressBar: true,
        });
      }
    }
  };

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return (
          <PendingFarmers
            {...{
              pendingFarmers,
              updateCustomerStatus,
              handleShowStatusForm,
              setCustomerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedCustomerId,
              customerStatus,
              handleChange,

            }}
          />
        );
      case 1:
        return (
          <ApprovedFarmers
            {...{
              approvedFarmers,
              updateCustomerStatus,
              handleShowStatusForm,
              setCustomerStatus,
              expanded,
              showStatus,
              updating,
              isLoading,
              selectedCustomerId,
              customerStatus,
              handleChange,

            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <Box m="1.5rem 2.5rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="Farmers" subtitle="List of Active Farmers" />
          <Button
            variant="contained"
            onClick={handleListButton}
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <AddIcon sx={{ mr: "10px" }} />
            List New Farmer
          </Button>
          {isOpen && (
          <FarmerListing
            
            isOpen={isOpen}
            onClose={handleListPopClose}
          />
        )}
        </Box>

        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="PendingFarmers Approval" />
            <Tab label="ApprovedFarmers" />
            <Tab label="Suspended" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
    </div>
  );
};

export default Farmers;
