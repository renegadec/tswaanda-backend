import React, { useState } from 'react'
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Container,
    TextField,
    Button,
} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import { sendFarmerEmailMessage } from '../../emails/farmers';
import { toast } from "react-toastify";


const ContactFarmer = ({ customer, setShowContactForm, theme }) => {

    const [sending, setSending] = useState(false)
    const [message, setMessage] = useState("")

    const handleEmailSend = async (e) => {
        e.preventDefault()
        setSending(true)
        console.log("sending")
        try {
            if (message !== "") {
                await sendFarmerEmailMessage(message, customer.email)
                toast.success(
                    `Message sent to ${customer.email} `,
                    {
                        autoClose: 5000,
                        position: "top-center",
                        hideProgressBar: true,
                    }
                );
                setSending(false)
            }
        } catch (error) {
            console.log("Error sending email", error)
            toast.error(
                `Error sending message to ${customer.email} `,
                {
                    autoClose: 5000,
                    position: "top-center",
                    hideProgressBar: true,
                }
            );
            setSending(false)
        }
    }

    return (
        <div className="">
            <form onSubmit={handleEmailSend}>
                <AccordionDetails>
                    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                        <DialogTitle
                            sx={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            Is there a problem with the customer KYC? Let them know.
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Message"
                                type="text"
                                multiline
                                rows={4}
                                defaultValue="Default Value"
                                fullWidth
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowContactForm(false)} variant="contained" sx={{
                                backgroundColor: theme.palette.secondary.light,
                                color: theme.palette.background.alt,
                                fontSize: "14px",
                                fontWeight: "bold",
                                padding: "10px 20px",
                            }} >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                disabled={sending}
                                color="primary"
                                onClick={handleEmailSend}
                                sx={{
                                    backgroundColor: theme.palette.secondary.light,
                                    color: theme.palette.background.alt,
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    padding: "10px 20px",
                                }}
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </Button>
                        </DialogActions>
                    </Container>
                </AccordionDetails>
            </form>
        </div>
    )
}

export default ContactFarmer