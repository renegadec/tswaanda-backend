import React, { useState } from 'react'
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
    Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IdentficationDoc from './IdentficationDoc';
import ProofOfAddress from './ProofOfAddress';
import ContactCustomerForm from './ContactCustomerForm';

const Approved = ({
    approvedCustomers,
    updateCustomerStatus,
    setCustomerStatus,
    expanded,
    showStatus,
    updating,
    selectedCustomerId,
    handleChange
}) => {

    const theme = useTheme();

    const [showContact, setShowContactForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);
    const [showIdentification, setShowIdentification] = useState(false);
    const [showProofOfAddress, setShowProofOfAddress] = useState(false);

    const [openPOAModal, setPOAModal] = useState(false);
    const [openIDModal, setIDModal] = useState(false);

    const showContactForm = () => {
        setShowContactForm(!showContact);
        setShowStatusForm(false);
        setShowIdentification(false);
        setShowProofOfAddress(false);
    }

    const showIdentificationDoc = () => {
        setShowIdentification(!showIdentification);
        setIDModal(!openIDModal)
        setShowStatusForm(false);
        setShowContactForm(false);
        setShowProofOfAddress(false);
    }

    const showProofOfAddressDoc = () => {
        setShowProofOfAddress(!showProofOfAddress);
        setPOAModal(!openPOAModal)
        setShowStatusForm(false);
        setShowContactForm(false);
        setShowIdentification(false);
    }

    const handleShowStatusForm = () => {
        setShowStatusForm(!showStatusForm);
        setShowContactForm(false);
        setShowIdentification(false);
        setShowProofOfAddress(false);
    }

    return (
        <Box m="1rem 0 0 0">
            {approvedCustomers?.map((customer) => (
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
                                        onClick={showContactForm}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showContact
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showContact
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Contact customer
                                    </Button>
                                    <Button
                                        onClick={showIdentificationDoc}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showIdentification
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showIdentification
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        View Identification
                                    </Button>
                                    <Button
                                        onClick={showProofOfAddressDoc}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                showProofOfAddress
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                showProofOfAddress
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        View Proof of Address
                                    </Button>
                                </CardActions>
                            </Container>

                            {showStatusForm && (
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
                                                    <MenuItem value="approved">Approved</MenuItem>
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
                            {showContact && (
                                <ContactCustomerForm {...{ customer, setShowContactForm, theme }} />
                            )}
                            {showIdentification && (
                                <IdentficationDoc {...{ setIDModal, openIDModal, showIdentificationDoc, customer }} />
                            )}
                            {showProofOfAddress && (
                                <ProofOfAddress {...{ openPOAModal, setPOAModal, showProofOfAddressDoc, customer }} />
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )
}

export default Approved