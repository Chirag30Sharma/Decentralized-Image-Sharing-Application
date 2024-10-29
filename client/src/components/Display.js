import { useState } from "react";
import styled from "styled-components";
import { 
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";

const StyledPaper = styled(Paper)`
  padding: 24px;
  margin: 24px 0;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05) !important;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    img {
      transform: scale(1.05);
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  const getdata = async () => {
    if (!contract) {
      setError("Contract not initialized");
      return;
    }

    setLoading(true);
    setError("");
    setData([]);

    try {
      const address = searchAddress || account;
      const dataArray = await contract.display(address);

      if (!dataArray || dataArray.length === 0) {
        throw new Error("No images to display");
      }

      const images = dataArray.map(item => {
        const ipfsHash = item.split("/").pop();
        return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      });

      setData(images);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          View Images
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Ethereum Address (optional)"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={getdata}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            {loading ? "Loading..." : "Search"}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <AnimatePresence>
          {data.length > 0 && (
            <ImageList cols={3} gap={16}>
              {data.map((url, index) => (
                <ImageListItem key={index}>
                  <ImageContainer
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <img
                        src={url}
                        alt={`Item ${index + 1}`}
                        loading="lazy"
                        onError={(e) => {
                          console.error("Image failed to load:", url);
                          e.target.style.display = 'none';
                        }}
                      />
                    </a>
                  </ImageContainer>
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </AnimatePresence>
      </StyledPaper>
    </motion.div>
  );
};

export default Display;