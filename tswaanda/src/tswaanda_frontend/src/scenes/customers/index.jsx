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
import { DataGrid } from "@mui/x-data-grid";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const Customers = () => {
  const [expanded, setExpanded] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);
  const canisterId = "55ger-liaaa-aaaal-qb33q-cai";

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerStatus, setCustomerStatus] = useState("");

  const host = "https://icp0.io";
  const agent = new HttpAgent({ host: host });

  const marketActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCustomers = async () => {
    setIsLoading(true);
    const res = await marketActor.getAllKYC();
    setData(res);
  };

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

      const modfifiedCustomers = data.map((customer) => ({
        ...customer,
        userId: customer.userId.toString(),
        profilePhoto: convertImage(customer.profilePhoto),
        coverPhoto: convertImage(customer.coverPhoto),
        zipCode: Number(customer.zipCode),
        phoneNumber: Number(customer.phoneNumber),
        dateCreated: formatOrderDate(customer.dateCreated),
      }));
      setCustomers(modfifiedCustomers);
      setIsLoading(false);
    }
  }, [data]);

  const theme = useTheme();
  useEffect(() => {
    getCustomers();
  }, []);

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
        const res = await marketActor.updateKYCRequest(
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

  const handleDownloadKYC = (id) => {
    const convertImage = (image) => {
      const fileName = "tswaanda_image.jpeg";

      const blob = new Blob([image.buffer], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      return url;
    };

    const customer = data.find((customer) => customer.id === id);

    if (customer) {
      const downloadUrl = convertImage(customer.coverPhoto) ;
      // saveAs(downloadUrl, "userkyc.png");
      console.log("Image downloaded:", downloadUrl);
    } else {
      console.log("Item not found");
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Active Customers" />

      <Box m="1rem 0 0 0">
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
                    <Button
                      onClick={() => handleDownloadKYC(customer.id)}
                      variant="outlined"
                      size="small"
                      style={{
                        backgroundColor: "white",
                      }}
                    >
                      Download KYC docs
                    </Button>
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
      </Box>
    </Box>
  );
};

export default Customers;
