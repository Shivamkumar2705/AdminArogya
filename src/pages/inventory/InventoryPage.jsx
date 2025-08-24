import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Tab, Tabs, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { FileUpload, History, CloudDownload } from '@mui/icons-material';
import InventoryUpdateForm from './InventoryUpdateForm';
import InventoryHistory from './InventoryHistory';
import InventoryUpdateDetails from './InventoryUpdateDetails';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleViewDetails = (update) => {
    setSelectedUpdate(update);
    setActiveTab(2); // Switch to details tab
  };

  const handleBackToList = () => {
    setSelectedUpdate(null);
    setActiveTab(1); // Switch back to history tab
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Inventory Management
        </Typography>
        
        <Card>
          <CardContent>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab icon={<FileUpload />} label="Upload Inventory" />
              <Tab icon={<History />} label="Update History" />
              {selectedUpdate && <Tab label="Update Details" />}
            </Tabs>

            {activeTab === 0 && (
              <InventoryUpdateForm 
                onSuccess={() => {
                  showSnackbar('Inventory update started successfully');
                  setActiveTab(1); // Switch to history tab after successful upload
                }}
                onError={(error) => {
                  showSnackbar(error || 'Failed to process inventory update', 'error');
                }}
              />
            )}

            {activeTab === 1 && (
              <InventoryHistory 
                onViewDetails={handleViewDetails}
                showSnackbar={showSnackbar}
              />
            )}

            {activeTab === 2 && selectedUpdate && (
              <InventoryUpdateDetails 
                updateId={selectedUpdate._id}
                onBack={handleBackToList}
                showSnackbar={showSnackbar}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InventoryPage;
