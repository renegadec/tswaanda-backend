import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Button,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AccordionDetails from "@mui/material/AccordionDetails";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const UpdateOderStatus = ({ openStatusModal, updatePendingOrderStatus, setStatusModal, setOrderStatus, updating, theme, order, updated,
    setUpdated, }) => {

    const handleStatusModalClose = () => {
        setStatusModal(false);
    }

    const handleUpdateOrderStatus = async () => {
        updatePendingOrderStatus(order.orderId)
    }

    useEffect(() => {
        if (updated) {
            setStatusModal(false)
            setUpdated(false)
        }
    }, [updated])

    return (
        <div>
            <BootstrapDialog
                onClose={handleStatusModalClose}
                aria-labelledby="customized-dialog-title"
                open={openStatusModal}
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
                    Update Order Status
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleStatusModalClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: "white",
                        backgroundColor: theme.palette.background.alt
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, minWidth: '600px' }}>
                    <div className="" style={{ minWidth: '500px' }}>
                        <AccordionDetails>
                            <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel id="status-label">Order status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        onChange={(e) => setOrderStatus(e.target.value)}
                                    >
                                        <MenuItem value="Pending Approval">
                                            Pending Approval
                                        </MenuItem>
                                        <MenuItem value="Approved">
                                            Approved-processing
                                        </MenuItem>
                                        <MenuItem value="Shipped">Shipped</MenuItem>
                                        <MenuItem value="Delivered">Delivered</MenuItem>
                                    </Select>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    disabled={updating}
                                    color="primary"
                                    onClick={handleUpdateOrderStatus}
                                    sx={{
                                        backgroundColor: theme.palette.secondary.light,
                                        color: theme.palette.background.alt,
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        padding: "10px 20px",
                                    }}
                                >
                                    {updating ? "Updating..." : "Update order"}
                                </Button>
                            </Container>
                        </AccordionDetails>
                    </div>

                </DialogContent>
            </BootstrapDialog>
        </div>
    )
}

export default UpdateOderStatus