import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  Paper, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import { CloudUpload, CloudDownload } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import InventoryService from '../../services/inventoryService';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    cursor: 'pointer',
  },
}));

const InventoryUpdateForm = ({ onSuccess, onError }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await InventoryService.processInventoryUpdate(file);
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error uploading inventory:', error);
      if (onError) onError(error.message || 'Failed to process inventory file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await InventoryService.downloadTemplate();
    } catch (error) {
      console.error('Error downloading template:', error);
      if (onError) onError('Failed to download template');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Upload Inventory Update
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <StyledPaper
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          elevation={dragActive ? 3 : 1}
          sx={{
            borderColor: dragActive ? 'primary.main' : 'divider',
            mb: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              {file ? file.name : 'Drag & drop your inventory file here, or click to select'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: .xlsx, .xls, .csv
            </Typography>
            <Button
              variant="contained"
              component="label"
              disabled={isUploading}
              sx={{ mt: 1 }}
            >
              Select File
              <VisuallyHiddenInput 
                type="file" 
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </StyledPaper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CloudDownload />}
            onClick={handleDownloadTemplate}
            disabled={isUploading}
          >
            Download Template
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!file || isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
          >
            {isUploading ? 'Processing...' : 'Upload & Update Inventory'}
          </Button>
        </Box>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instructions
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>1</ListItemIcon>
              <ListItemText 
                primary="Download the template" 
                secondary="Use the template to ensure correct formatting" 
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>2</ListItemIcon>
              <ListItemText 
                primary="Fill in your inventory data" 
                secondary="Update the required fields with your inventory information" 
              />
            </ListItem>
            <Divider component="li" />
            <ListItem>
              <ListItemIcon>3</ListItemIcon>
              <ListItemText 
                primary="Upload the file" 
                secondary="The system will process your updates automatically" 
              />
            </ListItem>
          </List>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Note:</strong> Only updates existing products. New products need to be added separately.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InventoryUpdateForm;
