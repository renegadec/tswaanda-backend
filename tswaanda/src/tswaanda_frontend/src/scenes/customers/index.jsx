import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { idlFactory } from "../../../../declarations/marketplace_backend";
import { Actor, HttpAgent } from "@dfinity/agent";

const Customers = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState(null);
  const canisterId = "55ger-liaaa-aaaal-qb33q-cai";

  const host = "https://icp0.io";
  const agent = new HttpAgent({ host: host });

  const marketActor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterId,
  });

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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params) => {
        if (typeof params.value === "string") {
          return params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
        }
        return params.value;
      },
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,
    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
  ];

  const getRowId = (row) => row.id;

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="CUSTOMERS" subtitle="List of Active Customers" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !customers}
          getRowId={getRowId}
          rows={customers || []}
          columns={columns}
        />
      </Box>
    </Box>
  );
};

export default Customers;
