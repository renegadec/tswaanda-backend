import React, { useEffect, useState } from "react";
import { initContract } from "../../near-config/index";
import Big from "big.js";
import { toast } from "react-toastify";
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  TextField,
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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Header from "../../components/Header";

const gas = Big(3)
  .times(10 ** 13)
  .toFixed();

const Wallet = () => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const [user, setUser] = useState(null);
  const [configData, setConfig] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [usdval, setUSDVal] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [tokenBal, setBal] = useState(null);

  const [balance, setBalance] = useState(0);
  const [tokenAmount, setTokenAmount] = useState('');
  const [account, setAccount] = useState('');

  // Logic for sending tokens
  const handleSendTokens = () => {
    console.log('Sending tokens:', tokenAmount, 'to account:', account);
  };

  // Logic for adding an account
  const handleAddAccount = () => {
    console.log('Adding account:', account);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleContract = (e) => {
    if (user && e.target.textContent === "Remove Wallet") {
      (function signOut() {
        wallet.signOut();
        window.location.replace(
          window.location.origin + window.location.pathname
        );
      })();
    } else if (!user && e.target.textContent === "Connect Wallet") {
      (function signIn() {
        wallet.requestSignIn(configData.contractName, "Wallet Block Dice");
      })();
    }
  };

  useEffect(() => {
    async function fetchData() {
      const contractData = await initContract();
      console.log(contractData);
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
    <div>
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
                Connect Wallet
              </Button>
          </Box>
      </Box>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{backgroundColor: theme.palette.background.alt}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Wallet Balance
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Total balance in admin wallet</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Balance
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{backgroundColor: theme.palette.background.alt}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Send</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Send tokens to user(s).
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <TextField
              label="Token Amount"
              fullWidth
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <TextField
              label="Account"
              fullWidth
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSendTokens} 
                    sx={{
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.background.alt,
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                      }}>
              Send Tokens
            </Button>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} sx={{backgroundColor: theme.palette.background.alt}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            Register user
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Add new user wallet.
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container maxWidth="sm" style={{ marginTop: '2rem' }}>

            <TextField
              label="Account"
              fullWidth
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              style={{ marginBottom: '1rem' }}
            />

            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSendTokens} 
                    sx={{
                        backgroundColor: theme.palette.secondary.light,
                        color: theme.palette.background.alt,
                        fontSize: "14px",
                        fontWeight: "bold",
                        padding: "10px 20px",
                      }}>
              Register
            </Button>
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} sx={{backgroundColor: theme.palette.background.alt}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>Transaction History</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Transaction History
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Transaction history
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Wallet;
