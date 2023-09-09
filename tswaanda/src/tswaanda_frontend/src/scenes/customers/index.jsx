import React, { useEffect, useState } from "react";
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
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { canister} from "../../config";
import Pending from "../../components/Customers/Pending";
import Approved from "../../components/Customers/Approved";

const Customers = () => {
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);
  const [data, setData] = useState(null);
  const [pendingCustomers, setPendingCustomers] = useState(null);
  const [approvedCustomers, setApprovedCustomers] = useState(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("");
  const [value, setValue] = useState(0);

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
    setPendingCustomers(convertedCustomers);
  }

  const getApprovedCustomers = async () => {
    console.log(canister)
    const res = await canister.getApprovedKYC()
    const sortedData = res.sort(
      (a, b) => Number(b.dateCreated) - Number(a.dateCreated)
    );
    const convertedCustomers = convertData(sortedData);
    setApprovedCustomers(convertedCustomers);
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
      setCustomers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    getCustomers();
    getPendingCustomers();
  }, []);

  useEffect(() => {
    if (value === 0 && !pendingCustomers) {
      getPendingCustomers();
    } else if (value === 1 && !approvedCustomers) {
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
        toast.success(
          `Customer status have been updated to ${customerStatus} `,
          {
            autoClose: 5000,
            position: "top-center",
            hideProgressBar: true,
          }
        );
        const customerPosition = customers.findIndex(
          (customer) => customer.id === id
        );
        customers[customerPosition].status = customerStatus;
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
          <Pending
            {...{
              pendingCustomers,
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
          <Approved
            {...{
              approvedCustomers,
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
          <Header title="CUSTOMERS" subtitle="List of Active Customers" />
        </Box>

        <Box m="2.5rem 0 0 0">
          <Tabs value={value} onChange={handleTabChange}>
            <Tab label="Pending Approval" />
            <Tab label="Approved" />
          </Tabs>
        </Box>
        {renderTabContent()}
      </Box>
      {/* <Box m="1rem 0 0 0">
          {customers?.map((customer) => (
            <Accordion
              key={customer.id}
              expanded={expanded === customer.id}
              onChange={handleChange(customer.id)}
              sx={{ backgroundColor: theme.palette.background.alt }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography sx={{ width: "25%", flexShrink: 0 }}>
                  <span style={{ fontWeight: "bold" }}>Username</span>: @
                  {customer.userName}
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                >
                  <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                  {customer.email}
                </Typography>
                <Typography sx={{ color: "text.secondary", width: "25%" }}>
                  <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
                  {customer.status}
                </Typography>
                <Typography sx={{ color: "text.secondary", width: "25%" }}>
                  <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                  {customer.dateCreated}
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
                  <Container maxWidth="md" style={{ marginTop: "2rem" }}>
                    <Grid
                      container
                      style={{ display: "flex", alignItems: "center" }}
                      spacing={4}
                      m="0 0.1rem 0 0.1rem"
                    >
                      <Grid
                        style={{ display: "flex", alignItems: "center" }}
                        customer
                        xs={6}
                      >
                        <Typography
                          style={{ fontSize: "2rem", fontWeight: "bold" }}
                        >
                          {customer.firstName}
                        </Typography>
                        <Typography
                          style={{ fontSize: "2rem", fontWeight: "bold" }}
                          m="0 0 0 2rem"
                        >
                          {customer.lastName}
                        </Typography>
                      </Grid>
                      <Grid customer xs={6}>
                        <Box
                          component="img"
                          alt="profile"
                          src={customer.profilePhoto}
                          height="200px"
                          width="200px"
                          sx={{ objectFit: "cover" }}
                        />
                      </Grid>
                    </Grid>
                    <hr />
                    <AccordionSummary
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography sx={{ width: "50%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Username</span>:
                        {customer.userName}
                      </Typography>
                      <Typography
                        sx={{
                          width: "50%",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                        {customer.phoneNumber}
                      </Typography>
                    </AccordionSummary>
                    <AccordionSummary>
                      <Typography
                        sx={{
                          width: "50%",
                          flexShrink: 0,
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>Country</span>:{" "}
                        {customer.country}
                      </Typography>
                      <Typography sx={{ width: "50%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Organization</span>:
                        {customer.organization}
                      </Typography>
                    </AccordionSummary>
                    <AccordionSummary>
                      <Typography sx={{ width: "50%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>About</span>:{" "}
                        {customer.about}
                      </Typography>
                      <Typography sx={{ width: "50%", flexShrink: 0 }}>
                        <span style={{ fontWeight: "bold" }}>Address</span>:{" "}
                        {customer.streetAdrees}
                      </Typography>
                    </AccordionSummary>
                    <hr />
                    <CardActions>
                      <Button
                        onClick={() => handleShowStatusForm(customer.id)}
                        variant="outlined"
                        size="small"
                        style={{
                          backgroundColor:
                            selectedCustomerId === customer.id && showStatus
                              ? "white"
                              : undefined,
                          color:
                            selectedCustomerId === customer.id && showStatus
                              ? "green"
                              : "white",
                        }}
                      >
                        Update Customer status
                      </Button>
                      <a href={customer.profilePhoto}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          style={{
                            backgroundColor: "white",
                          }}
                        >
                          Download KYC docs
                        </Button>
                      </a>
                    </CardActions>
                  </Container>

                  {selectedCustomerId === customer.id && showStatus && (
                    <div className="">
                      <AccordionDetails>
                        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                          <FormControl fullWidth margin="dense">
                            <InputLabel id="status-label">
                              Customer status
                            </InputLabel>
                            <Select
                              labelId="status-label"
                              onChange={(e) => setCustomerStatus(e.target.value)}
                            >
                              <MenuItem value="pending">
                                Pending Approval
                              </MenuItem>
                              <MenuItem value="Approved">Approved</MenuItem>
                            </Select>
                          </FormControl>

                          <Button
                            variant="contained"
                            disabled={updating}
                            color="primary"
                            onClick={() => updateCustomerStatus(customer.id)}
                            sx={{
                              backgroundColor: theme.palette.secondary.light,
                              color: theme.palette.background.alt,
                              fontSize: "14px",
                              fontWeight: "bold",
                              padding: "10px 20px",
                            }}
                          >
                            {updating ? "Updating..." : "Update customer"}
                          </Button>
                        </Container>
                      </AccordionDetails>
                    </div>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box> */}
    </div>
  );
};

export default Customers;
