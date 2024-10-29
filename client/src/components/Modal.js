import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Custom dark theme for MUI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

// Styled components
const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 16px;
    min-width: 400px;

    @media (max-width: 600px) {
      min-width: 300px;
      margin: 16px;
    }
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 16px;
`;

const StyledButton = styled(Button)`
  text-transform: none;
  padding: 8px 24px;
  border-radius: 8px;
`;

const Modal = ({ setModalOpen, contract }) => {
  const [address, setAddress] = useState("");
  const [accessList, setAccessList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccessList = async () => {
      if (!contract) return;
      
      try {
        const addresses = await contract.shareAccess();
        setAccessList(addresses);
      } catch (error) {
        console.error("Error fetching access list:", error);
        setError("Failed to fetch access list");
      }
    };

    fetchAccessList();
  }, [contract]);

  const handleShare = async () => {
    if (!address) {
      setError("Please enter an address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await contract.allow(address);
      setModalOpen(false);
    } catch (error) {
      console.error("Error sharing access:", error);
      setError(error.message || "Failed to share access");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StyledDialog 
            open={true} 
            onClose={() => setModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <StyledDialogTitle>
              Share Access
              <IconButton 
                onClick={() => setModalOpen(false)}
                size="small"
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            </StyledDialogTitle>

            <StyledDialogContent>
              <TextField
                label="Ethereum Address"
                variant="outlined"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={!!error}
                helperText={error}
                placeholder="Enter address to share with"
              />

              {accessList.length > 0 && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Current Access List
                  </Typography>
                  {accessList.map((addr, index) => (
                    <TextField
                      key={index}
                      value={addr}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              )}
            </StyledDialogContent>

            <DialogActions sx={{ padding: 2, gap: 1 }}>
              <StyledButton
                onClick={() => setModalOpen(false)}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </StyledButton>
              <StyledButton
                onClick={handleShare}
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Sharing..." : "Share Access"}
              </StyledButton>
            </DialogActions>
          </StyledDialog>
        </motion.div>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default Modal;