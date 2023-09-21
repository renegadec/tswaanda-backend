import React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const IdentficationDoc = ({ setIDModal, openIDModal, showIdentificationDoc, customer }) => {
  const theme = useTheme();

  const handlePOAModalClose = () => {
    setIDModal(false);
    showIdentificationDoc()
  };

  const newPlugin = defaultLayoutPlugin()
  console.log(customer)
  return (
    <div>
      <BootstrapDialog
        onClose={handlePOAModalClose}
        aria-labelledby="customized-dialog-title"
        open={openIDModal}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: theme.palette.background.alt }} id="customized-dialog-title">
          Proof of Address Document
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handlePOAModalClose}
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
        <DialogContent dividers sx={{ backgroundColor: theme.palette.background.alt, }}>
          <div className="" style={{ width: "900px", height: "900px", overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {customer
                && (
                  <Viewer fileUrl={customer.kycIDCopy} plugins={[newPlugin]} />

                )}
            </Worker>
          </div>
        </DialogContent>
      </BootstrapDialog>
    </div>
  )
}

export default IdentficationDoc