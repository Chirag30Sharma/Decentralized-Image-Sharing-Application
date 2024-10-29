import { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Chip 
} from "@mui/material";
import { motion } from "framer-motion";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#0a1929",
      paper: "rgba(255, 255, 255, 0.05)",
    },
  },
});

const StyledContainer = styled(Container)`
  padding-top: 24px;
  padding-bottom: 24px;
`;

const AccountPaper = styled(Paper)`
  padding: 16px;
  margin: 24px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05) !important;
`;

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );

        setContract(contract);
        setProvider(provider);
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    if (window.ethereum) {
      loadBlockchainData();
    } else {
      alert("Please install MetaMask to use this application");
    }
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Decentralized Image Share
            </Typography>
            <Button 
              color="secondary" 
              variant="contained"
              onClick={() => setModalOpen(true)}
              disabled={!account}
            >
              Share Access
            </Button>
          </Toolbar>
        </AppBar>

        <StyledContainer maxWidth="lg">
          <AccountPaper elevation={3}>
            <Typography variant="body1">
              Account Status
            </Typography>
            {account ? (
              <Chip 
                label={account}
                color="success"
                variant="outlined"
                sx={{ 
                  maxWidth: { xs: '200px', sm: '300px', md: 'none' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
            ) : (
              <Chip 
                label="Not Connected"
                color="error"
                variant="outlined"
              />
            )}
          </AccountPaper>

          <FileUpload 
            account={account} 
            provider={provider} 
            contract={contract} 
          />
          
          <Display 
            contract={contract} 
            account={account} 
          />
        </StyledContainer>

        {modalOpen && (
          <Modal 
            setModalOpen={setModalOpen} 
            contract={contract} 
          />
        )}
      </motion.div>
    </ThemeProvider>
  );
}

export default App;