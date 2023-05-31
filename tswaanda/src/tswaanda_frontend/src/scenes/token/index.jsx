import React, { useEffect, useState } from "react";
import { initContract } from "../../near-config/index";
import Big from "big.js";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";

const gas = Big(3)
  .times(10 ** 13)
  .toFixed();

const Token = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [configData, setConfig] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [usdval, setUSDVal] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [tokenBal, setBal] = useState(null);

  const handleContract = (e) => {
    if (user && e.target.textContent === "Remove Wallet") {
      (function signOut() {
        wallet.signOut();
        window.location.replace(
          window.location.origin + window.location.pathname
        );
      })();
    } else if (!user && e.target.textContent === "Connect Token Contract") {
      (function signIn() {
        wallet.requestSignIn(configData.contractName, "Wallet Block Dice");
      })();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const contractData = await initContract();
      setUser(contractData.currentUser);
      setConfig(contractData.nearConfig);
      setWallet(contractData.walletConnection);
      setContract(contractData.contract);
    }
    fetchData();
  }, []);

  const loadContractInfo = async () => {
    let bal = await contract.ft_balance_of({ account_id: user.accountId });
    if (bal > 0) {
      const formattedBal = bal / 1000000000000000000000000;
      const roundedBal = formattedBal.toFixed(2);
      setUSDVal(roundedBal);
      setBal(formattedBal);
    }
  };

  useEffect(() => {
    if (user) {
      loadContractInfo();
    }
  }, [user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (newAcc != "") {
      try {
        const result = await contract.storage_deposit(
          { account_id: newAcc },
          gas,
          "1250000000000000000000"
        );
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (transferAcc != "" && transferAmnt) {
      try {
        const amount = Big(transferAmnt)
          .times(10 ** 24)
          .toFixed();
        const res = await contract.ft_transfer(
          { receiver_id: transferAcc, amount: amount, memo: memo },
          gas,
          1
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Tswaanda Token" subtitle="Managing tswaanda token" />
        <Button
          variant="contained"
          onClick={handleContract}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Connect Token Contract
        </Button>
      </Box>
    </Box>
  );
};

export default Token;
