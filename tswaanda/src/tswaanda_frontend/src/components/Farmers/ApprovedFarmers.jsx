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
import ContactFarmer from './ContactFarmer';

const ApprovedFarmers = ({
    approvedFarmers,
    updateFarmerStatus,
    setFarmerStatus,
    expanded,
    showStatus,
    updating,
    selectedFarmerId,
    handleChange
}) => {

    const theme = useTheme();

    const [showContact, setShowContactForm] = useState(false);
    const [showStatusForm, setShowStatusForm] = useState(false);

    const showContactForm = () => {
        setShowContactForm(!showContact);
        setShowStatusForm(false);
    }

    const handleShowStatusForm = () => {
        setShowStatusForm(!showStatusForm);
        setShowContactForm(false);
    }

    return (
        <Box m="1rem 0 0 0">
            {approvedFarmers?.map((farmer) => (
                <Accordion
                    key={farmer.id}
                    expanded={expanded === farmer.id}
                    onChange={handleChange(farmer.id)}
                    sx={{ backgroundColor: theme.palette.background.alt }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography sx={{ width: "25%", flexShrink: 0 }}>
                            <span style={{ fontWeight: "bold" }}>Username</span>: @
                            {farmer.fullName}
                        </Typography>
                        <Typography
                            sx={{ color: "text.secondary", width: "25%", flexShrink: 0 }}
                        >
                            <span style={{ fontWeight: "bold" }}>Email</span>:{" "}
                            {farmer.email}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Status</span>:{" "}
                            {farmer.isVerified ? "Approved" : "Pending"}
                        </Typography>
                        <Typography sx={{ color: "text.secondary", width: "25%" }}>
                            <span style={{ fontWeight: "bold" }}>Date</span>:{" "}
                            {farmer.created}
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
                                        farmer
                                        xs={6}
                                    >
                                        <Typography
                                            style={{ fontSize: "2rem", fontWeight: "bold" }}
                                        >
                                            {farmer.fullName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <hr />
                                <AccordionSummary
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Username</span>:
                                        {farmer.fullName}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            width: "50%",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>Phone Number</span>:{" "}
                                        {farmer.phone}
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
                                        {farmer.country}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Organization</span>:
                                        {farmer.organization}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionSummary>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>About</span>:{" "}
                                        {farmer.about}
                                    </Typography>
                                    <Typography sx={{ width: "50%", flexShrink: 0 }}>
                                        <span style={{ fontWeight: "bold" }}>Address</span>:{" "}
                                        {farmer.streetAdrees}
                                    </Typography>
                                </AccordionSummary>
                                <hr />
                                <CardActions>
                                    <Button
                                        onClick={() => handleShowStatusForm(farmer.id)}
                                        variant="outlined"
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                selectedFarmerId === farmer.id && showStatus
                                                    ? "white"
                                                    : undefined,
                                            color:
                                                selectedFarmerId === farmer.id && showStatus
                                                    ? "green"
                                                    : "white",
                                        }}
                                    >
                                        Update Farmer status
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
                                        Contact Farmer
                                    </Button>
                                </CardActions>
                            </Container>

                            {showStatusForm && (
                                <div className="">
                                    <AccordionDetails>
                                        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                                            <FormControl fullWidth margin="dense">
                                                <InputLabel id="status-label">
                                                    Farmer status
                                                </InputLabel>
                                                <Select
                                                    labelId="status-label"
                                                    onChange={(e) => setFarmerStatus(e.target.value)}
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
                                                onClick={() => updateFarmerStatus(farmer.id)}
                                                sx={{
                                                    backgroundColor: theme.palette.secondary.light,
                                                    color: theme.palette.background.alt,
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                    padding: "10px 20px",
                                                }}
                                            >
                                                {updating ? "Updating..." : "Update Farmer"}
                                            </Button>
                                        </Container>
                                    </AccordionDetails>
                                </div>
                            )}
                            {showContact && (
                                <ContactFarmer {...{ farmer, setShowContactForm, theme }} />
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    )
}

export default ApprovedFarmers