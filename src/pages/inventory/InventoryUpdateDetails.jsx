import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { formatDistanceToNow, format } from 'date-fns';
import InventoryService from '../../services/inventoryService';

const ErrorItem = ({ error }) => (
  <ListItem alignItems="flex-start" sx={{ pl: 4 }}>
    <ListItemIcon sx={{ minWidth: 32 }}>
      <ErrorIcon color="error" fontSize="small" />
    </ListItemIcon>
    <ListItemText
      primary={error.error || 'Unknown error'}
      secondary={
        <>
          <Typography component="span" variant="body2" color="text.primary">
            Row: {error.row}
          </Typography>
          {error.itemName && (
            <Typography component="div" variant="body2">
              Item: {error.itemName}
            </Typography>
          )}
          {error.itemCode && (
            <Typography component="div" variant="body2">
              Code: {error.itemCode}
            </Typography>
          )}
        </>
      }
    />
  </ListItem>
);

const InventoryUpdateDetails = ({ updateId, onBack, showSnackbar }) => {
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(null);
  const [expanded, setExpanded] = useState({
    summary: true,
    errors: false,
  });

  const fetchUpdateDetails = async () => {
    try {
      setLoading(true);
      const response = await InventoryService.getInventoryUpdateDetails(updateId);
      setUpdate(response.data);
    } catch (error) {
      console.error('Error fetching update details:', error);
      showSnackbar('Failed to load update details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updateId) {
      fetchUpdateDetails();
    }
  }, [updateId]);

  const handleToggleSection = (section) => {
    setExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!update) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Update details not found.
      </Alert>
    );
  }

  const getStatusIcon = () => {
    switch (update.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'processing':
        return <CircularProgress size={24} />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Box>
      <Button
        startIcon={<BackIcon />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to History
      </Button>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="div">
              Update Details
            </Typography>
            <Box display="flex" alignItems="center">
              <Box mr={1}>
                {getStatusIcon()}
              </Box>
              <Chip
                label={update.status?.toUpperCase() || 'UNKNOWN'}
                color={
                  update.status === 'completed'
                    ? 'success'
                    : update.status === 'failed'
                    ? 'error'
                    : 'info'
                }
                size="small"
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Filename"
                    secondary={update.filename || 'N/A'}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Processed By"
                    secondary={
                      update.processedBy?.name || 'System'
                    }
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Started"
                    secondary={
                      update.createdAt
                        ? format(new Date(update.createdAt), 'PPpp')
                        : 'N/A'
                    }
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Duration"
                    secondary={
                      update.updatedAt && update.createdAt
                        ? formatDistanceToNow(new Date(update.updatedAt), {
                            addSuffix: true,
                          })
                        : 'N/A'
                    }
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="File Type"
                    secondary={update.fileType?.toUpperCase() || 'N/A'}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="File Size"
                    secondary={
                      update.metadata?.size
                        ? `${Math.round(update.metadata.size / 1024)} KB`
                        : 'N/A'
                    }
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleToggleSection('summary')}
            >
              <Typography variant="subtitle1">Summary</Typography>
              <IconButton size="small">
                {expanded.summary ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Divider />
            <Collapse in={expanded.summary} timeout="auto" unmountOnExit>
              <CardContent>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Items</TableCell>
                        <TableCell align="right">
                          {update.summary?.totalItems || 0}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Successfully Updated</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            {update.summary?.updated || 0}
                            {update.summary?.totalItems > 0 && (
                              <Chip
                                label={`${Math.round(
                                  ((update.summary?.updated || 0) /
                                    update.summary?.totalItems) *
                                    100
                                )}%`}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Failed</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            {update.summary?.failed || 0}
                            {update.summary?.totalItems > 0 && (
                              <Chip
                                label={`${Math.round(
                                  ((update.summary?.failed || 0) /
                                    update.summary?.totalItems) *
                                    100
                                )}%`}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{ cursor: 'pointer' }}
              onClick={() => handleToggleSection('errors')}
            >
              <Box display="flex" alignItems="center">
                <Typography variant="subtitle1">Errors & Warnings</Typography>
                {update.summary?.errors?.length > 0 && (
                  <Chip
                    label={update.summary.errors.length}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              <IconButton size="small">
                {expanded.errors ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            <Divider />
            <Collapse in={expanded.errors} timeout="auto" unmountOnExit>
              <CardContent>
                {update.summary?.errors?.length > 0 ? (
                  <List dense>
                    {update.summary.errors.map((error, index) => (
                      <React.Fragment key={index}>
                        <ErrorItem error={error} />
                        {index < update.summary.errors.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    No errors found in this update.
                  </Alert>
                )}
              </CardContent>
            </Collapse>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InventoryUpdateDetails;
