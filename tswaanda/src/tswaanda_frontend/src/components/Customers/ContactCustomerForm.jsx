import React, { useState } from 'react'

const ContactCustomerForm = ({ customer, setShowContactForm }) => {

    const [sending, setSending] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")

    const handleEmailSend = async (e) => {
        e.preventDefault()
        console.log("sending")
    }


    console.log("Recieved customer in the component", customer)
    return (
        <div className="">
            <form onSubmit={handleEmailSend}>
                <AccordionDetails>
                    <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                        <DialogTitle
                            sx={{
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: "green",
                            }}
                        >
                            Send an email message to customer
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Subject"
                                type="text"
                                fullWidth
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
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
                            <Button onClick={() => setShowContactForm(false)} variant="outlined" color="error">
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                disabled={sending}
                                color="primary"
                                // onClick={() => updateCustomerStatus(customer.id)}
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

export default ContactCustomerForm