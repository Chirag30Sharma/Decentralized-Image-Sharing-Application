import { useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { 
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const StyledPaper = styled(Paper)`
  padding: 24px;
  margin: 24px 0;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05) !important;
`;

const UploadButton = styled(Button)`
  margin: 16px 0;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      await contract.add(account, ImgHash);
      
      setFileName("No image selected");
      setFile(null);
    } catch (e) {
      setError("Failed to upload image. Please try again.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    if (!data) return;

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data.name);
    setError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper elevation={3}>
        <Typography variant="h6" gutterBottom>
          Upload Image
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <label htmlFor="file-upload">
              <HiddenInput
                id="file-upload"
                type="file"
                onChange={retrieveFile}
                accept="image/*"
                disabled={!account || uploading}
              />
              <Button
                component="span"
                variant="outlined"
                color="primary"
                startIcon={<CloudUploadIcon />}
                disabled={!account || uploading}
              >
                Choose Image
              </Button>
            </label>

            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              {fileName}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            <UploadButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={!file || uploading || !account}
              startIcon={uploading && <CircularProgress size={20} />}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </UploadButton>
          </Box>
        </form>
      </StyledPaper>
    </motion.div>
  );
};

export default FileUpload;